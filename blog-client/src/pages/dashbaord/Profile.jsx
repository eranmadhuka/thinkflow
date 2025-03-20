import axios from "axios";
import { useEffect, useState } from "react";
import AddBlogPost from "../../components/posts/AddBlogPost";
import { Link } from "react-router-dom";
import { FaRegImage } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null); // User whose profile is being viewed
  const [loggedInUser, setLoggedInUser] = useState(null); // Logged-in user
  const [posts, setPosts] = useState([]); // State to store user's posts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Fetch logged-in user's info
        const loggedInUserResponse = await axios.get(
          "http://localhost:8080/user/profile",
          {
            withCredentials: true, // Include cookies in the request
          }
        );
        setLoggedInUser(loggedInUserResponse.data);

        // Fetch profile user's info (e.g., from URL params or other logic)
        const profileUserId = window.location.pathname.split("/").pop(); // Extract user ID from URL
        const userResponse = await axios.get(
          `http://localhost:8080/user/profile/${profileUserId}`,
          {
            withCredentials: true,
          }
        );
        setUser(userResponse.data);

        // Fetch profile user's posts
        const postsResponse = await axios.get(
          `http://localhost:8080/posts/user/${profileUserId}`,
          { withCredentials: true }
        );
        setPosts(postsResponse.data); // Set the user's posts
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      // Send a POST request to the backend logout endpoint
      await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );

      // Redirect to the login page after successful logout
      window.location.href = "http://localhost:5173/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = loggedInUser && user && loggedInUser.id === user.id;

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* User Profile Section */}
        {user && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-6">
              <img
                src={user.picture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.id}</p>
                <p className="text-gray-600 mt-2">
                  {user.bio || "No bio available."}
                </p>
              </div>
              {/* Show AddBlogPost only if it's the logged-in user's profile */}
              {isOwnProfile && (
                <Link
                  to="/posts/add"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center"
                >
                  <FaRegImage className="mr-2" size={16} />
                  Create Post
                </Link>
              )}
            </div>
            {/* Show Edit Profile and Logout buttons only if it's the logged-in user's profile */}
            {isOwnProfile && (
              <div className="mt-4 space-x-4">
                <Link
                  to="/update-profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Update Profile
                </Link>
                <button
                  onClick={() => {
                    // Add logic to navigate to the edit profile page
                    console.log("Edit profile clicked");
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* User's Blog Posts Section */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-gray-700 mt-2">{post.content}</p>
                <p className="text-sm text-gray-500 mt-4">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-600">No posts available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
