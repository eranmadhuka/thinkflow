package com.thinkflow.blog.controllers;

import com.thinkflow.blog.models.Like;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.UserRepository;
import com.thinkflow.blog.services.AuthService;
import com.thinkflow.blog.services.CommentService;
import com.thinkflow.blog.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for handling like-related operations.
 */
@RestController
@RequestMapping("/likes")
public class LikeController {

    @Autowired
    private PostService postService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;  // Added to fetch User entity

    @PostMapping("/posts/{postId}")
    public ResponseEntity<?> likePost(@PathVariable String postId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String providerId = oAuth2User.getAttribute("sub") != null ?
                    oAuth2User.getAttribute("sub") : oAuth2User.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(postService.togglePostLike(postId, user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error liking post");
        }
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getLikesForPost(@PathVariable String postId) {
        try {
            List<Like> likes = postService.getLikesForPost(postId);
            return ResponseEntity.ok(likes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching post likes");
        }
    }

    @GetMapping("/posts/{postId}/count")
    public ResponseEntity<?> getPostLikeCount(@PathVariable String postId) {
        try {
            long likeCount = postService.getLikeCount(postId);
            return ResponseEntity.ok(likeCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching post like count");
        }
    }

    @GetMapping("/posts/{postId}/has-liked")
    public ResponseEntity<?> hasUserLikedPost(
            @PathVariable String postId,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.ok(false); // Unauthenticated users haven’t liked
        }

        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String providerId = oAuth2User.getAttribute("sub") != null ?
                    oAuth2User.getAttribute("sub") : oAuth2User.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            boolean hasLiked = postService.hasUserLikedPost(postId, user.getId());
            return ResponseEntity.ok(hasLiked);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking post like status");
        }
    }

    @PostMapping("/comments/{commentId}")
    public ResponseEntity<?> likeComment(@PathVariable String commentId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String providerId = oAuth2User.getAttribute("sub") != null ?
                    oAuth2User.getAttribute("sub") : oAuth2User.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(commentService.toggleCommentLike(commentId, user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error liking comment");
        }
    }

    @GetMapping("/comments/{commentId}/count")
    public ResponseEntity<?> getCommentLikeCount(@PathVariable String commentId) {
        try {
            long likeCount = commentService.getCommentLikeCount(commentId);
            return ResponseEntity.ok(likeCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching comment like count");
        }
    }

    @GetMapping("/comments/{commentId}/has-liked")
    public ResponseEntity<?> hasUserLikedComment(
            @PathVariable String commentId,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.ok(false); // Unauthenticated users haven’t liked
        }

        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String providerId = oAuth2User.getAttribute("sub") != null ?
                    oAuth2User.getAttribute("sub") : oAuth2User.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            boolean hasLiked = commentService.hasUserLikedComment(commentId, user.getId());
            return ResponseEntity.ok(hasLiked);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking comment like status");
        }
    }
}