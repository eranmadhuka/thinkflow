import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/posts/PostCard";

const Feed = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const [posts, setPosts] = useState([]); // Initialize as an empty array
  const [followingPosts, setFollowingPosts] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState([]); // Initialize as an empty array
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

        // Fetch saved posts
        const savedPostsResponse = await axios.get(
          "http://localhost:8080/posts/saved",
          {
            withCredentials: true,
          }
        );

        // Get saved posts with like and comment counts
        const savedPostsData = Array.isArray(savedPostsResponse.data)
          ? savedPostsResponse.data
          : [];
        const savedPostsWithCounts = await fetchPostsWithCounts(savedPostsData);
        setSavedPosts(savedPostsWithCounts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const recommendedTopics = [
    { name: "Programming", slug: "programming" },
    { name: "Self Improvement", slug: "self-improvement" },
    { name: "Data Science", slug: "data-science" },
    { name: "Writing", slug: "writing" },
    { name: "Technology", slug: "technology" },
    { name: "Relationships", slug: "relationships" },
    { name: "Politics", slug: "politics" },
  ];

  const whoToFollow = [
    {
      id: 1,
      name: "Michelle Wiles",
      bio: "Breaking down brands and strategy. CEO of Embedded",
      picture: "https://via.placeholder.com/40",
      verified: true,
    },
    {
      id: 2,
      name: "Netflix TechBlog",
      bio: "Publication",
      picture: "https://via.placeholder.com/40",
      description: "Learn about Netflix's world class engineering efforts",
    },
    {
      id: 3,
      name: "John DeVore",
      bio: "My memoir 'Theatre Kids: A True Tale of Off-Off Broadway'",
      picture: "https://via.placeholder.com/40",
      verified: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Feed */}
          <div className="md:w-2/3">
            {/* Navigation Tabs */}
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
            <div className="space-y-1">
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
                <div className="text-gray-600 p-4">
                  <p>You don't follow anyone yet.</p>
                  <p className="mt-2">
                    Follow some authors to see their posts here!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="md:w-1/3">
            {/* Recommended Topics */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold mb-3">Recommended topics</h3>
              <div className="flex flex-wrap gap-2">
                {recommendedTopics.map((topic) => (
                  <Link
                    key={topic.slug}
                    to={`/topics/${topic.slug}`}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                  >
                    {topic.name}
                  </Link>
                ))}
              </div>
              <Link to="/topics" className="text-sm text-gray-500 block mt-3">
                See more topics
              </Link>
            </div>

            {/* Who to Follow */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold mb-3">Who to follow</h3>
              <div className="space-y-4">
                {whoToFollow.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={profile.picture}
                        alt={profile.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{profile.name}</span>
                          {profile.verified && (
                            <span className="ml-1 text-blue-600">✓</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{profile.bio}</p>
                      </div>
                    </div>
                    <button className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
              <Link
                to="/recommendations"
                className="text-sm text-gray-500 block mt-3"
              >
                See more suggestions
              </Link>
            </div>

            {/* Recently Saved */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3">Recently saved</h3>
              {savedPosts.length > 0 ? (
                <div className="space-y-3">
                  {savedPosts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id}
                      to={`/posts/${post.id}`}
                      className="block"
                    >
                      <h4 className="font-medium hover:underline">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No saved posts yet.</p>
              )}
              <Link to="/saved" className="text-sm text-gray-500 block mt-3">
                See all ({savedPosts.length})
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
