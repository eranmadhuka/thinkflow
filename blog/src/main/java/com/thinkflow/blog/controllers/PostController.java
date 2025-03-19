package com.thinkflow.blog.controllers;

import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.PostRepository;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @AuthenticationPrincipal OAuth2User principal) {
        // Set the user ID from the authenticated user
        String userId = principal.getAttribute("sub");
        post.setUserId(userId);

        // Fetch the user's details
        User user = userRepository.findByGoogleId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Set the user's details in the post
        post.setUser(user);

        // Set the user's MongoDB ObjectId
        post.setUserObjectId(user.getId());

        // Set the creation date
        post.setCreatedAt(new Date());

        // Save the post to the database
        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    // Fetch posts by user ID
    @GetMapping("/user/{userObjectId}")
    public ResponseEntity<List<Post>> getPostsByUserObjectId(@PathVariable String userObjectId) {
        System.out.println("Fetching posts for userObjectId: " + userObjectId); // Debugging
        List<Post> posts = postRepository.findByUser_Id(userObjectId); // Fetch posts by User's MongoDB ObjectId
        System.out.println("Number of posts found: " + posts.size()); // Debugging
        return ResponseEntity.ok(posts);
    }

    // Fetch all posts for the feed
    @GetMapping("/feed")
    public List<Post> getFeedPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc(); // Fetch all posts sorted by creation date
    }

    // Fetch a single post by ID
    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPostById(@PathVariable String postId) {
        Optional<Post> post = postRepository.findById(postId); // Fetch post by ID
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}