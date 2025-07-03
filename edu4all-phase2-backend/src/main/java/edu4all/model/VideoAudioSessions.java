package edu4all.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "VideoAudioSessions") // Unique entity name
public class VideoAudioSessions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vaId;

    private String title;
    private String description;

    @Column(name = "session_url")
    private String sessionUrl;

    @Column(name = "session_password")
    private String sessionPassword;

    @Column(name = "session_number")
    private long sessionNumber;

    private String signature;

    @Column(name = "start_date_time")
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;

    @Column(name = "session_material_id")
    private Long sessionMaterialId;

    @Column(name = "session_duration")
    private int sessionDuration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", insertable = false, updatable = false)
    private User host;

    @Column(name = "host_id")
    private Long hostId;

    @Column(name = "room_size")
    private int roomSize;

    @Column(name = "waiting_room")
    private boolean waitroom;

    private String status;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    // Default constructor
    public VideoAudioSessions() {
    }

    // Constructor with all fields
    public VideoAudioSessions(String title, boolean waitroom, String description, String sessionUrl,
            String sessionPassword,
            long sessionNumber,
            String signature, LocalDateTime startDateTime, LocalDateTime endDateTime, Long sessionMaterialId,
            int sessionDuration, Long hostId, int roomSize, String status,
            LocalDateTime createdDate) {
        this.title = title;
        this.waitroom = waitroom;
        this.description = description;
        this.sessionUrl = sessionUrl;
        this.sessionPassword = sessionPassword;
        this.sessionNumber = sessionNumber;
        this.signature = signature;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.sessionMaterialId = sessionMaterialId;
        this.sessionDuration = sessionDuration;
        this.hostId = hostId;
        this.roomSize = roomSize;
        this.status = status;
        this.createdDate = createdDate;
    }

    // Getters and setters
    public Long getVaId() {
        return vaId;
    }

    public void setVaId(Long vaId) {
        this.vaId = vaId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean getWaitRoom() {
        return waitroom;
    }

    public void setWaitRoom(boolean waitroom) {
        this.waitroom = waitroom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSessionUrl() {
        return sessionUrl;
    }

    public void setSessionUrl(String sessionUrl) {
        this.sessionUrl = sessionUrl;
    }

    public String getSessionPassword() {
        return sessionPassword;
    }

    public void setSessionPassword(String sessionPassword) {
        this.sessionPassword = sessionPassword;
    }

    public long getSessionNumber() {
        return sessionNumber;
    }

    public void setSessionNumber(long sessionNumber) {
        this.sessionNumber = sessionNumber;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public Long getSessionMaterialId() {
        return sessionMaterialId;
    }

    public void setSessionMaterialId(Long sessionMaterialId) {
        this.sessionMaterialId = sessionMaterialId;
    }

    public int getSessionDuration() {
        return sessionDuration;
    }

    public void setSessionDuration(int sessionDuration) {
        this.sessionDuration = sessionDuration;
    }

    public Long getHostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }

    public User getHost() {
        return host;
    }

    public void setHost(User host) {
        this.host = host;
    }

    public int getRoomSize() {
        return roomSize;
    }

    public void setRoomSize(int roomSize) {
        this.roomSize = roomSize;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
