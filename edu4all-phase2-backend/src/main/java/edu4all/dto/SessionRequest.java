package edu4all.dto;

public class SessionRequest {

    private String topic; // The topic/title of the Zoom meeting
    private String description; // The description of the Zoom meeting
    private String startTime; // Start time in ISO 8601 format (e.g., "2025-05-16T22:22:40")
    private String timezone;
    private boolean waitingRoom;
    private int duration; // Duration in minutes
    private Long sessionMaterialId; // The ID of associated session material (if any)
    private Long hostId; // The ID of the host
    private int roomSize; // The number of participants allowed in the meeting
    private String password;

    // Default constructor
    public SessionRequest() {
    }

    // Constructor with all fields
    public SessionRequest(String topic, String description, String startTime, int duration,
            Long sessionMaterialId, Long hostId, int roomSize, boolean waitingRoom, String password) {
        this.topic = topic;
        this.description = description;
        this.startTime = startTime;
        this.duration = duration;
        this.waitingRoom = waitingRoom;
        this.sessionMaterialId = sessionMaterialId;
        this.hostId = hostId;
        this.roomSize = roomSize;
        this.password = password;
    }

    // Getters and setters
    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public boolean getWaitingRoom() {
        return waitingRoom;
    }

    public void setWaitingRoom(boolean waitingRoom) {
        this.waitingRoom = waitingRoom;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public Long getSessionMaterialId() {
        return sessionMaterialId;
    }

    public void setSessionMaterialId(Long sessionMaterialId) {
        this.sessionMaterialId = sessionMaterialId;
    }

    public Long getHostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }

    public int getRoomSize() {
        return roomSize;
    }

    public void setRoomSize(int roomSize) {
        this.roomSize = roomSize;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
