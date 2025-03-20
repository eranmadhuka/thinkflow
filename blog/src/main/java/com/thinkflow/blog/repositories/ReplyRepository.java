package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.Reply;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReplyRepository extends MongoRepository<Reply, String> {
    List<Reply> findByCommentId(String commentId);
}