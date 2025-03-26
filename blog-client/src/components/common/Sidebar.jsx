import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Newspaper,
  Calendar,
  Group,
  Bell,
  Settings,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Sidebar = () => {
  // const { user } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const statusOptions = [
    { value: "Single", emoji: "💘", description: "Looking for love" },
    {
      value: "In a Relationship",
      emoji: "💑",
      description: "Happily committed",
    },
    { value: "Married", emoji: "💍", description: "Tied the knot" },
    { value: "Complicated", emoji: "🤯", description: "It's complicated" },
    { value: "Prefer Not to Say", emoji: "🤐", description: "Private matters" },
  ];

  // Function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path
      ? "bg-blue-50 text-blue-600 font-semibold"
      : "text-gray-700 hover:bg-gray-100";
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Get the current user's profile
        const userResponse = await axios.get(
          "http://localhost:8080/user/profile",
          { withCredentials: true }
        );
        setUser(userResponse.data);

        // Get the current user's posts
        const postsResponse = await axios.get(
          `http://localhost:8080/posts/user/${userResponse.data.id}`,
          { withCredentials: true }
        );
        setPosts(postsResponse.data);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) {
    return (
      <aside className="flex flex-col w-64 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 text-center">
          <div className="animate-pulse h-16 rounded-t-lg bg-gray-200 mb-3"></div>
          <div className="animate-pulse h-16 w-16 rounded-full bg-gray-200 mx-auto -mt-8 mb-4"></div>
          <div className="animate-pulse h-4 w-3/4 bg-gray-200 mx-auto mb-2"></div>
          <div className="animate-pulse h-3 w-1/2 bg-gray-200 mx-auto mb-4"></div>
          <div className="flex justify-between">
            <div className="animate-pulse h-4 w-8 bg-gray-200 mx-auto"></div>
            <div className="animate-pulse h-4 w-8 bg-gray-200 mx-auto"></div>
            <div className="animate-pulse h-4 w-8 bg-gray-200 mx-auto"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col w-64 bg-white rounded-lg border border-gray-100 shadow-sm overflow-y-auto">
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-100 text-center">
        {/* Profile Image with mountain background */}
        <div className="relative mb-3">
          <div className="h-16 rounded-t-lg bg-gradient-to-r from-blue-100 to-purple-100"></div>
          <div
            className="absolute w-full flex justify-center"
            style={{ top: "50%" }}
          >
            <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-orange-400 flex items-center justify-center">
              <img
                src={user.picture || "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile details with spacing for the avatar */}
        <div className="mt-10">
          <h2 className="font-bold text-lg">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs mt-2 text-gray-500 italic">{user.bio}</p>
          {/* <span className="text-xl mr-2">
            {statusOptions.find((option) => option.value === user.status)
              ?.emoji || "❓"}
          </span>
          <span>
            {
              statusOptions.find((option) => option.value === user.status)
                ?.description
            }
          </span> */}
        </div>

        {/* Stats */}
        <div className="flex justify-between mt-4 text-sm">
          <div>
            <p className="font-bold">{posts.length}</p>
            <p className="text-gray-600 text-xs">Posts</p>
          </div>
          <div>
            <p className="font-bold">{user.followers?.length || 0}</p>
            <p className="text-gray-600 text-xs">Followers</p>
          </div>
          <div>
            <p className="font-bold">{user.following?.length || 0}</p>
            <p className="text-gray-600 text-xs">Following</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <li>
            <Link
              to="/feed"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/feed"
              )}`}
            >
              <Home size={20} />
              <span>Feed</span>
            </Link>
          </li>
          <li>
            <Link
              to="/friends"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/friends"
              )}`}
            >
              <Users size={20} />
              <span>Friends</span>
            </Link>
          </li>
          <li>
            <Link
              to="/peoples"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/peoples"
              )}`}
            >
              <Users size={20} />
              <span>Peoples</span>
            </Link>
          </li>
          <li>
            <Link
              to="/saved-posts"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/saved-posts"
              )}`}
            >
              <Group size={20} />
              <span>Saved</span>
            </Link>
          </li>
          <li>
            <Link
              to="/notifications"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/notifications"
              )}`}
            >
              <Bell size={20} />
              <span>Notifications</span>
            </Link>
          </li>
          <li>
            <Link
              to="/update-profile"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(
                "/update-profile"
              )}`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* View Profile Button */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to={`/profile/${user.id}`}
          className="block text-center text-blue-500 hover:text-blue-600 transition-colors text-sm"
        >
          View Profile
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
