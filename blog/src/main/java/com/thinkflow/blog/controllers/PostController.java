package com.thinkflow.blog.controllers;

import com.thinkflow.blog.models.*;
import com.thinkflow.blog.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @AuthenticationPrincipal OAuth2User principal) {
        try {
            // Set the user ID from the authenticated user
            String userId = principal.getAttribute("sub");

            // Fetch the user's details
            User user = userRepository.findByGoogleId(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Set the user's details in the post
            post.setUser(user);

            // Set the creation date
            post.setCreatedAt(new Date());

            // Save the post to the database
            Post savedPost = postRepository.save(post);
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Fetch posts by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUserId(@PathVariable String userId) {
        try {
            List<Post> posts = postRepository.findByUserId(userId); // Fetch posts by User's MongoDB ObjectId
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching posts");
        }
    }

    // Fetch all posts for the feed
    @GetMapping("/feed")
    public ResponseEntity<?> getFeedPosts() {
        try {
            List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(); // Fetch all posts sorted by creation date
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching feed posts");
        }
    }

    // Fetch a single post by ID
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        try {
            Optional<Post> post = postRepository.findById(postId); // Fetch post by ID
            return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the post");
        }
    }

    // Like a post
    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable String postId, @AuthenticationPrincipal OAuth2User principal) {
        try {
            String userId = principal.getAttribute("sub");

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            // Fetch user details
            User user = userRepository.findByGoogleId(userId)
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
            return ResponseEntity.ok(new LikeResponse(likeCount, isLiked));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the like");
        }
    }

    // DTO for response
    class LikeResponse {
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

    // Add a comment
    @PostMapping("/{postId}/comment")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody Comment comment,
            @AuthenticationPrincipal OAuth2User principal
    ) {
        try {
            String userId = principal.getAttribute("sub");

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            // Fetch the user's details
            User user = userRepository.findByGoogleId(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Set comment details
            comment.setPostId(postId);
            comment.setUser(user); // Set the user reference
            comment.setCreatedAt(new Date());
            commentRepository.save(comment);

            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the comment");
        }
    }

    // Fetch all comments for a post
    @GetMapping("/{postId}/comments")
    public ResponseEntity<?> getCommentsForPost(@PathVariable String postId) {
        try {
            List<Comment> comments = commentRepository.findByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching comments");
        }
    }

    // Fetch like count for a post
    @GetMapping("/{postId}/like-count")
    public ResponseEntity<?> getLikeCount(@PathVariable String postId) {
        try {
            long likeCount = likeRepository.countByPostId(postId);
            return ResponseEntity.ok(likeCount);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching like count");
        }
    }

    // NEW ENDPOINT: Fetch users who liked a post
    @GetMapping("/{postId}/likes")
    public ResponseEntity<?> getLikesForPost(@PathVariable String postId) {
        try {
            List<Like> likes = likeRepository.findByPostId(postId);
            return ResponseEntity.ok(likes);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching likes");
        }
    }

    // Check if the current user has liked a post
    @GetMapping("/{postId}/has-liked")
    public ResponseEntity<?> hasUserLikedPost(
            @PathVariable String postId,
            @AuthenticationPrincipal OAuth2User principal
    ) {
        try {
            if (principal == null) {
                return ResponseEntity.ok(false);
            }

            String userId = principal.getAttribute("sub");
            if (userId == null) {
                return ResponseEntity.ok(false);
            }

            // Get the user's MongoDB ID
            Optional<User> userOptional = userRepository.findByGoogleId(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.ok(false);
            }

            // Check if the user has liked the post
            Optional<Like> like = likeRepository.findByPostIdAndUserId(postId, userOptional.get().getId());
            return ResponseEntity.ok(like.isPresent());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while checking like status");
        }
    }
}