package com.thinkflow.blog.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.xml.stream.events.Comment;
import java.util.Date;
import java.util.List;

@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String title;
    private String content;
    private String userId; // Google ID

    @DBRef
    private User user; // Reference to the User document

    private String userObjectId; // Store the MongoDB ObjectId of the User

    private Date createdAt;
    private List<String> likes;
    private List<Comment> comments;

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getUserObjectId() {
        return userObjectId;
    }

    public void setUserObjectId(String userObjectId) {
        this.userObjectId = userObjectId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getLikes() {
        return likes;
    }

    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
}