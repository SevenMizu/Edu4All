package edu4all.websocket;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * Very simple room‐based relay: any message one client sends
 * is forwarded to all the other clients in the same room.
 */
@Component
public class SignalingHandler extends TextWebSocketHandler {

    // roomId → set of WebSocketSession in that room
    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String path   = session.getUri().getPath();         // e.g. "/ws/rooms/1"
        String roomId = path.substring(path.lastIndexOf('/') + 1);
        rooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet())
             .add(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message)
            throws Exception {
        String path   = session.getUri().getPath();
        String roomId = path.substring(path.lastIndexOf('/') + 1);

        Set<WebSocketSession> participants = rooms.get(roomId);
        if (participants != null) {
            for (WebSocketSession peer : participants) {
                // don't echo back to the sender
                if (!peer.getId().equals(session.getId()) && peer.isOpen()) {
                    peer.sendMessage(message);
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String path   = session.getUri().getPath();
        String roomId = path.substring(path.lastIndexOf('/') + 1);

        Set<WebSocketSession> participants = rooms.get(roomId);
        if (participants != null) {
            participants.remove(session);
            if (participants.isEmpty()) {
                rooms.remove(roomId);
            }
        }
    }
}
