package com.thinkflow.blog.services;

import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.PostRepository;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    // Follow a user
    public void followUser(String followerId, String followeeId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new RuntimeException("Followee not found"));

        // Add followee to follower's following list
        if (!follower.getFollowing().contains(followeeId)) {
            follower.getFollowing().add(followeeId);
            userRepository.save(follower);
        }

        // Add follower to followee's followers list
        if (!followee.getFollowers().contains(followerId)) {
            followee.getFollowers().add(followerId);
            userRepository.save(followee);
        }
    }

    // Unfollow a user
    public void unfollowUser(String followerId, String followeeId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new RuntimeException("Followee not found"));

        // Remove followee from follower's following list
        follower.getFollowing().remove(followeeId);
        userRepository.save(follower);

        // Remove follower from followee's followers list
        followee.getFollowers().remove(followerId);
        userRepository.save(followee);
    }

    // Fetch user details by IDs
    public List<User> getUsersByIds(List<String> userIds) {
        return userRepository.findByIdIn(userIds);
    }

    // Save a post
    public void savePost(String userId, String postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Add the post ID to the user's savedPosts list if it's not already there
        if (!user.getSavedPosts().contains(postId)) {
            user.getSavedPosts().add(postId);
            userRepository.save(user);
        }
    }

    // Unsave a post
    public void unsavePost(String userId, String postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Remove the post ID from the user's savedPosts list
        user.getSavedPosts().remove(postId);
        userRepository.save(user);
    }

    // Fetch a user by ID
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Fetch details of saved posts
    public List<Post> getSavedPostsDetails(String userId) {
        // Fetch the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get the list of saved post IDs
        List<String> savedPostIds = user.getSavedPosts();

        // Fetch the details of saved posts
        return postRepository.findByIdIn(savedPostIds);
    }

}
