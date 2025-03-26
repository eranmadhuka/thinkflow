package com.thinkflow.blog.repositories;

import com.thinkflow.blog.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity CRUD operations and custom queries.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Finds a user by their Google OAuth ID.
     * @param googleId The Google ID of the user
     * @return Optional containing the user if found
     */
    Optional<User> findByGoogleId(String googleId);

    /**
     * Finds users by a list of IDs.
     * @param ids List of user IDs
     * @return List of users matching the IDs
     */
    List<User> findByIdIn(List<String> ids);



    /**
     * Finds all users except the one with the specified Google ID.
     * @param googleId Google ID to exclude
     * @return List of users
     */
    List<User> findByGoogleIdNot(String googleId);

    /**
     * Finds users not followed by the current user, excluding the current user.
     * @param currentUserId ID of the current user
     * @param followingIds IDs of users the current user follows
     * @param pageable Pagination information
     * @return Page of users not followed
     */
    @Query("{ $and: [ { _id: { $ne: ?0 } }, { _id: { $nin: ?1 } } ] }")
    Page<User> findUsersNotFollowing(String currentUserId, List<String> followingIds, Pageable pageable);
}