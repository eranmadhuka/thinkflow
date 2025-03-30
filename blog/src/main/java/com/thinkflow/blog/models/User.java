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

    private List<ProviderIdentity> identities = new ArrayList<>(); // List of provider identities
    private String name;            // User's full name from OAuth provider
    private String email;           // User's email from OAuth provider
    private String picture;         // URL to user's profile picture
    private String bio;             // User's biography
    private String status;          // User's current status message
    private List<String> followers = new ArrayList<>();  // IDs of users following this user
    private List<String> following = new ArrayList<>();  // IDs of users this user follows
    private List<String> savedPosts = new ArrayList<>(); // IDs of posts saved by this user

    // Constructors
    public User() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<ProviderIdentity> getIdentities() {
        return identities;
    }

    public void setIdentities(List<ProviderIdentity> identities) {
        this.identities = identities;
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

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getFollowers() {
        return followers;
    }

    public void setFollowers(List<String> followers) {
        this.followers = followers;
    }

    public List<String> getFollowing() {
        return following;
    }

    public void setFollowing(List<String> following) {
        this.following = following;
    }

    public List<String> getSavedPosts() {
        return savedPosts;
    }

    public void setSavedPosts(List<String> savedPosts) {
        this.savedPosts = savedPosts;
    }

    // Nested class for provider identities
    public static class ProviderIdentity {
        private String providerId;
        private String provider;

        public ProviderIdentity(String providerId, String provider) {
            this.providerId = providerId;
            this.provider = provider;
        }

        public String getProviderId() { return providerId; }
        public void setProviderId(String providerId) { this.providerId = providerId; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
    }
}