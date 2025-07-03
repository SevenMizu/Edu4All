package edu4all.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import edu4all.model.VideoAudioSessions;

@Repository
public interface VideoAudioSessionRepository extends JpaRepository<VideoAudioSessions, Long> {

    /**
     * Find all meetings that a given user (from user_sessions) has registered for.
     */
    @Query(value = "SELECT vas.* FROM video_audio_sessions vas " +
            "JOIN user_sessions us ON vas.va_id = us.va_id " +
            "WHERE us.user_id = :userId", nativeQuery = true)
    List<VideoAudioSessions> findByUserId(@Param("userId") Long userId);

    /**
     * Unregister a user from a session.
     */
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_sessions WHERE user_id = :userId AND va_id = :sessionId", nativeQuery = true)
    void deleteRegistration(@Param("userId") Long userId,
            @Param("sessionId") Long sessionId);

    /**
     * Register (subscribe) a user to a session by inserting into user_sessions.
     */
    @Modifying
    @Transactional
    @Query(
    value = "INSERT INTO user_sessions(user_id, va_id, subscribed_date) "
            + "VALUES(:userId, :sessionId, NOW())",
    nativeQuery = true
    )
    void saveRegistration(@Param("userId") Long userId, @Param("sessionId") Long sessionId);

    @Query(value = "SELECT vas.* FROM video_audio_sessions vas " +
             "WHERE LOWER(vas.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
             "OR LOWER(vas.description) LIKE LOWER(CONCAT('%', :keyword, '%'))", nativeQuery = true)
    List<VideoAudioSessions> searchByKeyword(@Param("keyword") String keyword);

    
}
