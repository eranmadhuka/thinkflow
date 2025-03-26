import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaArrowLeft,
  FaPaperPlane,
  FaTimes,
  FaReply,
} from "react-icons/fa";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Edit,
  Trash2,
  UserMinus,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { FollowButton } from "../ui/FollowButton";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const { user } = useContext(AuthContext);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const [commentLikes, setCommentLikes] = useState({});
  const [hasLikedComment, setHasLikedComment] = useState({});
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [commentReplies, setCommentReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        // Fetch post details
        const postResponse = await axios.get(
          `http://localhost:8080/posts/${postId}`,
          { withCredentials: true }
        );
        const postData = postResponse.data;
        setPost(postData);

        // Fetch like count for the post
        const likesResponse = await axios.get(
          `http://localhost:8080/posts/${postId}/like-count`,
          { withCredentials: true }
        );
        setLikes(likesResponse.data);

        // Fetch user's like status
        if (user) {
          const userLikeResponse = await axios.get(
            `http://localhost:8080/posts/${postId}/has-liked`,
            { withCredentials: true }
          );
          setHasLiked(userLikeResponse.data);
        }

        // Fetch comments after post is set
        const commentsResponse = await axios.get(
          `http://localhost:8080/posts/${postId}/comments`, // Changed from post.id to postId
          { withCredentials: true }
        );

        const fetchedComments = Array.isArray(commentsResponse.data)
          ? commentsResponse.data
          : [];
        setComments(fetchedComments);
        setCommentCount(fetchedComments.length);

        if (fetchedComments.length > 0) {
          await fetchCommentLikesAndReplies(fetchedComments);
        }
      } catch (error) {
        console.error("Failed to fetch post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId, user]);

  const fetchCommentLikesAndReplies = async (fetchedComments) => {
    const likesObj = {};
    const hasLikedObj = {};
    const repliesObj = {};

    await Promise.all(
      fetchedComments.map(async (comment) => {
        try {
          const likeCountResponse = await axios.get(
            `http://localhost:8080/posts/comments/${comment.id}/like-count`,
            { withCredentials: true }
          );
          likesObj[comment.id] = likeCountResponse.data;

          if (user) {
            const hasLikedResponse = await axios.get(
              `http://localhost:8080/posts/comments/${comment.id}/has-liked`,
              { withCredentials: true }
            );
            hasLikedObj[comment.id] = hasLikedResponse.data;
          }

          setReplyText((prev) => ({ ...prev, [comment.id]: "" }));

          const repliesResponse = await axios.get(
            `http://localhost:8080/posts/comments/${comment.id}/replies`,
            { withCredentials: true }
          );
          repliesObj[comment.id] = Array.isArray(repliesResponse.data)
            ? repliesResponse.data
            : [];
        } catch (error) {
          console.error(
            `Error fetching data for comment ${comment.id}:`,
            error
          );
        }
      })
    );

    setCommentLikes(likesObj);
    setHasLikedComment(hasLikedObj);
    setCommentReplies(repliesObj);
  };

  const fetchLikesList = async () => {
    if (!post) return;

    setLoadingLikes(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/posts/${post.id}/likes`,
        { withCredentials: true }
      );
      setLikesList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch likes list:", error);
    } finally {
      setLoadingLikes(false);
    }
  };

  const handleShowLikes = async () => {
    if (likes > 0) {
      await fetchLikesList();
      setShowLikesModal(true);
    }
  };

  const handleLike = async () => {
    if (!user) return alert("You must be logged in to like posts.");
    if (!post) return;

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

  const handleComment = async () => {
    if (!commentText.trim() || !post || !user) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/posts/${post.id}/comment`,
        { content: commentText },
        { withCredentials: true }
      );

      const newComment = response.data;
      setCommentLikes((prev) => ({ ...prev, [newComment.id]: 0 }));
      setHasLikedComment((prev) => ({ ...prev, [newComment.id]: false }));
      setReplyText((prev) => ({ ...prev, [newComment.id]: "" }));
      setCommentReplies((prev) => ({ ...prev, [newComment.id]: [] }));

      setComments((prevComments) => [...prevComments, newComment]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!user) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/posts/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );

      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: response.data.likeCount,
      }));
      setHasLikedComment((prev) => ({
        ...prev,
        [commentId]: response.data.liked,
      }));
    } catch (error) {
      console.error("Failed to like comment:", error);
      alert("Failed to like comment. Please try again.");
    }
  };

  const toggleReplyInput = (commentId) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReply = async (commentId) => {
    if (!replyText[commentId]?.trim() || !user) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/posts/comments/${commentId}/reply`,
        { content: replyText[commentId] },
        { withCredentials: true }
      );

      setCommentReplies((prev) => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), response.data],
      }));
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
      setShowReplies((prev) => ({ ...prev, [commentId]: true }));
    } catch (error) {
      console.error("Failed to add reply:", error);
      alert("Failed to add reply. Please try again.");
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleFollow = () => {
    // Implement follow functionality here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg text-red-600">
          Post not found or error loading content.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-3xl mx-auto">
        <header className="bg-white rounded-t-xl shadow-md mb-4">
          <div className="px-6 py-4 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <FaArrowLeft className="text-gray-600" size={20} />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800 ml-4 truncate">
              {post.title}
            </h1>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to={`/profile/${post.user?.id}`}>
                  <img
                    src={post.user?.picture || "https://via.placeholder.com/48"}
                    alt={post.user?.name || "User"}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                  />
                </Link>
                <div>
                  <Link
                    to={`/profile/${post.user?.id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {post.user?.name || "Unknown User"}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {new Date(post.createdAt).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              <FollowButton user={user?.id} /> {/* Fixed user prop */}
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {post.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">{post.content}</p>

            {post.mediaUrls?.map((url, index) => (
              <div key={index} className="mb-4 rounded-lg overflow-hidden">
                {post.fileTypes[index] === "image" ? (
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="w-full object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={url}
                    controls
                    className="w-full object-cover rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>

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
                <ThumbsUp
                  size={20}
                  className={hasLiked ? "fill-current" : ""}
                />
                <span className="text-sm">Like</span>
                <span className="text-sm">({likes})</span>
              </button>

              <button
                onClick={() => document.getElementById("comment-input").focus()}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
              >
                <MessageCircle size={20} />
                <span className="text-sm">Comment</span>
                <span className="text-sm">({commentCount})</span>
              </button>
            </div>
          </div>

          <div className="p-6 bg-gray-50">
            <div className="flex space-x-3 mb-6">
              <img
                src={user?.picture || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full ring-2 ring-gray-200"
              />
              <div className="flex-1 relative">
                <textarea
                  id="comment-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px] shadow-sm"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${
                    commentText.trim()
                      ? "text-blue-500 hover:bg-blue-100"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaPaperPlane size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex space-x-3">
                      <Link to={`/profile/${comment.user?.id}`}>
                        <img
                          src={
                            comment.user?.picture ||
                            "https://via.placeholder.com/40"
                          }
                          className="w-10 h-10 rounded-full ring-2 ring-gray-200"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <Link
                            to={`/profile/${comment.user?.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600"
                          >
                            {comment.user?.name || "Unknown User"}
                          </Link>
                          <p className="text-gray-700 mt-1">
                            {comment.content}
                          </p>
                        </div>
                        <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                          <span>
                            {new Date(comment.createdAt).toLocaleString([], {
                              timeStyle: "short",
                              dateStyle: "medium",
                            })}
                          </span>
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className={`flex items-center space-x-1 hover:text-red-500 ${
                              hasLikedComment[comment.id] ? "text-red-500" : ""
                            }`}
                          >
                            {hasLikedComment[comment.id] ? (
                              <FaHeart size={14} />
                            ) : (
                              <FaRegHeart size={14} />
                            )}
                            <span>{commentLikes[comment.id] || 0}</span>
                          </button>
                          <button
                            onClick={() => toggleReplyInput(comment.id)}
                            className="flex items-center space-x-1 hover:text-blue-500"
                          >
                            <FaReply size={14} />
                            <span>Reply</span>
                          </button>
                          {commentReplies[comment.id]?.length > 0 && (
                            <button
                              onClick={() => toggleReplies(comment.id)}
                              className="hover:text-blue-500 font-medium"
                            >
                              {showReplies[comment.id]
                                ? "Hide replies"
                                : `${
                                    commentReplies[comment.id].length
                                  } replies`}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {showReplyInput[comment.id] && (
                      <div className="ml-12 flex space-x-3 mt-2">
                        <img
                          src={
                            user?.picture || "https://via.placeholder.com/30"
                          }
                          alt="Profile"
                          className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                        />
                        <div className="flex-1 relative">
                          <textarea
                            value={replyText[comment.id] || ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({
                                ...prev,
                                [comment.id]: e.target.value,
                              }))
                            }
                            placeholder="Write a reply..."
                            className="w-full bg-white border border-gray-200 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[80px] shadow-sm"
                          />
                          <button
                            onClick={() => handleReply(comment.id)}
                            disabled={!replyText[comment.id]?.trim()}
                            className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${
                              replyText[comment.id]?.trim()
                                ? "text-blue-500 hover:bg-blue-100"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <FaPaperPlane size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {showReplies[comment.id] &&
                      commentReplies[comment.id]?.length > 0 && (
                        <div className="ml-12 space-y-4 mt-2">
                          {commentReplies[comment.id].map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <Link to={`/profile/${reply.user?.id}`}>
                                <img
                                  src={
                                    reply.user?.picture ||
                                    "https://via.placeholder.com/30"
                                  }
                                  alt={reply.user?.name}
                                  className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                                />
                              </Link>
                              <div className="flex-1">
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                  <Link
                                    to={`/profile/${reply.user?.id}`}
                                    className="font-semibold text-gray-900 hover:text-blue-600 text-sm"
                                  >
                                    {reply.user?.name || "Unknown User"}
                                  </Link>
                                  <p className="text-gray-700 mt-1 text-sm">
                                    {reply.content}
                                  </p>
                                </div>
                                <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                                  <span>
                                    {new Date(reply.createdAt).toLocaleString(
                                      [],
                                      {
                                        timeStyle: "short",
                                        dateStyle: "medium",
                                      }
                                    )}
                                  </span>
                                  <button
                                    onClick={() => handleCommentLike(reply.id)}
                                    className={`flex items-center space-x-1 hover:text-red-500 ${
                                      hasLikedComment[reply.id]
                                        ? "text-red-500"
                                        : ""
                                    }`}
                                  >
                                    {hasLikedComment[reply.id] ? (
                                      <FaHeart size={14} />
                                    ) : (
                                      <FaRegHeart size={14} />
                                    )}
                                    <span>{commentLikes[reply.id] || 0}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </main>

        {showLikesModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Likes</h2>
                <button
                  onClick={() => setShowLikesModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                {loadingLikes ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                  </div>
                ) : likesList.length > 0 ? (
                  likesList.map((like) => (
                    <div
                      key={like.id}
                      className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <Link to={`/profile/${like.user?.id}`}>
                        <img
                          src={
                            like.user?.picture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={like.user?.name}
                          className="w-10 h-10 rounded-full ring-2 ring-gray-200"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/profile/${like.user?.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {like.user?.name || "Unknown User"}
                        </Link>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {like.user?.bio || "No bio available"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No likes yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
