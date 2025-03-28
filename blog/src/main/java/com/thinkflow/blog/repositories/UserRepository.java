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
     * Finds a user by their OAuth provider ID.
     * @param providerId The OAuth provider's unique identifier (e.g., Google "sub", Facebook "id")
     * @return Optional containing the user if found
     */

    @Query("{ 'identities.providerId': ?0 }")
    Optional<User> findByProviderId(String providerId); // Updated to query nested field


    Optional<User> findByEmail(String email);
    /**
     * Finds users by a list of IDs.
     * @param ids List of user IDs
     * @return List of users matching the IDs
     */
    List<User> findByIdIn(List<String> ids);

    /**
     * Finds all users except the one with the specified provider ID.
     * @param providerId Provider ID to exclude
     * @return List of users
     */
    @Query("{ 'identities.providerId': { $ne: ?0 } }")
    List<User> findByProviderIdNot(String providerId);

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