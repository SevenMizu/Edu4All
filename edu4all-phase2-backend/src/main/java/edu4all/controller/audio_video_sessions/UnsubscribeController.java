package edu4all.controller.audio_video_sessions;

import edu4all.model.audio_video_sessions.UserSessionDAO;
import edu4all.view.audio_video_sessions.UnsubscribeView;

public class UnsubscribeController {
    private final int userId;
    private final UnsubscribeView view;
    private final UserSessionDAO dao;

    /** Accept the current user’s ID at construction */
    public UnsubscribeController(int userId,
            UnsubscribeView view,
            UserSessionDAO dao) {
        this.userId = userId;
        this.view = view;
        this.dao = dao;
    }

    // Run the unsubscribe flow for the current user
    public void unsubscribe() {
        int sessionId = view.promptForSessionId();
        try {
            boolean removed = dao.unsubscribe(userId, sessionId);
            if (removed)
                view.showSuccess(sessionId);
            else
                view.showFailure(sessionId);
        } catch (Exception e) {
            view.showError(e.getMessage());
        }
    }
}