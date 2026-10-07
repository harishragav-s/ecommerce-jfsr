package com.ecommerce.authservice.dto;

public class UserResponse {
    private String id;
    private String email;
    private String userName;
    private String role;
    private String token;

    public UserResponse() {}

    public UserResponse(String id, String email, String userName, String role, String token) {
        this.id = id;
        this.email = email;
        this.userName = userName;
        this.role = role;
        this.token = token;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
