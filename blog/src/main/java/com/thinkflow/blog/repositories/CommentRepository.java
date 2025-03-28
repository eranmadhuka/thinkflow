package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
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

    /**
     * Find all comments by a user's MongoDB ObjectId.
     * @param userId The MongoDB ObjectId of the user as a string.
     * @return List of comments created by the user.
     */
    @Query("{ 'user.$id' : { $oid: ?0 } }")
    List<Comment> findByUserId(String userId);

    /**
     * Delete all comments by a user's MongoDB ObjectId.
     * @param userId The MongoDB ObjectId of the user.
     */
    @Query(value = "{ 'user.$id' : { $oid: ?0 } }", delete = true)
    void deleteByUserId(String userId);

    /**
     * Delete all comments for a list of post IDs.
     * @param postIds List of post IDs.
     */
    @Query(value = "{ 'postId' : { $in: ?0 } }", delete = true)
    void deleteByPostIdIn(List<String> postIds);
}