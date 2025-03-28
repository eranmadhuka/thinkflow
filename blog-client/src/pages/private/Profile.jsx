import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Camera,
  Edit2,
  LogOut,
  UserPlus,
  UserMinus,
  UserCog,
  MessageCircle,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import PostCard from "../../components/posts/PostCard";
import Swal from "sweetalert2";
import UserImg from "../../assets/images/user.png";

const ProfilePage = () => {
  const { id } = useParams();
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [followersDetails, setFollowersDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

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
        `${import.meta.env.VITE_API_URL}/user/${
          loggedInUser.id
        }/follow/${followeeId}`,
        {},
        { withCredentials: true }
      );
      setLoggedInUser((prevUser) => ({
        ...prevUser,
        following: [...(prevUser.following || []), followeeId],
      }));
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const unfollowUser = async (followeeId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/${
          loggedInUser.id
        }/unfollow/${followeeId}`,
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
    logout();
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Are you sure? 😢",
      html: "This will permanently delete your account and all your data. <br><strong>Please think again!</strong> This can’t be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Red for delete
      cancelButtonColor: "#4f46e5", // Indigo-600 to match your theme
      confirmButtonText: "Yes, delete it anyway 😔",
      cancelButtonText: "No, I’ll stay! 🥹",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/user/${loggedInUser.id}`,
          {
            withCredentials: true,
          }
        );
        Swal.fire({
          title: "Goodbye! 😢",
          text: "Your account has been deleted. We’re sad to see you go!",
          icon: "success",
          timer: 2500, // Slightly longer to let the message sink in
          showConfirmButton: false,
        }).then(() => {
          navigate("/login");
        });
      } catch (error) {
        console.error("Failed to delete account:", error);
        Swal.fire({
          title: "Oops! 😓",
          text: "Failed to delete your account. Please try again.",
          icon: "error",
          confirmButtonColor: "#4f46e5", // Match your indigo-600 theme
        });
      }
    }
  };

  const handleCantDeleteAccount = () => {
    Swal.fire({
      title: "Nice try! 😆",
      html: `You thought you could just leave? <br><strong>Sorry, but you're stuck with us forever! 🔒</strong> <br>
             Our servers cried when you clicked that button. 😢`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#4f46e5",
      confirmButtonColor: "#d33",
      confirmButtonText: "Wait... I can’t leave? 😨",
      cancelButtonText: "Fine, I’ll stay! 🙄",
    });
  };

  // const handleCantDeleteAccount = () => {
  //   Swal.fire({
  //     title: "Whoa there, partner! 😲",
  //     html: `You really wanna delete your account? <br><strong>Think about all the good times we've had! 🎉</strong><br>
  //            This action is as permanent as a tattoo... but without the cool factor. 🤦‍♂️`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     cancelButtonColor: "#4f46e5",
  //     confirmButtonText: "Oops! Delete button is missing... 🫢",
  //     cancelButtonText: "Nah, I’ll stay! 😎",
  //   });
  // };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const loggedInUserResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile`,
          { withCredentials: true }
        );
        setLoggedInUser(loggedInUserResponse.data);

        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile/${id}`,
          { withCredentials: true }
        );
        setUser(userResponse.data);

        const postsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/user/${id}`,
          { withCredentials: true }
        );
        setPosts(postsResponse.data);

        if (userResponse.data.followers?.length > 0) {
          const followersResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/details`,
            userResponse.data.followers,
            { withCredentials: true }
          );
          setFollowersDetails(followersResponse.data);
        } else {
          setFollowersDetails([]);
        }

        if (userResponse.data.following?.length > 0) {
          const followingResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/details`,
            userResponse.data.following,
            { withCredentials: true }
          );
          setFollowingDetails(followingResponse.data);
        } else {
          setFollowingDetails([]);
        }

        // Fetch saved posts (assuming full objects for consistency)
        const savedPostsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${
            loggedInUserResponse.data.id
          }/saved-posts`,
          { withCredentials: true }
        );
        setSavedPosts(savedPostsResponse.data.map((post) => post.id));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <header>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {isOwnProfile ? "Your Profile" : `${user?.name}'s Profile`}
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            {isOwnProfile
              ? "Manage your personal details"
              : "View their activity"}
          </p>
        </header>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 py-6">
          <div className="flex flex-col items-center -mt-16 sm:-mt-20">
            <img
              src={user.picture ? user.picture : UserImg}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-sm transition-transform duration-300 hover:scale-105"
            />
            <h2 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-600">{user?.email}</p>

            <div className="mt-3 text-center">
              <label className="block text-xs text-gray-500 mb-1">Status</label>

              <span className="text-lg mr-2">
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
          </div>

          {/* Stats */}
          <div className="mt-6 flex justify-center space-x-6 text-center">
            <div>
              <p className="text-lg font-bold text-blue-600">{posts.length}</p>
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

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            {!isOwnProfile ? (
              <>
                <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-1.5">
                  <MessageCircle size={16} />
                  Message
                </button>
                <button
                  onClick={() =>
                    isFollowing ? unfollowUser(user.id) : followUser(user.id)
                  }
                  className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 flex items-center justify-center gap-1.5 ${
                    isFollowing
                      ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isFollowing ? (
                    <UserMinus size={16} />
                  ) : (
                    <UserPlus size={16} />
                  )}
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/posts/add"
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                  <Edit2 size={16} />
                  New Post
                </Link>
                <Link
                  to="/update-profile"
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                  <UserCog size={16} />
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                  <LogOut size={16} />
                  Logout
                </button>
                <button
                  // onClick={handleDeleteAccount}
                  onClick={handleCantDeleteAccount}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="mt-6 bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {["Posts", "Followers", "Following"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.toLowerCase()
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 p-4">
          {activeTab === "posts" &&
            (posts.length > 0 ? (
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
                <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-sm sm:text-base">No posts yet</p>
                {isOwnProfile && (
                  <Link
                    to="/posts/add"
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 gap-1.5"
                  >
                    <ImageIcon size={16} />
                    Create First Post
                  </Link>
                )}
              </div>
            ))}

          {activeTab === "followers" && (
            <div className="space-y-4">
              {followersDetails.length > 0 ? (
                followersDetails.map((follower) => (
                  <Link key={follower.id} to={`/profile/${follower.id}`}>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                      <img
                        src={follower.picture ? follower.picture : UserImg}
                        alt={follower.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {follower.name}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {follower.email}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm sm:text-base">
                  No followers yet
                </p>
              )}
            </div>
          )}

          {activeTab === "following" && (
            <div className="space-y-4">
              {followingDetails.length > 0 ? (
                followingDetails.map((following) => (
                  <Link key={following.id} to={`/profile/${following.id}`}>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                      <img
                        src={following.picture ? following.picture : UserImg}
                        alt={following.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {following.name}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {following.email}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm sm:text-base">
                  Not following anyone yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
