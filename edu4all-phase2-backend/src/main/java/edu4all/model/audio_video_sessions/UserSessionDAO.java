package edu4all.model.audio_video_sessions;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import edu4all.config.DatabaseConnection;

public class UserSessionDAO {

    /**
     * Unsubscribe a user from a session by deleting the record.
     * 
     * @param userId    the current user (hard-coded = 1 in controller)
     * @param sessionId the session to cancel
     * @return true if a row was deleted
     */
    public boolean unsubscribe(int userId, int sessionId) throws SQLException {
        String sql = "DELETE FROM user_sessions "
                + "WHERE user_id = ? AND session_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, sessionId);
            return ps.executeUpdate() > 0;
        }
    }
}
