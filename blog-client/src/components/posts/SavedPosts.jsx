import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const { user } = useContext(AuthContext);

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

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-bold mb-3">Recently saved</h3>
      {savedPosts.length > 0 ? (
        <div className="space-y-3">
          {savedPosts.map((post) => {
            console.log("Post object:", post);
            console.log("CreatedAt field:", post.createdAt);

            const createdAt = post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : "Date not available";

            return (
              <Link key={post.id} to={`/posts/${post.id}`} className="block">
                <h4 className="font-medium hover:underline">{post.title}</h4>
                <p className="text-xs text-gray-500">{createdAt}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">No saved posts yet.</p>
      )}
      <Link to="/saved" className="text-sm text-gray-500 block mt-3">
        See all ({savedPosts.length})
      </Link>
    </div>
  );
};

export default SavedPosts;
