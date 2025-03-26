import React, { useState } from "react";
import axios from "axios";

export const FollowButton = ({ user }) => {
  const [isFollowed, setIsFollowed] = useState(user?.isFollowed || false);

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/users/${user.id}/follow`,
        {},
        { withCredentials: true }
      );
      setIsFollowed(response.data.isFollowed);
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);
    }
  };

  return (
    <button
      onClick={handleFollow}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isFollowed
          ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      {isFollowed ? "Following" : "Follow"}
    </button>
  );
};
