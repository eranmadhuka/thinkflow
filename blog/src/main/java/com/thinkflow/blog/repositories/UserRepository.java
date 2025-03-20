package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByGoogleId(String googleId);
    List<User> findByIdIn(List<String> ids);
}