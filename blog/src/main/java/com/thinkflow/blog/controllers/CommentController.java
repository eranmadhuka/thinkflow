package com.thinkflow.blog.controllers;

import com.thinkflow.blog.models.Comment;
import com.thinkflow.blog.models.Reply;
import com.thinkflow.blog.services.CommentService;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for handling comment-related operations
 */
@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Add a comment to a post
     * @param postId ID of the post to comment on
     * @param comment Comment data from request body
     * @param principal Authenticated user information
     * @return Created comment with HTTP status
     */
    @PostMapping("/{postId}")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody Comment comment,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Comment savedComment = commentService.addComment(postId, comment, user.getId());
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
    @GetMapping("/{postId}/all")
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
     * Like or unlike a comment
     * @param commentId ID of the comment to like/unlike
     * @param principal Authenticated user information
     * @return CommentLikeResponse with updated like count and status
     */
    @PostMapping("/{commentId}/like")
    public ResponseEntity<?> likeComment(
            @PathVariable String commentId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(commentService.toggleCommentLike(commentId, user.getId()));
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
    @PostMapping("/{commentId}/reply")
    public ResponseEntity<?> addReply(
            @PathVariable String commentId,
            @RequestBody Reply reply,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Reply savedReply = commentService.addReply(commentId, reply, user.getId());
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
    @GetMapping("/{commentId}/replies")
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
    @GetMapping("/{commentId}/has-liked")
    public ResponseEntity<?> hasUserLikedComment(
            @PathVariable String commentId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null) {
                return ResponseEntity.ok(false);
            }
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            boolean hasLiked = commentService.hasUserLikedComment(commentId, user.getId());
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
    @GetMapping("/{commentId}/like-count")
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
     * Delete a comment
     * @param commentId ID of the comment to delete
     * @param principal Authenticated user information
     * @return HTTP status
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String commentId,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Comment comment = commentService.findById(commentId)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));

            if (!comment.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            commentService.deleteComment(commentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the comment");
        }
    }

    /**
     * Update a comment
     * @param commentId ID of the comment to update
     * @param commentUpdates Updated comment data
     * @param principal Authenticated user information
     * @return Updated comment with HTTP status
     */
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable String commentId,
            @RequestBody Comment commentUpdates,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String providerId = principal.getAttribute("sub") != null ? principal.getAttribute("sub") : principal.getAttribute("id");
            User user = userRepository.findByProviderId(providerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Comment existingComment = commentService.findById(commentId)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));

            if (!existingComment.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Comment updatedComment = commentService.updateComment(commentId, commentUpdates.getContent());
            return ResponseEntity.ok(updatedComment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the comment");
        }
    }
}