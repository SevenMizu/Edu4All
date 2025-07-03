// src/main/java/edu4all/dto/RegistrationRequest.java
package edu4all.dto;

public class RegistrationRequest {
    private String username;
    private String name;
    private String email;
    private String password;
    private String type;
    private String grade;
    private String country;
    private String curriculum;
    private String profilePictureUrl;

    public RegistrationRequest() {
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public void setUsername(String u) {
        this.username = u;
    }

    public void setName(String n) {
        this.name = n;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String e) {
        this.email = e;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String p) {
        this.password = p;
    }

    public String getType() {
        return type;
    }

    public void setType(String t) {
        this.type = t;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String g) {
        this.grade = g;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String c) {
        this.country = c;
    }

    public String getCurriculum() {
        return curriculum;
    }

    public void setCurriculum(String c) {
        this.curriculum = c;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String url) {
        this.profilePictureUrl = url;
    }
}
