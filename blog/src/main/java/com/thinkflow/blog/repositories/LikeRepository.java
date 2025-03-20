package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
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
}