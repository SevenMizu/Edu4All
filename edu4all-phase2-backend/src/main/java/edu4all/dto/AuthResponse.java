// src/main/java/edu4all/dto/AuthResponse.java
package edu4all.dto;

public class AuthResponse {
    private String username;
    private String type;
    private String token;
    private int userId;

    public AuthResponse(String username, String type, String token, int userId) {
        this.username = username;
        this.type = type;
        this.token = token;
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public String getType() {
        return type;
    }

    public String getToken() {
        return token;
    }

    public int getUserId() {
        return userId;
    }
}
