import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Edit,
  Trash2,
  UserMinus,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

const PostCard = ({ post, posts, setPosts, savedPosts, setSavedPosts }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isSavedState, setIsSavedState] = useState(false);

  const formatDate = (dateString) => {
    try {
      const date =
        typeof dateString === "string"
          ? parseISO(dateString)
          : new Date(dateString);
      return isNaN(date.getTime())
        ? "Unknown date"
        : formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Unknown date";
    }
  };

  // Check if the post is saved
  const isSaved = savedPosts?.includes(post.id);
  // Check if the post belongs to the current user
  const isOwnPost = user && post.user?.id === user.id;

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const likesResponse = await axios.get(
          `http://localhost:8080/posts/${post.id}/like-count`,
          { withCredentials: true }
        );
        setLikes(likesResponse.data);

        if (user) {
          const userLikeResponse = await axios.get(
            `http://localhost:8080/posts/${post.id}/has-liked`,
            { withCredentials: true }
          );
          setHasLiked(userLikeResponse.data);
        }

        const commentsResponse = await axios.get(
          `http://localhost:8080/posts/${post.id}/comments`,
          { withCredentials: true }
        );
        setCommentCount(commentsResponse.data.length);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [post.id, user]);

  // Fetch saved posts when the component mounts
  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        if (user) {
          const response = await axios.get(
            `http://localhost:8080/user/${user.id}/saved-posts`,
            { withCredentials: true }
          );
          setSavedPosts(response.data.map((p) => p.id));
        }
      } catch (error) {
        console.error("Failed to fetch saved posts:", error);
      }
    };

    fetchSavedPosts();
  }, [user, setSavedPosts]);

  const handleLike = async () => {
    if (!user) return alert("You must be logged in to like posts.");

    try {
      await axios.post(
        `http://localhost:8080/posts/${post.id}/like`,
        {},
        { withCredentials: true }
      );
      setHasLiked(!hasLiked);
      setLikes(hasLiked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  useEffect(() => {
    setIsSavedState(savedPosts?.includes(post.id));
  }, [savedPosts, post.id]); // Sync when `savedPosts` changes

  const toggleSavePost = async (postId) => {
    if (!user) return alert("You must be logged in to save posts.");

    try {
      if (isSavedState) {
        await axios.post(
          `http://localhost:8080/user/${user.id}/unsave/${postId}`,
          {},
          { withCredentials: true }
        );
        setSavedPosts((prev) => prev.filter((id) => id !== postId));
      } else {
        await axios.post(
          `http://localhost:8080/user/${user.id}/save/${postId}`,
          {},
          { withCredentials: true }
        );
        setSavedPosts((prev) => [...prev, postId]);
      }
    } catch (error) {
      console.error("Failed to save/unsave post:", error);
    }
  };
  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:8080/posts/${post.id}`, {
        withCredentials: true,
      });
      // Remove the post from the list
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleUnfollowUser = async () => {
    try {
      await axios.post(
        `http://localhost:8080/user/${user.id}/unfollow/${post.user.id}`,
        {},
        { withCredentials: true }
      );
      alert(`Unfollowed ${post.user.name}`);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      alert("Failed to unfollow user. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden mb-4 relative">
      {/* Post Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.user?.id}`}>
              <img
                src={post.user?.picture || "https://via.placeholder.com/40"}
                alt={post.user?.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
            <div>
              <Link
                to={`/profile/${post.user?.id}`}
                className="font-semibold text-gray-800 hover:underline"
              >
                {post.user?.name || "Unknown User"}
              </Link>
              <p className="text-xs text-gray-500">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <MoreHorizontal size={20} />
            </button>

            {isOptionsOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {isOwnPost ? (
                    // Options for own posts
                    <>
                      <Link
                        to={`/posts/${post.id}/edit`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        <Edit size={16} className="mr-2" /> Edit Post
                      </Link>
                      <button
                        onClick={handleDeletePost}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <Trash2 size={16} className="mr-2" /> Delete Post
                      </button>
                    </>
                  ) : (
                    // Options for other users' posts
                    <>
                      <button
                        onClick={() => toggleSavePost(post.id)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <Bookmark size={16} className="mr-2" />
                        {isSaved ? "Unsave Post" : "Save Post"}
                      </button>
                      <button
                        onClick={handleUnfollowUser}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <UserMinus size={16} className="mr-2" /> Unfollow User
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Link to={`/posts/${post.id}`} className="block p-4 pt-3">
        <h2 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-600 text-sm">
          {post.content.substring(0, 150)}...
        </p>
      </Link>

      {post.mediaUrls?.length > 0 && (
        <Link to={`/posts/${post.id}`} className="block px-4 pb-4">
          <img
            src={post.mediaUrls[0]}
            alt="Post media"
            className="w-full h-52 object-cover rounded-lg"
          />
        </Link>
      )}

      {/* Post Action */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              hasLiked
                ? "text-blue-500 hover:text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ThumbsUp size={20} className={hasLiked ? "fill-current" : ""} />
            <span className="text-sm">Like</span>
            <span className="text-sm">({likes})</span>
          </button>

          <Link
            to={`/posts/${post.id}`}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
          >
            <MessageCircle size={20} />
            <span className="text-sm">Comment</span>
            <span className="text-sm">({commentCount})</span>
          </Link>
        </div>
        {/* <div className="flex items-center space-x-4">
          <button
            onClick={() => toggleSavePost(post.id)}
            className={`flex items-center space-x-1 ${
              isSaved
                ? "text-blue-500 hover:text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PostCard;
