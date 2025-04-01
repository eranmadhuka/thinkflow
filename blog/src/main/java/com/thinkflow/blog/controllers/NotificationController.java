package com.thinkflow.blog.controllers;

import com.thinkflow.blog.models.Notification;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.UserRepository;
import com.thinkflow.blog.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;  // Added to fetch User entity

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(
            @PathVariable String userId,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String providerId = oAuth2User.getAttribute("sub") != null ?
                    oAuth2User.getAttribute("sub") : oAuth2User.getAttribute("id");
            User currentUser = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(null); // Users can only access their own notifications
            }

            List<Notification> notifications = notificationService.getNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable String userId,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String providerId = oAuth2User.getAttribute("sub") != null ?
                    oAuth2User.getAttribute("sub") : oAuth2User.getAttribute("id");
            User currentUser = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(null);
            }

            List<Notification> unreadNotifications = notificationService.getUnreadNotifications(userId);
            return ResponseEntity.ok(unreadNotifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/read/{notificationId}")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String notificationId,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String providerId = oAuth2User.getAttribute("sub") != null ?
                    oAuth2User.getAttribute("sub") : oAuth2User.getAttribute("id");
            User currentUser = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Notification notification = notificationService.getNotificationById(notificationId);
            if (!notification.getUserId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Only the owner can mark as read
            }

            notificationService.markAsRead(notificationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}