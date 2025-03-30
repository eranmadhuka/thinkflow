import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import PostCard from "../../components/posts/PostCard";
import Loading from "../../components/ui/Loading";

const Feed = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const [posts, setPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Fetch all posts for "For You" tab
        const allPostsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/feed`,
          { withCredentials: true }
        );
        const postsData = Array.isArray(allPostsResponse.data)
          ? allPostsResponse.data
          : [];
        const postsWithCounts = await fetchPostsWithCounts(postsData);
        setPosts(postsWithCounts);

        // Fetch following posts
        const followingPostsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/following`,
          { withCredentials: true }
        );
        const followingPostsData = Array.isArray(followingPostsResponse.data)
          ? followingPostsResponse.data
          : [];
        const followingPostsWithCounts = await fetchPostsWithCounts(
          followingPostsData
        );
        setFollowingPosts(followingPostsWithCounts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchSavedPostsDetails = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${user.id}/saved-posts`,
          { withCredentials: true }
        );

        if (response.data && Array.isArray(response.data)) {
          // Assuming API returns full post objects, extract IDs
          const savedPostIds = response.data.map((post) =>
            typeof post === "object" ? post.id : post
          );
          setSavedPosts(savedPostIds);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setSavedPosts([]);
        }
      } catch (error) {
        console.error("Failed to fetch saved posts details:", error);
        setSavedPosts([]);
      }
    };

    fetchSavedPostsDetails();
  }, [user]);

  // Helper function to fetch like and comment counts for posts
  const fetchPostsWithCounts = async (postsArray) => {
    try {
      const postsWithCountsPromises = postsArray.map(async (post) => {
        const likesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/${post.id}/like-count`,
          { withCredentials: true }
        );
        const commentsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/${post.id}/comments`,
          { withCredentials: true }
        );
        let hasLiked = false;
        if (user) {
          const userLikeResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/posts/${post.id}/has-liked`,
            { withCredentials: true }
          );
          hasLiked = userLikeResponse.data;
        }

        return {
          ...post,
          likeCount: likesResponse.data,
          commentCount: Array.isArray(commentsResponse.data)
            ? commentsResponse.data.length
            : 0,
          hasLiked: hasLiked,
        };
      });

      return await Promise.all(postsWithCountsPromises);
    } catch (error) {
      console.error("Error fetching post counts:", error);
      return postsArray;
    }
  };

  // Function to handle liking a post
  const handleLikePost = async (postId) => {
    if (!user) {
      alert("Please log in to like posts");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );

      const updatePostsState = (postsArray) =>
        postsArray.map((post) =>
          post.id === postId
            ? {
                ...post,
                likeCount: post.hasLiked
                  ? post.likeCount - 1
                  : post.likeCount + 1,
                hasLiked: !post.hasLiked,
              }
            : post
        );

      setPosts(updatePostsState(posts));
      setFollowingPosts(updatePostsState(followingPosts));
      setSavedPosts((prevSavedPosts) =>
        prevSavedPosts.map((savedPost) =>
          savedPost.id === postId
            ? {
                ...savedPost,
                likeCount: savedPost.hasLiked
                  ? savedPost.likeCount - 1
                  : savedPost.likeCount + 1,
                hasLiked: !savedPost.hasLiked,
              }
            : savedPost
        )
      );
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <header className="mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Your Feed
        </h2>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Catch up with the latest posts from your network
        </p>
      </header>

      <div className="space-y-6">
        <div className="border-b flex mb-4">
          <button
            className={`px-4 py-2 mr-4 font-medium ${
              activeTab === "for-you"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("for-you")}
          >
            For you
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "following"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeTab === "for-you" ? (
            posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  savedPosts={savedPosts} // Array of IDs
                  setSavedPosts={setSavedPosts}
                  posts={posts}
                  setPosts={setPosts}
                  followingPosts={followingPosts}
                  setFollowingPosts={setFollowingPosts}
                  handleLikePost={handleLikePost}
                  user={user}
                />
              ))
            ) : (
              <p className="text-gray-600 p-4">
                No posts available in your feed.
              </p>
            )
          ) : followingPosts.length > 0 ? (
            followingPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                savedPosts={savedPosts}
                setSavedPosts={setSavedPosts}
                posts={posts}
                setPosts={setPosts}
                followingPosts={followingPosts}
                setFollowingPosts={setFollowingPosts}
                handleLikePost={handleLikePost}
                user={user}
              />
            ))
          ) : (
            <div className="text-gray-600 p-4 col-span-1 lg:col-span-2">
              <p>You don't follow anyone yet.</p>
              <p className="mt-2">
                Follow some authors to see their posts here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
