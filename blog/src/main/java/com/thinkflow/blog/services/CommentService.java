package com.thinkflow.blog.services;

import com.thinkflow.blog.models.Comment;
import com.thinkflow.blog.models.CommentLike;
import com.thinkflow.blog.models.Reply;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.CommentLikeRepository;
import com.thinkflow.blog.repositories.CommentRepository;
import com.thinkflow.blog.repositories.ReplyRepository;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Service class for handling comment-related business logic
 */
@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Add a comment to a post
     * @param postId ID of the post to comment on
     * @param comment Comment data
     * @param googleId Google ID of the authenticated user
     * @return Created comment
     */
    public Comment addComment(String postId, Comment comment, String googleId) {
        // Fetch the user's details
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Set comment details
        comment.setPostId(postId);
        comment.setUser(user);
        comment.setCreatedAt(new Date());
        return commentRepository.save(comment);
    }

    /**
     * Get all comments for a post
     * @param postId ID of the post to get comments for
     * @return List of comments
     */
    public List<Comment> getCommentsForPost(String postId) {
        return commentRepository.findByPostId(postId);
    }

    /**
     * Toggle like status for a comment
     * @param commentId ID of the comment to like/unlike
     * @param googleId Google ID of the authenticated user
     * @return CommentLikeResponse with updated like count and status
     */
    public CommentLikeResponse toggleCommentLike(String commentId, String googleId) {
        // Fetch user details
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user already liked the comment
        Optional<CommentLike> existingLike = commentLikeRepository.findByCommentIdAndUserId(commentId, user.getId());

        boolean isLiked;
        if (existingLike.isPresent()) {
            // Unlike the comment
            commentLikeRepository.delete(existingLike.get());
            isLiked = false;
        } else {
            // Like the comment
            CommentLike like = new CommentLike();
            like.setCommentId(commentId);
            like.setUser(user);
            like.setCreatedAt(new Date());
            commentLikeRepository.save(like);
            isLiked = true;
        }

        // Return updated like count and status
        long likeCount = commentLikeRepository.countByCommentId(commentId);
        return new CommentLikeResponse(likeCount, isLiked);
    }

    /**
     * Add a reply to a comment
     * @param commentId ID of the comment to reply to
     * @param reply Reply data
     * @param googleId Google ID of the authenticated user
     * @return Created reply
     */
    public Reply addReply(String commentId, Reply reply, String googleId) {
        // Fetch the user's details
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Set reply details
        reply.setCommentId(commentId);
        reply.setUser(user);
        reply.setCreatedAt(new Date());
        return replyRepository.save(reply);
    }

    /**
     * Get all replies for a comment
     * @param commentId ID of the comment to get replies for
     * @return List of replies
     */
    public List<Reply> getRepliesForComment(String commentId) {
        return replyRepository.findByCommentId(commentId);
    }

    /**
     * Check if a user has liked a comment
     * @param commentId ID of the comment to check
     * @param googleId Google ID of the user
     * @return True if user has liked the comment, false otherwise
     */
    public boolean hasUserLikedComment(String commentId, String googleId) {
        // Get the user's MongoDB ID
        Optional<User> userOptional = userRepository.findByGoogleId(googleId);
        if (userOptional.isEmpty()) {
            return false;
        }

        // Check if the user has liked the comment
        Optional<CommentLike> like = commentLikeRepository.findByCommentIdAndUserId(commentId, userOptional.get().getId());
        return like.isPresent();
    }

    /**
     * Get comment like count
     * @param commentId ID of the comment to get like count for
     * @return Number of likes
     */
    public long getCommentLikeCount(String commentId) {
        return commentLikeRepository.countByCommentId(commentId);
    }

    /**
     * Response DTO for comment like operations
     */
    public static class CommentLikeResponse {
        private long likeCount;
        private boolean liked;

        public CommentLikeResponse(long likeCount, boolean liked) {
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