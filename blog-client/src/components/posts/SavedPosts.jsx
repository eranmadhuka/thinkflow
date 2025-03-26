import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchSavedPostsDetails = async () => {
      if (!user?.id) return; // Ensure user is defined before calling API

      try {
        const response = await axios.get(
          `http://localhost:8080/user/${user.id}/saved-posts`,
          { withCredentials: true }
        );

        if (response.data && Array.isArray(response.data)) {
          console.log("Saved posts response:", response.data);
          setSavedPosts(response.data);
        } else {
          console.warn("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch saved posts details:", error);
      }
    };

    fetchSavedPostsDetails();
  }, [user]);

  // Function to handle liking a post
  const handleLikePost = async (postId) => {
    if (!user) {
      // Redirect to login or show login modal
      alert("Please log in to like posts");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/posts/${postId}/like`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update posts state to reflect the like
      const updatePostsState = (postsArray) => {
        return postsArray.map((post) => {
          if (post.id === postId) {
            const newLikeCount = post.hasLiked
              ? post.likeCount - 1
              : post.likeCount + 1;
            return {
              ...post,
              likeCount: newLikeCount,
              hasLiked: !post.hasLiked,
            };
          }
          return post;
        });
      };

      setPosts(updatePostsState(posts));
      setFollowingPosts(updatePostsState(followingPosts));
      setSavedPosts(updatePostsState(savedPosts));
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-0">
      <h3 className="text-lg font-bold mb-3">Recently saved</h3>
      {savedPosts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {savedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              savedPosts={savedPosts}
              posts={posts}
              setPosts={setPosts}
              user={user}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">No saved posts yet.</p>
      )}
    </div>
  );
};

export default SavedPosts;
