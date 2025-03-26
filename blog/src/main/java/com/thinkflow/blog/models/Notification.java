package com.thinkflow.blog.models;

public class Notification {
    private String userId;
    private String message;
    private String type; // e.g., "FOLLOW", "LIKE", "COMMENT"
    private boolean read;

    public Notification(String userId, String message, String type) {
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.read = false; // Default to unread
    }

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
