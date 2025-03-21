package com.thinkflow.blog.controllers;

import com.thinkflow.blog.models.*;
import com.thinkflow.blog.services.PostService;
import com.thinkflow.blog.services.CommentService;
import com.thinkflow.blog.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

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
    private CommentService commentService;

    @Autowired
    private UserService userService;

    /**
     * Create a new post
     * @param post Post data from request body
     * @param principal Authenticated user information
     * @return Created post with HTTP status
     */
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @AuthenticationPrincipal OAuth2User principal) {
        try {
            String userId = principal.getAttribute("sub");
            Post savedPost = postService.createPost(post, userId);
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Fetch posts by user ID
     * @param userId ID of the user whose posts to fetch
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
            String userId = principal.getAttribute("sub");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            return ResponseEntity.ok(postService.togglePostLike(postId, userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the like");
        }
    }

    /**
     * Add a comment to a post
     * @param postId ID of the post to comment on
     * @param comment Comment data from request body
     * @param principal Authenticated user information
     * @return Created comment with HTTP status
     */
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

            Comment savedComment = commentService.addComment(postId, comment, userId);
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the comment");
        }
    }

    /**
     * Fetch all comments for a post
     * @param postId ID of the post to fetch comments for
     * @return List of comments with HTTP status
     */
    @GetMapping("/{postId}/comments")
    public ResponseEntity<?> getCommentsForPost(@PathVariable String postId) {
        try {
            List<Comment> comments = commentService.getCommentsForPost(postId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching comments");
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

            boolean hasLiked = postService.hasUserLikedPost(postId, userId);
            return ResponseEntity.ok(hasLiked);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while checking like status");
        }
    }

    /**
     * Like or unlike a comment
     * @param commentId ID of the comment to like/unlike
     * @param principal Authenticated user information
     * @return CommentLikeResponse with updated like count and status
     */
    @PostMapping("/comments/{commentId}/like")
    public ResponseEntity<?> likeComment(@PathVariable String commentId, @AuthenticationPrincipal OAuth2User principal) {
        try {
            String userId = principal.getAttribute("sub");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            return ResponseEntity.ok(commentService.toggleCommentLike(commentId, userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the comment like");
        }
    }

    /**
     * Add a reply to a comment
     * @param commentId ID of the comment to reply to
     * @param reply Reply data from request body
     * @param principal Authenticated user information
     * @return Created reply with HTTP status
     */
    @PostMapping("/comments/{commentId}/reply")
    public ResponseEntity<?> addReply(
            @PathVariable String commentId,
            @RequestBody Reply reply,
            @AuthenticationPrincipal OAuth2User principal
    ) {
        try {
            String userId = principal.getAttribute("sub");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            Reply savedReply = commentService.addReply(commentId, reply, userId);
            return ResponseEntity.ok(savedReply);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the reply");
        }
    }

    /**
     * Get all replies for a comment
     * @param commentId ID of the comment to fetch replies for
     * @return List of replies with HTTP status
     */
    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<?> getRepliesForComment(@PathVariable String commentId) {
        try {
            List<Reply> replies = commentService.getRepliesForComment(commentId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching replies");
        }
    }

    /**
     * Check if the current user has liked a comment
     * @param commentId ID of the comment to check
     * @param principal Authenticated user information
     * @return Boolean indicating if user has liked the comment
     */
    @GetMapping("/comments/{commentId}/has-liked")
    public ResponseEntity<?> hasUserLikedComment(
            @PathVariable String commentId,
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

            boolean hasLiked = commentService.hasUserLikedComment(commentId, userId);
            return ResponseEntity.ok(hasLiked);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while checking comment like status");
        }
    }

    /**
     * Get comment like count
     * @param commentId ID of the comment to fetch like count for
     * @return Like count with HTTP status
     */
    @GetMapping("/comments/{commentId}/like-count")
    public ResponseEntity<?> getCommentLikeCount(@PathVariable String commentId) {
        try {
            long likeCount = commentService.getCommentLikeCount(commentId);
            return ResponseEntity.ok(likeCount);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching comment like count");
        }
    }

    /**
     * Fetch posts from users the logged-in user is following
     * @param principal Authenticated user information
     * @return List of posts with HTTP status
     */
    @GetMapping("/following")
    public ResponseEntity<List<Post>> getFollowingPosts(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }

        List<Post> followingPosts = postService.getFollowingPosts(principal.getName());
        return ResponseEntity.ok(followingPosts);
    }
}