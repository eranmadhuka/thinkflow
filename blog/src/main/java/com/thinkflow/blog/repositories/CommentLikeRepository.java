package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.CommentLike;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CommentLikeRepository extends MongoRepository<CommentLike, String> {
    List<CommentLike> findByCommentId(String commentId);
    long countByCommentId(String commentId);
    Optional<CommentLike> findByCommentIdAndUserId(String commentId, String userId);
}