package com.thinkflow.blog.controllers;

import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.UserRepository;
import com.thinkflow.blog.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // Get logged-in user's profile
    @GetMapping("/profile")
    public ResponseEntity<User> getLoggedInUserProfile(@AuthenticationPrincipal OAuth2User principal) {
        String googleId = principal.getAttribute("sub");
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // Get any user's profile by their MongoDB ID
    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getUserProfileById(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id); // Fetch user by MongoDB ID
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update logged-in user's profile
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User updatedUser, @AuthenticationPrincipal OAuth2User principal) {
        String googleId = principal.getAttribute("sub");
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update user details
        user.setName(updatedUser.getName()); // Update name if needed
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setAddress(updatedUser.getAddress());
        user.setBio(updatedUser.getBio());
        user.setPicture(updatedUser.getPicture()); // Update profile picture if needed

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    // Fetch user by ID (alternative to getUserProfileById)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id); // Fetch user by MongoDB ID
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update user profile
    @PutMapping("/profile/{id}")
    public ResponseEntity<User> updateProfile(
            @PathVariable String id,
            @RequestBody User updatedUser,
            @AuthenticationPrincipal OAuth2User principal
    ) {
        // Ensure the logged-in user can only update their own profile
        String googleId = principal.getAttribute("sub");
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Update user details
        user.setName(updatedUser.getName());
        user.setBio(updatedUser.getBio());
        user.setPicture(updatedUser.getPicture());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/{followerId}/follow/{followeeId}")
    public ResponseEntity<String> followUser(
            @PathVariable String followerId,
            @PathVariable String followeeId) {
        userService.followUser(followerId, followeeId);
        return ResponseEntity.ok("Followed successfully");
    }

    @PostMapping("/{followerId}/unfollow/{followeeId}")
    public ResponseEntity<String> unfollowUser(
            @PathVariable String followerId,
            @PathVariable String followeeId) {
        userService.unfollowUser(followerId, followeeId);
        return ResponseEntity.ok("Unfollowed successfully");
    }

    // Fetch user details by IDs
    @PostMapping("/details")
    public ResponseEntity<List<User>> getUsersByIds(@RequestBody List<String> userIds) {
        List<User> users = userService.getUsersByIds(userIds);
        return ResponseEntity.ok(users);
    }

    // Save a post
    @PostMapping("/{userId}/save/{postId}")
    public ResponseEntity<String> savePost(
            @PathVariable String userId,
            @PathVariable String postId) {
        userService.savePost(userId, postId);
        return ResponseEntity.ok("Post saved successfully");
    }

    // Unsave a post
    @PostMapping("/{userId}/unsave/{postId}")
    public ResponseEntity<String> unsavePost(
            @PathVariable String userId,
            @PathVariable String postId) {
        userService.unsavePost(userId, postId);
        return ResponseEntity.ok("Post unsaved successfully");
    }

    // Fetch saved posts for a user
    @GetMapping("/{userId}/saved")
    public ResponseEntity<User> getSavedPosts(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    // Fetch details of saved posts
    @GetMapping("/{userId}/saved-posts")
    public ResponseEntity<List<Post>> getSavedPostsDetails(@PathVariable String userId) {
        List<Post> savedPosts = userService.getSavedPostsDetails(userId);
        return ResponseEntity.ok(savedPosts);
    }

}