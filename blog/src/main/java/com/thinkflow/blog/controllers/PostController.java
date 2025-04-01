package com.thinkflow.blog.controllers;

import com.thinkflow.blog.models.*;
import com.thinkflow.blog.repositories.PostRepository;
import com.thinkflow.blog.repositories.UserRepository;
import com.thinkflow.blog.services.PostService;
import com.thinkflow.blog.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for handling post-related operations
 * Responsible for processing HTTP requests and delegating business logic to services
 */
@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    /**
     * Create a new post
     * @param post Post data from request body
     * @param principal Authenticated user information
     * @return Created post with HTTP status
     */
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Post savedPost = postService.createPost(post, user.getId());
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Update an existing post
     * @param postId ID of the post to update
     * @param postUpdates Updated post data
     * @param principal Authenticated user information
     * @return Updated post with HTTP status
     */
    @PutMapping("/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String postId,
            @RequestBody Post postUpdates,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Post> existingPost = postService.findById(postId);
            if (existingPost.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Post post = existingPost.get();
            if (!post.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Post updatedPost = postService.updatePost(postId, postUpdates);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Fetch posts by user ID (MongoDB ObjectId)
     * @param userId MongoDB ObjectId of the user whose posts to fetch
     * @return List of posts with HTTP status
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUserId(@PathVariable String userId) {
        try {
            List<Post> posts = postService.getPostsByUserId(userId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching posts");
        }
    }

    /**
     * Fetch all posts for the feed, sorted by creation date
     * @return List of posts with HTTP status
     */
    @GetMapping("/feed")
    public ResponseEntity<?> getFeedPosts() {
        try {
            List<Post> posts = postService.getFeedPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching feed posts");
        }
    }

    /**
     * Fetch a single post by ID
     * @param postId ID of the post to fetch
     * @return Post with HTTP status
     */
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        try {
            return postService.getPostById(postId)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the post");
        }
    }

    /**
     * Like or unlike a post
     * @param postId ID of the post to like/unlike
     * @param principal Authenticated user information
     * @return LikeResponse with updated like count and status
     */
    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable String postId, @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(postService.togglePostLike(postId, user.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the like");
        }
    }

    /**
     * Fetch like count for a post
     * @param postId ID of the post to fetch like count for
     * @return Like count with HTTP status
     */
    @GetMapping("/{postId}/like-count")
    public ResponseEntity<?> getLikeCount(@PathVariable String postId) {
        try {
            long likeCount = postService.getLikeCount(postId);
            return ResponseEntity.ok(likeCount);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching like count");
        }
    }

    /**
     * Fetch users who liked a post
     * @param postId ID of the post to fetch likes for
     * @return List of likes with HTTP status
     */
    @GetMapping("/{postId}/likes")
    public ResponseEntity<?> getLikesForPost(@PathVariable String postId) {
        try {
            List<Like> likes = postService.getLikesForPost(postId);
            return ResponseEntity.ok(likes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching likes");
        }
    }

    /**
     * Check if the current user has liked a post
     * @param postId ID of the post to check
     * @param principal Authenticated user information
     * @return Boolean indicating if user has liked the post
     */
    @GetMapping("/{postId}/has-liked")
    public ResponseEntity<?> hasUserLikedPost(
            @PathVariable String postId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null) {
                return ResponseEntity.ok(false);
            }
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            boolean hasLiked = postService.hasUserLikedPost(postId, user.getId());
            return ResponseEntity.ok(hasLiked);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while checking like status");
        }
    }

    /**
     * Fetch posts from users the logged-in user is following
     * @param principal Authenticated user information
     * @return List of posts with HTTP status
     */
    @GetMapping("/following")
    public ResponseEntity<List<Post>> getFollowingPosts(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }
        String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
        User user = userRepository.findByProviderId(providerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Post> followingPosts = postService.getFollowingPosts(user.getId());
        return ResponseEntity.ok(followingPosts);
    }

    /**
     * Delete a post
     * @param postId ID of the post to delete
     * @param principal Authenticated user information
     * @return HTTP status
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable String postId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Post> existingPost = postService.findById(postId);
            if (existingPost.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Post post = existingPost.get();
            if (!post.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            postService.deletePost(postId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the post");
        }
    }
}