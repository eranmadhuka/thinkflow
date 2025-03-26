package com.thinkflow.blog.services;

import com.thinkflow.blog.models.Post;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.PostRepository;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Service class handling user-related business logic.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Saves a user entity to the database.
     * @param user User entity to save
     * @return Saved user
     */
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Allows a user to follow another user and sends a notification.
     * @param followerId ID of the user who wants to follow
     * @param followeeId ID of the user to be followed
     */
    public void followUser(String followerId, String followeeId) {
        User follower = getUserById(followerId);
        User followee = getUserById(followeeId);

        notificationService.notifyFollow(follower.getName(), followeeId);

        follower.getFollowing().add(followeeId);
        followee.getFollowers().add(followerId);

        userRepository.saveAll(Arrays.asList(follower, followee));
    }

    /**
     * Allows a user to unfollow another user.
     * @param followerId ID of the user who wants to unfollow
     * @param followeeId ID of the user to be unfollowed
     */
    public void unfollowUser(String followerId, String followeeId) {
        User follower = getUserById(followerId);
        User followee = getUserById(followeeId);

        follower.getFollowing().remove(followeeId);
        followee.getFollowers().remove(followerId);

        userRepository.saveAll(Arrays.asList(follower, followee));
    }

    /**
     * Retrieves users by their IDs.
     * @param userIds List of user IDs
     * @return List of users
     */
    public List<User> getUsersByIds(List<String> userIds) {
        return userRepository.findByIdIn(userIds);
    }

    /**
     * Saves a post for a user.
     * @param userId ID of the user
     * @param postId ID of the post to save
     */
    public void savePost(String userId, String postId) {
        User user = getUserById(userId);
        if (!user.getSavedPosts().contains(postId)) {
            user.getSavedPosts().add(postId);
            userRepository.save(user);
        }
    }

    /**
     * Removes a saved post for a user.
     * @param userId ID of the user
     * @param postId ID of the post to unsave
     */
    public void unsavePost(String userId, String postId) {
        User user = getUserById(userId);
        user.getSavedPosts().remove(postId);
        userRepository.save(user);
    }

    /**
     * Retrieves a user by ID or throws an exception if not found.
     * @param userId ID of the user
     * @return User entity
     */
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    /**
     * Retrieves details of saved posts for a user.
     * @param userId ID of the user
     * @return List of saved posts
     */
    public List<Post> getSavedPostsDetails(String userId) {
        User user = getUserById(userId);
        return postRepository.findByIdIn(user.getSavedPosts());
    }

    /**
     * Retrieves all friends (following + followers) of a user.
     * @param userId ID of the user
     * @return List of friends
     */
    public List<User> getUserFriends(String userId) {
        User user = getUserById(userId);
        Set<String> friendIds = new HashSet<>(user.getFollowing());
        friendIds.addAll(user.getFollowers());
        friendIds.remove(userId);
        return userRepository.findAllById(friendIds);
    }

    /**
     * Retrieves mutual friends between two users.
     * @param userId1 ID of the first user
     * @param userId2 ID of the second user
     * @return List of mutual friends
     */
    public List<User> getMutualFriends(String userId1, String userId2) {
        User user1 = getUserById(userId1);
        User user2 = getUserById(userId2);

        Set<String> mutualFriendIds = new HashSet<>(user1.getFollowing());
        mutualFriendIds.retainAll(user2.getFollowing());

        if (user1.getFollowing().contains(userId2)) {
            mutualFriendIds.add(userId2);
        }
        if (user2.getFollowing().contains(userId1)) {
            mutualFriendIds.add(userId1);
        }

        return userRepository.findAllById(mutualFriendIds);
    }

    /**
     * Retrieves users not followed by the current user with pagination.
     * @param currentUserId ID of the current user
     * @param page Page number
     * @param size Page size
     * @return Page of users not followed
     */
    public Page<User> getUsersNotFollowing(String currentUserId, int page, int size) {
        User currentUser = getUserById(currentUserId);
        List<String> followingIds = currentUser.getFollowing() != null ?
                new ArrayList<>(currentUser.getFollowing()) : new ArrayList<>();
        followingIds.add(currentUserId); // Exclude self

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return userRepository.findUsersNotFollowing(currentUserId, followingIds, pageable);
    }
}