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
 * Service class for handling post-related business logic in the blogging platform.
 */
@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Finds a post by its ID.
     * @param postId ID of the post to find
     * @return Optional containing the post if found
     */
    public Optional<Post> findById(String postId) {
        return postRepository.findById(postId);
    }

    /**
     * Creates a new post for the authenticated user.
     * @param post Post data from the request
     * @param userId MongoDB ObjectId of the authenticated user
     * @return Created post
     */
    public Post createPost(Post post, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        post.setUser(user);
        post.setCreatedAt(new Date());
        return postRepository.save(post);
    }

    /**
     * Updates an existing post with new data.
     * @param postId ID of the post to update
     * @param postUpdates Updated post data
     * @return Updated post
     */
    public Post updatePost(String postId, Post postUpdates) {
        return postRepository.findById(postId)
                .map(existingPost -> {
                    existingPost.setTitle(postUpdates.getTitle());
                    existingPost.setContent(postUpdates.getContent());
                    existingPost.setMediaUrls(postUpdates.getMediaUrls());
                    existingPost.setFileTypes(postUpdates.getFileTypes());
                    existingPost.setTags(postUpdates.getTags());
                    return postRepository.save(existingPost);
                })
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
    }

    /**
     * Retrieves all posts created by a specific user.
     * @param userId MongoDB ObjectId of the user whose posts to fetch
     * @return List of posts
     */
    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    /**
     * Retrieves all posts for the feed, sorted by creation date in descending order.
     * @return List of posts
     */
    public List<Post> getFeedPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Retrieves a single post by its ID.
     * @param postId ID of the post to fetch
     * @return Optional containing the post if found
     */
    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    /**
     * Toggles like status for a post by the authenticated user.
     * @param postId ID of the post to like/unlike
     * @param userId MongoDB ObjectId of the authenticated user
     * @return LikeResponse with updated like count and status
     */
    public LikeResponse togglePostLike(String postId, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));

        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, user.getId());
        boolean isLiked;

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            isLiked = false;
        } else {
            notificationService.notifyLike(user.getName(), post.getUser().getId());
            Like like = new Like();
            like.setPostId(postId);
            like.setUser(user);
            like.setCreatedAt(new Date());
            likeRepository.save(like);
            isLiked = true;
        }

        long likeCount = likeRepository.countByPostId(postId);
        return new LikeResponse(likeCount, isLiked);
    }

    /**
     * Retrieves the number of likes for a post.
     * @param postId ID of the post
     * @return Number of likes
     */
    public long getLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }

    /**
     * Retrieves all likes for a post.
     * @param postId ID of the post
     * @return List of likes
     */
    public List<Like> getLikesForPost(String postId) {
        return likeRepository.findByPostId(postId);
    }

    /**
     * Checks if a user has liked a post.
     * @param postId ID of the post to check
     * @param userId MongoDB ObjectId of the user
     * @return True if the user has liked the post, false otherwise
     */
    public boolean hasUserLikedPost(String postId, String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.isPresent() &&
                likeRepository.findByPostIdAndUserId(postId, userOptional.get().getId()).isPresent();
    }

    /**
     * Retrieves posts from users the authenticated user is following.
     * @param userId MongoDB ObjectId of the authenticated user
     * @return List of posts from followed users
     */
    public List<Post> getFollowingPosts(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        List<String> followingUserIds = user.getFollowing();
        if (followingUserIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<User> followingUsers = userRepository.findByIdIn(followingUserIds);
        return postRepository.findByUserIn(followingUsers);
    }

    /**
     * Deletes a post.
     * @param postId ID of the post to delete
     */
    public void deletePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        postRepository.delete(post);
    }

    /**
     * Data Transfer Object for like operation responses.
     */
    public static class LikeResponse {
        private final long likeCount;
        private final boolean liked;

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