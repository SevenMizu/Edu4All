package edu4all.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu4all.dto.SessionRequest;
import edu4all.dto.UpdateMeetingRequest;
import edu4all.model.VideoAudioSessions;
import edu4all.model.ZoomToken; // add this
import edu4all.repository.VideoAudioSessionRepository;
import edu4all.repository.ZoomTokenRepository; // add this
import jakarta.annotation.PostConstruct;

@Service
public class ZoomAuthService {

    @Autowired
    private VideoAudioSessionRepository videoAudioSessionRepository; // Autowire the repository

    @Value("${zoom.client.id}")
    private String clientId;

    @Value("${zoom.client.secret}")
    private String clientSecret;

    @Value("${zoom.access.token}")
    private String initialAccess;

    @Value("${zoom.refresh.token}")
    private String initialRefresh;

    private static final String ZOOM_OAUTH_TOKEN_URL = "https://zoom.us/oauth/token";
    private static final String ZOOM_CREATE_MEETING_URL = "https://api.zoom.us/v2/users/me/meetings";

    @Autowired
    private ZoomTokenRepository tokenRepo; // add this

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper(); // add this

    @PostConstruct
    public void initTokenRow() {
        // bootstrap the DB row if missing
        tokenRepo.findById(1).orElseGet(() -> {
            ZoomToken t = new ZoomToken();
            t.setId(1);
            t.setAccessToken(initialAccess);
            t.setRefreshToken(initialRefresh);
            t.setExpiresAt(Instant.now().plusSeconds(30)); // force immediate refresh on first use
            return tokenRepo.save(t);
        });
    }

    private synchronized String getValidAccessToken() {
        ZoomToken t = tokenRepo.findById(1).orElseThrow();
        // If “now” is within 30s of expiry, refresh:
        if (Instant.now().isAfter(t.getExpiresAt().minusSeconds(30))) {
            String creds = Base64.getEncoder()
                    .encodeToString((clientId + ":" + clientSecret).getBytes());
            HttpHeaders h = new HttpHeaders();
            h.set(HttpHeaders.AUTHORIZATION, "Basic " + creds);
            h.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String body = "grant_type=refresh_token&refresh_token=" + t.getRefreshToken();
            HttpEntity<String> ent = new HttpEntity<>(body, h);
            ResponseEntity<String> resp = rest.exchange(
                    ZOOM_OAUTH_TOKEN_URL, HttpMethod.POST, ent, String.class);

            try {
                JsonNode root = mapper.readTree(resp.getBody());
                String newAccess = root.get("access_token").asText();
                String newRefresh = root.get("refresh_token").asText();
                long expiresIn = root.get("expires_in").asLong();

                t.setAccessToken(newAccess);
                t.setRefreshToken(newRefresh);
                // now + expiresIn seconds (will never overflow a reasonable expiresIn)
                t.setExpiresAt(Instant.now().plusSeconds(expiresIn));
                tokenRepo.save(t);
            } catch (Exception ex) {
                throw new RuntimeException("Failed parsing Zoom token JSON", ex);
            }
        }
        return t.getAccessToken();
    }

    public String createZoomMeeting(SessionRequest sessionRequest) {
        String accessToken = getValidAccessToken();

        // Normalize local startTime (append seconds if missing)
        String local = sessionRequest.getStartTime();
        if (local.length() == 16) {
            local += ":00";
        }

        // Build JSON payload
        Map<String, Object> body = new HashMap<>();
        body.put("topic", sessionRequest.getTopic());
        body.put("type", 2);
        body.put("start_time", local);
        body.put("timezone", sessionRequest.getTimezone());
        body.put("duration", sessionRequest.getDuration());
        body.put("agenda", sessionRequest.getDescription() == null ? "" : sessionRequest.getDescription());
        if (sessionRequest.getPassword() != null && !sessionRequest.getPassword().isBlank()) {
            body.put("password", sessionRequest.getPassword());
        }
        Map<String, Object> settings = new HashMap<>();
        settings.put("waiting_room", sessionRequest.getWaitingRoom());
        settings.put("join_before_host", !sessionRequest.getWaitingRoom());
        settings.put("host_video", false);
        settings.put("participant_video", false);
        body.put("settings", settings);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> resp = rt.exchange(
                ZOOM_CREATE_MEETING_URL, HttpMethod.POST,
                new HttpEntity<>(body, headers),
                String.class);
        String zoomJson = resp.getBody();
        if (zoomJson == null)
            return null;

        // Extract Zoom’s response
        String zoomUrl = extractZoomMeetingUrl(zoomJson);
        String zoomPassword = extractZoomMeetingPassword(zoomJson);
        long meetingNum = extractZoomMeetingId(zoomJson);
        String signature = generateJWT(meetingNum, "1");

        // Persist into your DB
        LocalDateTime start = LocalDateTime.parse(local, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        LocalDateTime end = start.plusMinutes(sessionRequest.getDuration());

        VideoAudioSessions s = new VideoAudioSessions(
                sessionRequest.getTopic(),
                sessionRequest.getWaitingRoom(),
                sessionRequest.getDescription(),
                zoomUrl,
                zoomPassword,
                meetingNum,
                signature,
                start,
                end,
                sessionRequest.getSessionMaterialId(),
                sessionRequest.getDuration(),
                sessionRequest.getHostId(),
                sessionRequest.getRoomSize(),
                "Scheduled",
                LocalDateTime.now());
        videoAudioSessionRepository.save(s);

        return zoomJson;
    }

    public void deleteZoomMeeting(long meetingNumber) {
        String accessToken = getValidAccessToken();
        String url = "https://api.zoom.us/v2/meetings/" + meetingNumber;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        RestTemplate rt = new RestTemplate(factory);
        rt.exchange(url, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
    }

    public void updateZoomMeeting(long meetingNumber, UpdateMeetingRequest req) {
        String accessToken = getValidAccessToken();
        String url = "https://api.zoom.us/v2/meetings/" + meetingNumber;

        Map<String, Object> body = new HashMap<>();
        if (req.getTopic() != null)
            body.put("topic", req.getTopic());
        if (req.getAgenda() != null)
            body.put("agenda", req.getAgenda());
        if (req.getDuration() != null)
            body.put("duration", req.getDuration());
        if (req.getPassword() != null)
            body.put("password", req.getPassword());
        if (req.getStartTime() != null) {
            String local = req.getStartTime();
            if (local.length() == 16)
                local += ":00";
            body.put("start_time", local);
            body.put("timezone", req.getTimezone());
        }
        Map<String, Object> settings = new HashMap<>();
        if (req.getWaitingRoom() != null) {
            settings.put("waiting_room", req.getWaitingRoom());
        }
        if (!settings.isEmpty()) {
            body.put("settings", settings);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        RestTemplate rt = new RestTemplate(factory);
        rt.exchange(url, HttpMethod.PATCH, new HttpEntity<>(body, headers), String.class);
    }

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // Helper methods (unchanged)
    private String extractZoomMeetingUrl(String responseBody) {
        try {
            return responseBody.split("\"start_url\":\"")[1].split("\"")[0];
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String extractZoomMeetingPassword(String responseBody) {
        try {
            return responseBody.split("\"password\":\"")[1].split("\"")[0];
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private long extractZoomMeetingId(String responseBody) {
        try {
            return Long.parseLong(responseBody.split("\"id\":")[1].split(",")[0]);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public String generateJWT(long meetingNumber, String role) {
        long iat = System.currentTimeMillis() / 1000 - 30;
        long exp = iat + 60 * 60;
        long tokenExp = exp + 60 * 60;
        String payload = String.format(
                "{\"appKey\":\"%s\",\"sdkKey\":\"%s\",\"mn\":%d,\"role\":\"%s\",\"iat\":%d,\"exp\":%d,\"tokenExp\":%d,\"video_webrtc_mode\":0}",
                clientId, clientId, meetingNumber, role, iat, exp, tokenExp);
        return createJWT(clientSecret, payload);
    }

    private String createJWT(String secretKey, String payload) {
        try {
            String h = base64UrlEncode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
            String p = base64UrlEncode(payload);
            String unsigned = h + "." + p;
            String sig = hmacSha256(unsigned, secretKey);
            return unsigned + "." + sig;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String hmacSha256(String data, String key) throws Exception {
        var mac = javax.crypto.Mac.getInstance("HmacSHA256");
        mac.init(new javax.crypto.spec.SecretKeySpec(key.getBytes(), "HmacSHA256"));
        return base64UrlEncode(mac.doFinal(data.getBytes()));
    }

    private String base64UrlEncode(String data) {
        return base64UrlEncode(data.getBytes());
    }

    private String base64UrlEncode(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }

    // –– new parsers for token response ––
    private String extractAccessToken(String r) {
        return r.split("\"access_token\":\"")[1].split("\"")[0];
    }

    private String extractRefreshToken(String r) {
        return r.split("\"refresh_token\":\"")[1].split("\"")[0];
    }

    private long extractExpiresIn(String r) {
        return Long.parseLong(r.split("\"expires_in\":")[1].split(",")[0]);
    }
}
