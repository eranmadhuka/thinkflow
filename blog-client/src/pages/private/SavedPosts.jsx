import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import PostCard from "../../components/posts/PostCard";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSavedPostsDetails = async () => {
      if (!user?.id) return;

      try {
        const savedResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${user.id}/saved-posts`,
          { withCredentials: true }
        );

        if (savedResponse.data && Array.isArray(savedResponse.data)) {
          console.log("Saved posts response:", savedResponse.data);

          if (
            savedResponse.data.every(
              (item) => typeof item === "number" || typeof item === "string"
            )
          ) {
            const postPromises = savedResponse.data.map((postId) =>
              axios.get(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
                withCredentials: true,
              })
            );
            const postResponses = await Promise.all(postPromises);
            const fullPosts = postResponses.map((res) => res.data);
            setSavedPosts(fullPosts);
          } else {
            setSavedPosts(savedResponse.data);
          }
        } else {
          console.warn("Unexpected API response format:", savedResponse.data);
          setSavedPosts([]);
        }
      } catch (error) {
        console.error("Failed to fetch saved posts details:", error);
        setSavedPosts([]);
      }
    };

    fetchSavedPostsDetails();
  }, [user]);

  const handleLikePost = async (postId) => {
    if (!user) {
      alert("Please log in to like posts");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );

      const { likeCount, hasLiked } = response.data || {};

      setSavedPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likeCount:
                  likeCount !== undefined
                    ? likeCount
                    : (post.likeCount || 0) + (post.hasLiked ? -1 : 1),
                hasLiked: hasLiked !== undefined ? hasLiked : !post.hasLiked,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <header>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Saved Posts
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Your collection of favorite posts
          </p>
        </header>
      </div>

      {savedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {savedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={user}
              onLikePost={handleLikePost}
              savedPosts={savedPosts.map((p) => p.id)} // Pass only IDs to align with PostCard expectation
              setSavedPosts={setSavedPosts}
              posts={savedPosts}
              setPosts={setSavedPosts}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-lg sm:text-xl">No saved posts yet</p>
          <p className="text-sm mt-2">Start saving posts to see them here!</p>
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
