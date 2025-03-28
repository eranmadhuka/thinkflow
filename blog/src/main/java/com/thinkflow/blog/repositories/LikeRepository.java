package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {

    /**
     * Find a like by postId and user ID.
     *
     * @param postId The ID of the post.
     * @param userId The ID of the user.
     * @return Optional containing the like, if found.
     */
    Optional<Like> findByPostIdAndUserId(String postId, String userId);

    /**
     * Count the number of likes for a post.
     *
     * @param postId The ID of the post.
     * @return The number of likes for the post.
     */
    long countByPostId(String postId);

    List<Like> findByPostId(String postId); // Add this method if it doesn't exist

    /**
     * Find all likes by a user's MongoDB ObjectId.
     * @param userId The MongoDB ObjectId of the user as a string.
     * @return List of likes created by the user.
     */
    @Query("{ 'user.$id' : { $oid: ?0 } }")
    List<Like> findByUserId(String userId);

    /**
     * Delete all likes by a user's MongoDB ObjectId.
     * @param userId The MongoDB ObjectId of the user.
     */
    @Query(value = "{ 'user.$id' : { $oid: ?0 } }", delete = true)
    void deleteByUserId(String userId);

    /**
     * Delete all likes for a list of post IDs.
     * @param postIds List of post IDs.
     */
    @Query(value = "{ 'postId' : { $in: ?0 } }", delete = true)
    void deleteByPostIdIn(List<String> postIds);
}