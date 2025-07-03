// src/main/java/edu4all/dto/ProfileResponse.java
package edu4all.dto;

/**
 * DTO for returning “current user” data in JSON.
 */
public class ProfileResponse {
    private int id;
    private String username;
    private String name;
    private String email;
    private String type;            // mentor / student
    private String grade;           // now a String (to match User.getGrade())
    private String country;
    private String curriculum;
    private String profilePictureUrl;

    public ProfileResponse() { }

    // Changed “Integer grade” → “String grade”
    public ProfileResponse(int id,
                           String username,
                           String name,
                           String email,
                           String type,
                           String grade,
                           String country,
                           String curriculum,
                           String profilePictureUrl) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.type = type;
        this.grade = grade;
        this.country = country;
        this.curriculum = curriculum;
        this.profilePictureUrl = profilePictureUrl;
    }

    // --- Getters & setters for Jackson ---
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public String getGrade() {
        return grade;
    }
    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
    }

    public String getCurriculum() {
        return curriculum;
    }
    public void setCurriculum(String curriculum) {
        this.curriculum = curriculum;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}
