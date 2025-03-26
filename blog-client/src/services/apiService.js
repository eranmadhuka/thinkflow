import axios from 'axios';

// Base configuration for API interactions
class ApiService {
    constructor() {
        // Create axios instance with base configuration
        this.client = axios.create({
            baseURL: 'http://localhost:8080', // Backend API base URL
            withCredentials: true, // Important for OAuth 2.0 authentication
        });
    }

    /* ========== Post-related Methods ========== */

    /**
     * Retrieve the number of likes for a specific post
     * @param {string} postId - Unique identifier of the post
     * @returns {Promise<number>} Number of likes or 0 if request fails
     */
    async getPostLikeCount(postId) {
        try {
            const response = await this.client.get(`/posts/${postId}/like-count`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch like count:', error);
            return 0;
        }
    }

    /**
     * Check if the current user has liked a specific post
     * @param {string} postId - Unique identifier of the post
     * @returns {Promise<boolean>} Liked status of the post
     */
    async checkUserLikedPost(postId) {
        try {
            const response = await this.client.get(`/posts/${postId}/has-liked`);
            return response.data;
        } catch (error) {
            console.error('Failed to check like status:', error);
            return false;
        }
    }

    /**
     * Retrieve comments for a specific post
     * @param {string} postId - Unique identifier of the post
     * @returns {Promise<Array>} List of comments or empty array if request fails
     */
    async getPostComments(postId) {
        try {
            const response = await this.client.get(`/posts/${postId}/comments`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            return [];
        }
    }

    /**
     * Like a post
     * @param {string} postId - Unique identifier of the post to like
     * @returns {Promise<boolean>} Success status of like action
     */
    async likePost(postId) {
        try {
            await this.client.post(`/posts/${postId}/like`);
            return true;
        } catch (error) {
            console.error('Failed to like post:', error);
            return false;
        }
    }

    /**
     * Delete a specific post
     * @param {string} postId - Unique identifier of the post to delete
     * @returns {Promise<boolean>} Success status of delete action
     */
    async deletePost(postId) {
        try {
            await this.client.delete(`/posts/${postId}`);
            return true;
        } catch (error) {
            console.error('Failed to delete post:', error);
            return false;
        }
    }

    /* ========== User-related Methods ========== */

    /**
     * Retrieve saved posts for a user
     * @param {string} userId - Unique identifier of the user
     * @returns {Promise<Array>} List of saved posts or empty array
     */
    async getSavedPosts(userId) {
        try {
            const response = await this.client.get(`/user/${userId}/saved-posts`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch saved posts:', error);
            return [];
        }
    }

    /**
     * Save a post for a user
     * @param {string} userId - Unique identifier of the user
     * @param {string} postId - Unique identifier of the post to save
     * @returns {Promise<boolean>} Success status of save action
     */
    async savePost(userId, postId) {
        try {
            await this.client.post(`/user/${userId}/save/${postId}`);
            return true;
        } catch (error) {
            console.error('Failed to save post:', error);
            return false;
        }
    }

    /**
     * Unfollow a user
     * @param {string} userId - Unique identifier of the current user
     * @param {string} targetUserId - Unique identifier of the user to unfollow
     * @returns {Promise<boolean>} Success status of unfollow action
     */
    async unfollowUser(userId, targetUserId) {
        try {
            await this.client.post(`/user/${userId}/unfollow/${targetUserId}`);
            return true;
        } catch (error) {
            console.error('Failed to unfollow user:', error);
            return false;
        }
    }

    /**
     * Follow a user
     * @param {string} followerId - Unique identifier of the current user
     * @param {string} followeeId - Unique identifier of the user to follow
     * @returns {Promise<boolean>} Success status of follow action
     */
    async followUser(followerId, followeeId) {
        try {
            await this.client.post(`/user/${followerId}/follow/${followeeId}`);
            return true;
        } catch (error) {
            console.error('Failed to follow user:', error);
            return false;
        }
    }

    /**
     * Retrieve user profile details
     * @param {string} userId - Unique identifier of the user
     * @returns {Promise<Object|null>} User profile details or null if fetch fails
     */
    async getUserProfile(userId) {
        try {
            const response = await this.client.get(`/user/profile/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            return null;
        }
    }

    /**
     * Retrieve posts for a specific user
     * @param {string} userId - Unique identifier of the user
     * @returns {Promise<Array>} List of user's posts or empty array
     */
    async getUserPosts(userId) {
        try {
            const response = await this.client.get(`/posts/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user posts:', error);
            return [];
        }
    }

    /**
     * Retrieve feed posts
     * @returns {Promise<Array>} List of feed posts or empty array
     */
    async getFeedPosts() {
        try {
            const response = await this.client.get('/posts/feed');
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch feed posts:', error);
            return [];
        }
    }

    /**
     * Retrieve detailed information for a specific post
     * @param {string} postId - Unique identifier of the post
     * @returns {Promise<Object|null>} Detailed post information or null
     */
    async getPostDetails(postId) {
        try {
            const [post, likeCount, comments, hasLiked] = await Promise.all([
                this.client.get(`/posts/${postId}`),
                this.getPostLikeCount(postId),
                this.getPostComments(postId),
                this.checkUserLikedPost(postId)
            ]);

            return {
                ...post.data,
                likeCount,
                commentCount: comments.length,
                hasLiked
            };
        } catch (error) {
            console.error('Failed to fetch post details:', error);
            return null;
        }
    }
}

// Export a singleton instance of the API service
export default new ApiService();