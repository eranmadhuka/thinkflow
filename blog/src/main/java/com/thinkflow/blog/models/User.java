package com.thinkflow.blog.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a user in the blogging platform with profile information
 * and social connections.
 */
@Document(collection = "users")
public class User {
    @Id
    private String id;              // Unique identifier (MongoDB ObjectId)
    private String googleId;        // Google OAuth identifier
    private String name;            // User's full name from Google
    private String email;           // User's email from Google
    private String picture;         // URL to user's profile picture
    private String bio;             // User's biography
    private String status;          // User's current status message
    private List<String> followers = new ArrayList<>();  // IDs of users following this user
    private List<String> following = new ArrayList<>();  // IDs of users this user follows
    private List<String> savedPosts = new ArrayList<>(); // IDs of posts saved by this user

    // Constructors (optional but recommended)
    public User() {}

    // Getters and Setters with minimal comments as they are self-explanatory
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<String> getFollowers() { return followers; }
    public void setFollowers(List<String> followers) { this.followers = followers; }
    public List<String> getFollowing() { return following; }
    public void setFollowing(List<String> following) { this.following = following; }
    public List<String> getSavedPosts() { return savedPosts; }
    public void setSavedPosts(List<String> savedPosts) { this.savedPosts = savedPosts; }
}