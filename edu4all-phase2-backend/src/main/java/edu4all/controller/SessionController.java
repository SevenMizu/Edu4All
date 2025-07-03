// src/main/java/edu4all/controller/SessionController.java
package edu4all.controller;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu4all.dto.SessionRequest;
import edu4all.dto.SessionViewDto;
import edu4all.dto.StudentSessionDto;
import edu4all.dto.UpdateMeetingRequest;
import edu4all.model.VideoAudioSessions;
import edu4all.repository.VideoAudioSessionRepository;
import edu4all.service.ZoomAuthService;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    @Autowired
    private ZoomAuthService zoomAuthService;

    @Autowired
    private VideoAudioSessionRepository videoAudioSessionRepository;

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<String>> getMentorSessions(@PathVariable int mentorId) {
        // Still dummy for now
        List<String> sessions = List.of("Session 1", "Session 2", "Session 3");
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ZoomMeetingDetails> start(@PathVariable Long id) {
        // 1) Fetch the saved session (so we get URL, password, meetingNumber, host)
        VideoAudioSessions sess = videoAudioSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));

        // 2) Generate a fresh signature
        long meetingNumber = sess.getSessionNumber();
        String signature = zoomAuthService.generateJWT(meetingNumber, "1");

        // 3) Return everything needed for the SDK
        return ResponseEntity.ok(new ZoomMeetingDetails(
                sess.getSessionUrl(),
                sess.getSessionPassword(),
                meetingNumber,
                signature,
                sess.getHost() != null ? sess.getHost().getName() : "Unknown"));
    }

    @PostMapping("/schedule")
    public ResponseEntity<ZoomMeetingDetails> scheduleSession(@RequestBody SessionRequest sessionRequest) {
        // Unchanged: still creates & saves a brand-new meeting
        String zoomMeetingResponse = zoomAuthService.createZoomMeeting(sessionRequest);

        String zoomMeetingUrl = extractZoomMeetingUrl(zoomMeetingResponse);
        String zoomMeetingPassword = extractZoomMeetingPassword(zoomMeetingResponse);
        long meetingNumber = extractZoomMeetingId(zoomMeetingResponse);
        String signature = zoomAuthService.generateJWT(meetingNumber, "1");

        return ResponseEntity.ok(new ZoomMeetingDetails(
                zoomMeetingUrl,
                zoomMeetingPassword,
                meetingNumber,
                signature,
                "" // hostName isn’t needed here
        ));
    }

    /**
     * Update Zoom meeting and local DB record
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateSession(
            @PathVariable Long id,
            @RequestBody UpdateMeetingRequest req) {
        // 1) load existing session
        VideoAudioSessions sess = videoAudioSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));

        // 2) call Zoom REST to patch
        zoomAuthService.updateZoomMeeting(sess.getSessionNumber(), req);

        // 3) persist any local changes you care about
        if (req.getTopic() != null)
            sess.setTitle(req.getTopic());
        if (req.getWaitingRoom() != null)
            sess.setWaitRoom(req.getWaitingRoom());
        if (req.getAgenda() != null)
            sess.setDescription(req.getAgenda());
        if (req.getStartTime() != null) {
            LocalDateTime dt = LocalDateTime
                    .parse(req.getStartTime(), DateTimeFormatter.ISO_DATE_TIME);
            sess.setStartDateTime(dt);
            sess.setEndDateTime(
                    dt.plusMinutes(req.getDuration() != null ? req.getDuration() : sess.getSessionDuration()));
        }
        if (req.getDuration() != null)
            sess.setSessionDuration(req.getDuration());
        if (req.getPassword() != null)
            sess.setSessionPassword(req.getPassword());
        // you can handle waitingRoom in your own settings field if you have one

        videoAudioSessionRepository.save(sess);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        VideoAudioSessions sess = videoAudioSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));

        // 1) delete in Zoom
        zoomAuthService.deleteZoomMeeting(sess.getSessionNumber());

        // 2) delete locally
        videoAudioSessionRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/view")
    public ResponseEntity<List<SessionViewDto>> viewSessions() {
        List<SessionViewDto> dtos = videoAudioSessionRepository.findAll().stream()
                .map(s -> new SessionViewDto(
                        s.getVaId(),
                        s.getTitle(),
                        s.getWaitRoom(),
                        s.getDescription(),
                        s.getStartDateTime(),
                        s.getSessionDuration(),
                        s.getSessionUrl(),
                        s.getSessionNumber(),
                        s.getHost() != null ? s.getHost().getName() : "Unknown",
                        s.getSessionPassword()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SessionViewDto>> searchSessions(@RequestParam String keyword) {
        List<SessionViewDto> dtos = videoAudioSessionRepository.searchByKeyword(keyword).stream()
                .map(s -> new SessionViewDto(
                        s.getVaId(),
                        s.getTitle(),
                        s.getWaitRoom(),
                        s.getDescription(),
                        s.getStartDateTime(),
                        s.getSessionDuration(),
                        s.getSessionUrl(),
                        s.getSessionNumber(),
                        s.getHost() != null ? s.getHost().getName() : "Unknown",
                        s.getSessionPassword()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

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

    /**
     * List all sessions this student has registered for.
     * (For now userId is hard-coded to 1, but we expose it in the path.)
     */
    @GetMapping("/student/{userId}")
    public ResponseEntity<List<StudentSessionDto>> getStudentSessions(
            @PathVariable Long userId) {

       

        // 1) load all sessions the user signed up for
        List<VideoAudioSessions> sessions = videoAudioSessionRepository.findByUserId(userId);

        // 2) get “now” in your server’s zone (or UTC)
        LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());

        // 3) filter out only those whose **end** is still in the future
        List<StudentSessionDto> dtos = sessions.stream()
                .filter(s -> s.getEndDateTime().isAfter(now))
                .map(s -> new StudentSessionDto(
                        s.getVaId(),
                        s.getTitle(),
                        s.getDescription(),
                        s.getSessionUrl(),
                        s.getStartDateTime(),
                        s.getEndDateTime(),
                        s.getSessionDuration(),
                        s.getHost() != null ? s.getHost().getName() : "Unknown"))
                .collect(Collectors.toList());
 System.out.println("USERID:::: " + userId);
        return ResponseEntity.ok(dtos);
    }

    /**
     * Unsubscribe a student from a session.
     */
    @DeleteMapping("/student/{userId}/{sessionId}")
    public ResponseEntity<Void> unsubscribe(
            @PathVariable Long userId,
            @PathVariable Long sessionId) {

        videoAudioSessionRepository.deleteRegistration(userId, sessionId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Subscribe a student to a session.
     */
    @PostMapping("/student/{userId}/{sessionId}")
    public ResponseEntity<Void> subscribe(
            @PathVariable Long userId,
            @PathVariable Long sessionId) {

        // Persist a registration record linking userId → sessionId.
        // You’ll need a repository method like videoAudioSessionRepository.saveRegistration(userId, sessionId).
        videoAudioSessionRepository.saveRegistration(userId, sessionId);

        return ResponseEntity.noContent().build();
    }


    public static class ZoomMeetingDetails {
        private String meetingUrl;
        private String meetingPassword;
        private long meetingNumber;
        private String signature;
        private String hostName;

        public ZoomMeetingDetails(String meetingUrl,
                String meetingPassword,
                long meetingNumber,
                String signature,
                String hostName) {
            this.meetingUrl = meetingUrl;
            this.meetingPassword = meetingPassword;
            this.meetingNumber = meetingNumber;
            this.signature = signature;
            this.hostName = hostName;
        }

        public String getMeetingUrl() {
            return meetingUrl;
        }

        public String getMeetingPassword() {
            return meetingPassword;
        }

        public long getMeetingNumber() {
            return meetingNumber;
        }

        public String getSignature() {
            return signature;
        }

        public String getHostName() {
            return hostName;
        }
    }
}
