package com.thinkflow.blog.services;

import com.thinkflow.blog.models.Notification;
import com.thinkflow.blog.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Sends a follow notification to the followed user.
     * @param followerName Name of the follower
     * @param followedUserId ID of the user being followed
     */
    public void notifyFollow(String followerName, String followedUserId) {
        String message = followerName + " started following you.";
        Notification notification = new Notification(followedUserId, message, "FOLLOW");
        notificationRepository.save(notification);
        messagingTemplate.convertAndSendToUser(followedUserId, "/notifications", notification);
    }

    /**
     * Sends a like notification to the post owner.
     * @param likerName Name of the user who liked the post
     * @param postOwnerId ID of the post owner
     */
    public void notifyLike(String likerName, String postOwnerId) {
        String message = likerName + " liked your post.";
        Notification notification = new Notification(postOwnerId, message, "LIKE");
        notificationRepository.save(notification);
        messagingTemplate.convertAndSendToUser(postOwnerId, "/notifications", notification);
    }

    /**
     * Sends a comment notification to the post owner.
     * @param commenterName Name of the commenter
     * @param postOwnerId ID of the post owner
     * @param comment The comment text
     */
    public void notifyComment(String commenterName, String postOwnerId, String comment) {
        String message = commenterName + " commented on your post: " + comment;
        Notification notification = new Notification(postOwnerId, message, "COMMENT");
        notificationRepository.save(notification);
        messagingTemplate.convertAndSendToUser(postOwnerId, "/notifications", notification);
    }

    /**
     * Fetches all notifications for a user, sorted by creation date (descending).
     * @param userId ID of the user
     * @return List of notifications
     */
    public List<Notification> getNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Fetches unread notifications for a user, sorted by creation date (descending).
     * @param userId ID of the user
     * @return List of unread notifications
     */
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    /**
     * Marks a notification as read.
     * @param notificationId ID of the notification
     */
    public void markAsRead(String notificationId) {
        Notification notification = getNotificationById(notificationId); // Use the new method
        if (!notification.isRead()) { // Avoid unnecessary updates
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    /**
     * Retrieves a notification by its ID.
     * @param notificationId ID of the notification
     * @return Notification entity
     * @throws IllegalArgumentException if not found
     */
    public Notification getNotificationById(String notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));
    }
}