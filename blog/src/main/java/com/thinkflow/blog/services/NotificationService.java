package com.thinkflow.blog.services;

import com.thinkflow.blog.models.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyFollow(String followerName, String followedUserId) {
        String message = followerName + " started following you.";
        messagingTemplate.convertAndSendToUser(followedUserId, "/notifications",
                new Notification(followedUserId, message, "FOLLOW"));
    }

    public void notifyLike(String likerName, String postOwnerId) {
        String message = likerName + " liked your post.";
        messagingTemplate.convertAndSendToUser(postOwnerId, "/notifications",
                new Notification(postOwnerId, message, "LIKE"));
    }

    public void notifyComment(String commenterName, String postOwnerId, String comment) {
        String message = commenterName + " commented on your post: " + comment;
        messagingTemplate.convertAndSendToUser(postOwnerId, "/notifications",
                new Notification(postOwnerId, message, "COMMENT"));
    }
}