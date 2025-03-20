package com.thinkflow.blog.services;

import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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

}
