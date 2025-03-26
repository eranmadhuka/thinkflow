import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import PostCard from "../../components/posts/PostCard";
import Loading from "../../components/ui/Loading";

const Feed = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const [posts, setPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Fetch all posts for "For You" tab
        const allPostsResponse = await axios.get(
          "http://localhost:8080/posts/feed",
          {
            withCredentials: true,
          }
        );

        // Get posts with like and comment counts
        const postsData = Array.isArray(allPostsResponse.data)
          ? allPostsResponse.data
          : [];
        const postsWithCounts = await fetchPostsWithCounts(postsData);
        setPosts(postsWithCounts);

        // Fetch following posts
        const followingPostsResponse = await axios.get(
          "http://localhost:8080/posts/following",
          {
            withCredentials: true,
          }
        );

        // Get following posts with like and comment counts
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

  // Helper function to fetch like and comment counts for posts
  const fetchPostsWithCounts = async (postsArray) => {
    try {
      const postsWithCountsPromises = postsArray.map(async (post) => {
        // Fetch like count
        const likesResponse = await axios.get(
          `http://localhost:8080/posts/${post.id}/like-count`,
          {
            withCredentials: true,
          }
        );

        // Fetch comment count
        const commentsResponse = await axios.get(
          `http://localhost:8080/posts/${post.id}/comments`,
          {
            withCredentials: true,
          }
        );

        // Check if user has liked the post
        let hasLiked = false;
        if (user) {
          const userLikeResponse = await axios.get(
            `http://localhost:8080/posts/${post.id}/has-liked`,
            {
              withCredentials: true,
            }
          );
          hasLiked = userLikeResponse.data;
        }

        // Return post with additional data
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
      return postsArray; // Return original posts if there's an error
    }
  };

  // Function to handle liking a post
  const handleLikePost = async (postId) => {
    if (!user) {
      // Redirect to login or show login modal
      alert("Please log in to like posts");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/posts/${postId}/like`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update posts state to reflect the like
      const updatePostsState = (postsArray) => {
        return postsArray.map((post) => {
          if (post.id === postId) {
            const newLikeCount = post.hasLiked
              ? post.likeCount - 1
              : post.likeCount + 1;
            return {
              ...post,
              likeCount: newLikeCount,
              hasLiked: !post.hasLiked,
            };
          }
          return post;
        });
      };

      setPosts(updatePostsState(posts));
      setFollowingPosts(updatePostsState(followingPosts));
      setSavedPosts(updatePostsState(savedPosts));
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
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

          {/* Post Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeTab === "for-you" ? (
              posts.length > 0 ? (
                posts.map((post) => (
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
    </div>
  );
};

export default Feed;
