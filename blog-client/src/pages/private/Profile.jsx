import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom"; // Added useParams
import {
  Camera,
  Edit2,
  LogOut,
  UserPlus,
  UserMinus,
  UserCog,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
} from "lucide-react";
import PostCard from "../../components/posts/PostCard";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [followersDetails, setFollowersDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

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

  const isFollowing = loggedInUser?.following?.includes(user?.id);
  const isOwnProfile = loggedInUser && user && loggedInUser.id === user.id;

  const followUser = async (followeeId) => {
    try {
      await axios.post(
        `http://localhost:8080/user/${loggedInUser.id}/follow/${followeeId}`,
        {},
        { withCredentials: true }
      );
      setLoggedInUser((prevUser) => ({
        ...prevUser,
        following: [...prevUser.following, followeeId],
      }));
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const unfollowUser = async (followeeId) => {
    try {
      await axios.post(
        `http://localhost:8080/user/${loggedInUser.id}/unfollow/${followeeId}`,
        {},
        { withCredentials: true }
      );
      setLoggedInUser((prevUser) => ({
        ...prevUser,
        following: prevUser.following.filter((id) => id !== followeeId),
      }));
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );
      window.location.href = "http://localhost:5173/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true); // Reset loading state on each fetch
        const loggedInUserResponse = await axios.get(
          "http://localhost:8080/user/profile",
          { withCredentials: true }
        );
        setLoggedInUser(loggedInUserResponse.data);

        // Use the id from useParams instead of parsing the URL
        const userResponse = await axios.get(
          `http://localhost:8080/user/profile/${id}`,
          { withCredentials: true }
        );
        setUser(userResponse.data);

        const postsResponse = await axios.get(
          `http://localhost:8080/posts/user/${id}`,
          { withCredentials: true }
        );
        setPosts(postsResponse.data);

        if (userResponse.data.followers.length > 0) {
          const followersResponse = await axios.post(
            "http://localhost:8080/user/details",
            userResponse.data.followers,
            { withCredentials: true }
          );
          setFollowersDetails(followersResponse.data);
        } else {
          setFollowersDetails([]);
        }

        if (userResponse.data.following.length > 0) {
          const followingResponse = await axios.post(
            "http://localhost:8080/user/details",
            userResponse.data.following,
            { withCredentials: true }
          );
          setFollowingDetails(followingResponse.data);
        } else {
          setFollowingDetails([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [id]); // Add id as a dependency so useEffect runs when the profile ID changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="container mx-auto px-4 py-4 max-w-5xl relative">
        <div className="bg-white/60 backdrop-blur-lg shadow-lg rounded-2xl overflow-hidden border border-white/20">
          <div className="relative h-44 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="relative group">
                <img
                  src={user.picture || "https://via.placeholder.com/200"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm">{user.email}</p>

            {user.status && (
              <div className="flex items-center justify-center mt-2 text-sm text-gray-700">
                <span className="text-xl mr-2">
                  {statusOptions.find((option) => option.value === user.status)
                    ?.emoji || "❓"}
                </span>
                <span>
                  {
                    statusOptions.find((option) => option.value === user.status)
                      ?.description
                  }
                </span>
              </div>
            )}

            <div className="mt-5 flex justify-center space-x-3">
              {!isOwnProfile ? (
                <>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center">
                    <MessageCircle className="mr-1" size={16} /> Message
                  </button>
                  <button
                    onClick={() =>
                      isFollowing ? unfollowUser(user.id) : followUser(user.id)
                    }
                    className={`px-4 py-2 rounded-lg flex items-center transition ${
                      isFollowing
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {isFollowing ? (
                      <UserMinus className="mr-1" size={16} />
                    ) : (
                      <UserPlus className="mr-1" size={16} />
                    )}
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </>
              ) : (
                <div className="flex space-x-3">
                  <Link
                    to="/posts/add"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
                  >
                    <Edit2 className="mr-1" size={16} /> New Post
                  </Link>
                  <Link
                    to="/update-profile"
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center"
                  >
                    <UserCog className="mr-1" size={16} /> Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
                  >
                    <LogOut className="mr-1" size={16} /> Logout
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center space-x-6 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {posts.length}
                </p>
                <p className="text-gray-600 text-xs">Posts</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {user.followers?.length || 0}
                </p>
                <p className="text-gray-600 text-xs">Followers</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {user.following?.length || 0}
                </p>
                <p className="text-gray-600 text-xs">Following</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/60 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            {["Posts", "Followers", "Following"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 py-4 font-semibold transition-all duration-300 ${
                  activeTab === tab.toLowerCase()
                    ? "text-blue-600 border-b-4 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "posts" && (
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      posts={posts}
                      setPosts={setPosts}
                      savedPosts={savedPosts}
                      setSavedPosts={setSavedPosts}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <ImageIcon
                      size={48}
                      className="mx-auto mb-4 text-gray-400"
                    />
                    <p>No posts yet</p>
                    {isOwnProfile && (
                      <Link
                        to="/posts/add"
                        className="mt-4 inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                      >
                        <ImageIcon className="mr-2" size={18} />
                        Create First Post
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "followers" && (
              <div className="space-y-4">
                {followersDetails.length > 0 ? (
                  followersDetails.map((follower) => (
                    <Link key={follower.id} to={`/profile/${follower.id}`}>
                      <div className="flex items-center bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition">
                        <img
                          src={
                            follower.picture || "https://via.placeholder.com/40"
                          }
                          alt={follower.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-semibold">{follower.name}</h4>
                          <p className="text-gray-500 text-sm">
                            {follower.email}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No followers yet</p>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="space-y-4">
                {followingDetails.length > 0 ? (
                  followingDetails.map((following) => (
                    <Link key={following.id} to={`/profile/${following.id}`}>
                      <div className="flex items-center bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition">
                        <img
                          src={
                            following.picture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={following.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-semibold">{following.name}</h4>
                          <p className="text-gray-500 text-sm">
                            {following.email}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    Not following anyone yet
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
