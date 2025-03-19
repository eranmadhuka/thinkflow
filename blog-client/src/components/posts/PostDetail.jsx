import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/posts/${postId}`,
          {
            withCredentials: true,
          }
        );
        setPost(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error("Failed to fetch post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleLike = async () => {
    if (!post) return;

    try {
      await axios.post(
        `http://localhost:8080/posts/${post.id}/like`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update the post in the state
      setPost({
        ...post,
        likes: post.isLikedByCurrentUser
          ? (post.likes || []).filter((like) => like.userId !== "currentUserId")
          : [...(post.likes || []), { userId: "currentUserId" }],
        isLikedByCurrentUser: !post.isLikedByCurrentUser,
      });
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleFollow = async () => {
    if (!post?.user?.id) return;

    try {
      await axios.post(
        `http://localhost:8080/users/${post.user.id}/follow`,
        {},
        {
          withCredentials: true,
        }
      );

      setPost({
        ...post,
        user: {
          ...post.user,
          isFollowed: !post.user.isFollowed,
        },
      });
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !post) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/posts/${post.id}/comment`,
        {
          content: commentText,
        },
        {
          withCredentials: true,
        }
      );

      setComments([...comments, response.data]);
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Post not found or error loading content.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold truncate">{post.title}</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* User info and actions */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to={`/profile/${post.user?.id}`}>
                  <img
                    src={post.user?.picture || "https://via.placeholder.com/48"}
                    alt={post.user?.name || "User"}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                </Link>
                <div>
                  <Link
                    to={`/profile/${post.user?.id}`}
                    className="font-medium text-lg text-gray-900 hover:underline"
                  >
                    {post.user?.name || "Unknown User"}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()} at{" "}
                    {new Date(post.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  post.user?.isFollowed
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {post.user?.isFollowed ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          {/* Post content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
            <div className="prose max-w-none text-gray-800">
              <p className="text-lg leading-relaxed">{post.content}</p>
            </div>

            {/* Post image (if available) */}
            {post.image && (
              <div className="mt-6 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Post actions */}
            <div className="mt-8 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                      post.isLikedByCurrentUser
                        ? "text-red-500"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {post.isLikedByCurrentUser ? (
                      <FaHeart size={20} />
                    ) : (
                      <FaRegHeart size={20} />
                    )}
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>

                  <button
                    className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                    onClick={() =>
                      document.getElementById("comment-input").focus()
                    }
                  >
                    <FaRegComment size={20} />
                    <span>{comments.length || 0} Comments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-gray-50 p-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>

            {/* Comment input */}
            <div className="flex items-start space-x-3 mb-6">
              <img
                src="https://via.placeholder.com/40"
                alt="Your profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 relative">
                <textarea
                  id="comment-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full border border-gray-200 rounded-lg py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className={`absolute right-3 bottom-3 p-2 rounded-full ${
                    commentText.trim()
                      ? "text-blue-500 hover:bg-blue-50"
                      : "text-gray-300"
                  }`}
                >
                  <FaPaperPlane size={16} />
                </button>
              </div>
            </div>

            {/* Comments list */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <Link to={`/profile/${comment.user?.id}`}>
                      <img
                        src={
                          comment.user?.picture ||
                          "https://via.placeholder.com/40"
                        }
                        alt={comment.user?.name || "User"}
                        className="w-10 h-10 rounded-full mt-1"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                        <Link
                          to={`/profile/${comment.user?.id}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          {comment.user?.name || "Unknown User"}
                        </Link>
                        <p className="text-gray-700 mt-1">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 pl-2 text-xs text-gray-500">
                        <span>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        <button className="hover:text-gray-700">Like</button>
                        <button className="hover:text-gray-700">Reply</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
