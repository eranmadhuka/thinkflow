package com.thinkflow.blog.services;

import com.thinkflow.blog.models.Like;
import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.LikeRepository;
import com.thinkflow.blog.repositories.PostRepository;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Service class for handling post-related business logic
 */
@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    /**
     * Create a new post
     * @param post Post data from request
     * @param googleId Google ID of the authenticated user
     * @return Created post
     */
    public Post createPost(Post post, String googleId) {
        // Fetch the user's details
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Set the user's details in the post
        post.setUser(user);

        // Set the creation date
        post.setCreatedAt(new Date());

        // Save the post to the database
        return postRepository.save(post);
    }

    /**
     * Fetch posts by user ID
     * @param userId ID of the user whose posts to fetch
     * @return List of posts
     */
    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    /**
     * Fetch all posts for the feed, sorted by creation date
     * @return List of posts
     */
    public List<Post> getFeedPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Fetch a single post by ID
     * @param postId ID of the post to fetch
     * @return Optional containing the post if found
     */
    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    /**
     * Toggle like status for a post
     * @param postId ID of the post to like/unlike
     * @param googleId Google ID of the authenticated user
     * @return LikeResponse with updated like count and status
     */
    public LikeResponse togglePostLike(String postId, String googleId) {
        // Fetch user details
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user already liked the post
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, user.getId());

        boolean isLiked;
        if (existingLike.isPresent()) {
            // Unlike the post
            likeRepository.delete(existingLike.get());
            isLiked = false;
        } else {
            // Like the post
            Like like = new Like();
            like.setPostId(postId);
            like.setUser(user);
            like.setCreatedAt(new Date());
            likeRepository.save(like);
            isLiked = true;
        }

        // Return updated like count and status
        long likeCount = likeRepository.countByPostId(postId);
        return new LikeResponse(likeCount, isLiked);
    }

    /**
     * Get like count for a post
     * @param postId ID of the post to get like count for
     * @return Number of likes
     */
    public long getLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }

    /**
     * Get likes for a post
     * @param postId ID of the post to get likes for
     * @return List of likes
     */
    public List<Like> getLikesForPost(String postId) {
        return likeRepository.findByPostId(postId);
    }

    /**
     * Check if a user has liked a post
     * @param postId ID of the post to check
     * @param googleId Google ID of the user
     * @return True if user has liked the post, false otherwise
     */
    public boolean hasUserLikedPost(String postId, String googleId) {
        // Get the user's MongoDB ID
        Optional<User> userOptional = userRepository.findByGoogleId(googleId);
        if (userOptional.isEmpty()) {
            return false;
        }

        // Check if the user has liked the post
        Optional<Like> like = likeRepository.findByPostIdAndUserId(postId, userOptional.get().getId());
        return like.isPresent();
    }

    /**
     * Fetch posts from users the logged-in user is following
     * @param googleId Google ID of the authenticated user
     * @return List of posts from followed users
     */
    public List<Post> getFollowingPosts(String googleId) {
        // Fetch the user using Google ID
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> followingUserIds = user.getFollowing();
        if (followingUserIds.isEmpty()) {
            return new ArrayList<>();
        }

        // Fetch users being followed
        List<User> followingUsers = userRepository.findByIdIn(followingUserIds);
        return postRepository.findByUserIn(followingUsers);
    }

    /**
     * Response DTO for like operations
     */
    public static class LikeResponse {
        private long likeCount;
        private boolean liked;

        public LikeResponse(long likeCount, boolean liked) {
            this.likeCount = likeCount;
            this.liked = liked;
        }

        public long getLikeCount() {
            return likeCount;
        }

        public boolean isLiked() {
            return liked;
        }
    }
}