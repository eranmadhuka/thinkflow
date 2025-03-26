import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserPlus,
  UserMinus,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";

const ProfileCard = ({ user, loggedInUser, onFollowToggle }) => {
  const [isFollowing, setIsFollowing] = useState(
    loggedInUser?.following?.includes(user.id)
  );
  const navigate = useNavigate();

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    try {
      const endpoint = isFollowing
        ? `http://localhost:8080/user/${loggedInUser.id}/unfollow/${user.id}`
        : `http://localhost:8080/user/${loggedInUser.id}/follow/${user.id}`;
      await axios.post(endpoint, {}, { withCredentials: true });
      setIsFollowing(!isFollowing);
      if (onFollowToggle) onFollowToggle(user.id, !isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    }
  };

  return (
    <div
      className="w-full max-w-md bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-100"
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      {/* Header Section */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <img
          className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 mr-3 transition-transform duration-200 hover:scale-105"
          src={user.picture || "https://via.placeholder.com/150"}
          alt={`${user.name}'s profile`}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {user.name}
            </h3>
          </div>
          <p className="text-xs text-gray-500 truncate">{user.status}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{user.bio}</p>
        )}

        {/* Stats */}
        <div className="flex justify-between text-center mb-4">
          <div>
            <span className="block text-sm font-semibold text-gray-800">
              {user.posts?.length || 0}
            </span>
            <span className="text-xs text-gray-500">Posts</span>
          </div>
          <div>
            <span className="block text-sm font-semibold text-gray-800">
              {user.followers?.length || 0}
            </span>
            <span className="text-xs text-gray-500">Followers</span>
          </div>
          <div>
            <span className="block text-sm font-semibold text-gray-800">
              {user.following?.length || 0}
            </span>
            <span className="text-xs text-gray-500">Following</span>
          </div>
        </div>

        {/* Action Buttons */}
        {loggedInUser && loggedInUser.id !== user.id && (
          <div className="flex gap-2">
            <button
              onClick={handleFollowToggle}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                isFollowing
                  ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? (
                <span className="flex items-center justify-center">
                  <UserMinus size={14} className="mr-1" />
                  Unfollow
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus size={14} className="mr-1" />
                  Follow
                </span>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Implement messaging functionality here
                console.log(`Message ${user.name}`);
              }}
              className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <span className="flex items-center justify-center">
                <MessageCircle size={14} className="mr-1" />
                Message
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
