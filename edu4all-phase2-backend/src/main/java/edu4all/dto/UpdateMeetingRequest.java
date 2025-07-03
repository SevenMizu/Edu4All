package edu4all.dto;

public class UpdateMeetingRequest {
    private String topic;
    private String agenda;       // maps to “description”
    private String startTime;    // e.g. "2025-06-01T12:00:00Z"
    private String timezone; 
    private Integer duration;    // in minutes
    private String password;
    private Boolean waitingRoom; // example setting

    public UpdateMeetingRequest() {}

    // getters & setters
    public String getTopic()            { return topic; }
    public void   setTopic(String t)    { this.topic = t; }
    public String getAgenda()           { return agenda; }
    public void   setAgenda(String a)   { this.agenda = a; }
    public String getStartTime()        { return startTime; }
    public void   setStartTime(String s){ this.startTime = s; }
    public Integer getDuration()        { return duration; }
    public void    setDuration(Integer d){ this.duration = d; }
    public String  getPassword()        { return password; }
    public void    setPassword(String p){ this.password = p; }
    public Boolean getWaitingRoom()     { return waitingRoom; }
    public void    setWaitingRoom(Boolean w){ this.waitingRoom = w; }
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
}
