package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    // Fetch posts by userId (Google ID or other external ID)
    List<Post> findByUserId(String userId);

    // Fetch posts by User's MongoDB ObjectId using DBRef
    List<Post> findByUser_Id(String userObjectId);

    // Fetch all posts sorted by createdAt in descending order
    List<Post> findAllByOrderByCreatedAtDesc();
}