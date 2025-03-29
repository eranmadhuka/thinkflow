import React, { useEffect, useState } from "react";
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
import axios from "axios";
import UserImg from "../../assets/images/user.png";

const Sidebar = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [imageLoading, setImageLoading] = useState(true); // New state for image loading

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

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-50 text-blue-600 font-semibold"
      : "text-gray-700 hover:bg-gray-100";

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile`,
          { withCredentials: true }
        );
        setUser(userResponse.data);

        const postsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/user/${userResponse.data.id}`,
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

  // Handle image loading state
  const handleImageLoad = () => {
    setImageLoading(false);
  };

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
    <aside className="flex flex-col w-64 h-full bg-white border border-gray-100 shadow-lg overflow-y-auto">
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-100 text-center">
        <div className="relative mb-3">
          <div className="h-16 rounded-t-lg bg-gradient-to-r from-blue-100 to-purple-100"></div>
          <div
            className="absolute w-full flex justify-center"
            style={{ top: "50%" }}
          >
            <div className="w-20 h-20 rounded-full border-3 border-white overflow-hidden flex items-center justify-center">
              {imageLoading && (
                <div className="animate-pulse h-full w-full bg-gray-200 rounded-full"></div>
              )}
              <img
                src={user.picture ? user.picture : UserImg}
                alt="User Avatar"
                className={`h-full w-full sm:h-full sm:w-full rounded-full object-cover border border-gray-200 ${
                  imageLoading ? "hidden" : "block"
                }`}
                onLoad={handleImageLoad}
                onError={() => setImageLoading(false)}
              />
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="font-bold text-lg">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs mt-2 text-gray-500 italic">{user.bio}</p>
        </div>
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
