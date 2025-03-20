package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    /**
     * Find all posts by a user's MongoDB ObjectId.
     *
     * @param userId The MongoDB ObjectId of the user.
     * @return List of posts created by the user.
     */
    List<Post> findByUserId(String userId);

    /**
     * Find all posts sorted by creation date in descending order.
     *
     * @return List of posts sorted by createdAt in descending order.
     */
    List<Post> findAllByOrderByCreatedAtDesc();


    List<Post> findByUserIn(List<User> users);


}