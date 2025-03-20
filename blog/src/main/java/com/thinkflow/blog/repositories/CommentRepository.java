package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    /**
     * Find all comments for a post.
     *
     * @param postId The ID of the post.
     * @return List of comments for the post.
     */
    List<Comment> findByPostId(String postId);

    /**
     * Count the number of comments for a post.
     *
     * @param postId The ID of the post.
     * @return The number of comments for the post.
     */
    long countByPostId(String postId);
}