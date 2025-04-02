import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserPlus,
  UserMinus,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import UserImg from "../../assets/images/user.png";

const ProfileCard = ({ user, loggedInUser, onFollowToggle }) => {
  const [isFollowing, setIsFollowing] = useState(
    loggedInUser?.following?.includes(user.id)
  );
  const navigate = useNavigate();

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    try {
      const endpoint = isFollowing
        ? `${import.meta.env.VITE_API_URL}/user/${loggedInUser.id}/unfollow/${
            user.id
          }`
        : `${import.meta.env.VITE_API_URL}/user/${loggedInUser.id}/follow/${
            user.id
          }`;
      await axios.post(endpoint, {}, { withCredentials: true });
      setIsFollowing(!isFollowing);
      if (onFollowToggle) onFollowToggle(user.id, !isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    }
  };

  return (
    <div
      className="w-full bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      {/* Header Section */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <img
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-gray-200 mr-3 transition-transform duration-200 hover:scale-105"
          src={user.picture ? user.picture : UserImg}
          alt={`${user.name}'s profile`}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
            {user.name}
          </h3>
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
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleFollowToggle}
              className={`w-full py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                isFollowing
                  ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                {isFollowing ? (
                  <>
                    <UserMinus size={14} />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    Follow
                  </>
                )}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Message ${user.name}`);
              }}
              className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <span className="flex items-center justify-center gap-1">
                <MessageCircle size={14} />
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
