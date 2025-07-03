// src/main/java/edu4all/dto/StudentSessionDto.java
package edu4all.dto;

import java.time.LocalDateTime;

public class StudentSessionDto {
    private Long vaId;
    private String title;
    private String description;
    private String sessionUrl;
    private String startDateTime;
    private String endDateTime;
    private int sessionDuration;
    private String hostName;

    public StudentSessionDto(Long vaId, String title, String description,
            String sessionUrl, LocalDateTime start, LocalDateTime end,
            int sessionDuration, String hostName) {
        this.vaId = vaId;
        this.title = title;
        this.description = description;
        this.sessionUrl = sessionUrl;
        this.startDateTime = start.toString();
        this.endDateTime = end.toString();
        this.sessionDuration = sessionDuration;
        this.hostName = hostName;
    }

    public Long getVaId() {
        return vaId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getSessionUrl() {
        return sessionUrl;
    }

    public String getStartDateTime() {
        return startDateTime;
    }

    public String getEndDateTime() {
        return endDateTime;
    }

    public int getSessionDuration() {
        return sessionDuration;
    }

    public String getHostName() {
        return hostName;
    }
}
