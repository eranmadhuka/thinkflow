package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    /**
     * Find all posts by a user's MongoDB ObjectId.
     * @param userId The MongoDB ObjectId of the user as a string.
     * @return List of posts created by the user.
     */
    @Query("{ 'user.$id' : { $oid: ?0 } }")
    List<Post> findByUserId(String userId);

    /**
     * Find all posts sorted by creation date in descending order.
     * @return List of posts sorted by createdAt in descending order.
     */
    List<Post> findAllByOrderByCreatedAtDesc();

    /**
     * Find posts where the user is in the provided list of users.
     * @param users List of User objects.
     * @return List of posts created by the specified users.
     */
    List<Post> findByUserIn(List<User> users);

    /**
     * Find posts by a list of post IDs.
     * @param ids List of post IDs.
     * @return List of posts matching the provided IDs.
     */
    List<Post> findByIdIn(List<String> ids);

    /**
     * Delete all posts by a user's MongoDB ObjectId.
     * @param userId The MongoDB ObjectId of the user.
     */
    @Query(value = "{ 'user.$id' : { $oid: ?0 } }", delete = true)
    void deleteByUserId(String userId);
}