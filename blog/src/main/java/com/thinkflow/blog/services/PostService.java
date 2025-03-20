package com.thinkflow.blog.services;

import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.PostRepository;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Fetch posts from users the logged-in user is following
    public List<Post> getFollowingPosts(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> followingUserIds = user.getFollowing();
        if (followingUserIds.isEmpty()) {
            return new ArrayList<>();
        }

        // Fetch users being followed
        List<User> followingUsers = userRepository.findByIdIn(followingUserIds);
        return postRepository.findByUserIn(followingUsers);
    }
}
