package com.thinkflow.blog.services;

import com.thinkflow.blog.models.Comment;
import com.thinkflow.blog.models.CommentLike;
import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.Reply;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.CommentLikeRepository;
import com.thinkflow.blog.repositories.CommentRepository;
import com.thinkflow.blog.repositories.PostRepository;
import com.thinkflow.blog.repositories.ReplyRepository;
import com.thinkflow.blog.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Service class for handling comment-related business logic
 */
@Service
public class CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository; // Added to fetch post details

    @Autowired
    private NotificationService notificationService;

    public Optional<Comment> findById(String commentId) {
        return commentRepository.findById(commentId);
    }
    /**
     * Adds a comment to a post and notifies the post's author.
     * @param postId ID of the post to comment on
     * @param comment Comment data
     * @param googleId Google ID of the authenticated user
     * @return Created comment
     */
    public Comment addComment(String postId, Comment comment, String googleId) {
        // Fetch the user's details (commenter)
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found with Google ID: " + googleId));

        // Fetch the post to get the author's ID
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));

        // Set comment details
        comment.setPostId(postId);
        comment.setUser(user);
        comment.setCreatedAt(new Date());

        // Notify the post's author
        String authorId = post.getUser().getId();
        logger.info("Notifying post author {} about comment by {}", authorId, user.getName());
        notificationService.notifyComment(user.getName(), authorId, comment.getContent());

        // Save and return the comment
        Comment savedComment = commentRepository.save(comment);
        logger.info("Comment saved with ID: {}", savedComment.getId());
        return savedComment;
    }

    // Other existing methods remain unchanged...

    /**
     * Get all comments for a post
     * @param postId ID of the post to get comments for
     * @return List of comments
     */
    public List<Comment> getCommentsForPost(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public void deleteComment(String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentRepository.delete(comment);
    }

    public Comment updateComment(String commentId, String newContent) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(newContent);
        comment.setUpdatedAt(new Date()); // Use new Date() if using Date, or LocalDateTime.now() if using LocalDateTime
        return commentRepository.save(comment);
    }

    /**
     * Toggle like status for a comment
     * @param commentId ID of the comment to like/unlike
     * @param googleId Google ID of the authenticated user
     * @return CommentLikeResponse with updated like count and status
     */
    public CommentLikeResponse toggleCommentLike(String commentId, String googleId) {
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Optional<CommentLike> existingLike = commentLikeRepository.findByCommentIdAndUserId(commentId, user.getId());
        boolean isLiked;
        if (existingLike.isPresent()) {
            commentLikeRepository.delete(existingLike.get());
            isLiked = false;
        } else {
            CommentLike like = new CommentLike();
            like.setCommentId(commentId);
            like.setUser(user);
            like.setCreatedAt(new Date());
            commentLikeRepository.save(like);
            isLiked = true;
        }
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
        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
        Optional<User> userOptional = userRepository.findByGoogleId(googleId);
        return userOptional.isPresent() &&
                commentLikeRepository.findByCommentIdAndUserId(commentId, userOptional.get().getId()).isPresent();
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
        private final long likeCount;
        private final boolean liked;

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