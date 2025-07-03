// src/main/java/edu4all/dto/SessionViewDto.java
package edu4all.dto;

import java.time.LocalDateTime;

public class SessionViewDto {
    private Long vaId;
    private String title;
    private String description;
    private String startDateTime;
    private int sessionDuration;
    private String sessionUrl;
    private long sessionNumber;
    private String hostName;
    private boolean waitroom;
    private String password;

    public SessionViewDto(Long vaId,
            String title,
            boolean waitroom,
            String description,
            LocalDateTime startDateTime,
            int sessionDuration,
            String sessionUrl,
            long sessionNumber,
            String hostName,
            String password) {
        this.vaId = vaId;
        this.title = title;
        this.description = description;
        this.startDateTime = startDateTime.toString();
        this.sessionDuration = sessionDuration;
        this.sessionUrl = sessionUrl;
        this.sessionNumber = sessionNumber;
        this.waitroom = waitroom;
        this.hostName = hostName;
        this.password = password;

    }

    // getters
    public Long getVaId() {
        return vaId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStartDateTime() {
        return startDateTime;
    }

    public int getSessionDuration() {
        return sessionDuration;
    }

    public String getSessionUrl() {
        return sessionUrl;
    }

    public long getSessionNumber() {
        return sessionNumber;
    }

    public boolean getWaitRoom() {
        return waitroom;
    }

    public String getHostName() {
        return hostName;
    }

    public String getSessionPassword() {
        return password;
    }
}
