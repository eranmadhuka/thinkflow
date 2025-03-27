import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaPaperPlane,
  FaTimes,
  FaReply,
} from "react-icons/fa";
import { ThumbsUp, MessageCircle, Edit, Trash2 } from "lucide-react";
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

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const postResponse = await axios.get(
          `http://localhost:8080/posts/${postId}`,
          { withCredentials: true }
        );
        const postData = postResponse.data;
        setPost(postData);

        const likesResponse = await axios.get(
          `http://localhost:8080/posts/${postId}/like-count`,
          { withCredentials: true }
        );
        setLikes(likesResponse.data || 0); // Fallback to 0 if undefined

        if (user) {
          const userLikeResponse = await axios.get(
            `http://localhost:8080/posts/${postId}/has-liked`,
            { withCredentials: true }
          );
          setHasLiked(userLikeResponse.data);
        }

        const commentsResponse = await axios.get(
          `http://localhost:8080/posts/${postId}/comments`,
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
          likesObj[comment.id] = likeCountResponse.data || 0;

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
    console.log("handleShowLikes called, likes:", likes); // Debug
    if (likes >= 0) {
      // Changed from > 0 to >= 0 to show modal even if no likes
      await fetchLikesList();
      setShowLikesModal(true);
      console.log("Modal should show, showLikesModal:", true); // Debug
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

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await axios.delete(`http://localhost:8080/posts/comments/${commentId}`, {
        withCredentials: true,
      });
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      setCommentCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentContent);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/posts/comments/${commentId}`,
        { content: editCommentText },
        { withCredentials: true }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setEditingCommentId(null);
      setEditCommentText("");
    } catch (error) {
      console.error("Failed to update comment:", error);
      alert("Failed to update comment. Please try again.");
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-red-600 font-medium">
          Post not found or error loading content.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <main className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Link to={`/profile/${post.user?.id}`}>
                <img
                  src={post.user?.picture || "https://via.placeholder.com/48"}
                  alt={post.user?.name || "User"}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-300 hover:ring-blue-400 transition-all duration-200"
                />
              </Link>
              <div>
                <Link
                  to={`/profile/${post.user?.id}`}
                  className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors duration-200"
                >
                  {post.user?.name || "Unknown User"}
                </Link>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-7">
              {post.title}
            </h1>
            <p className="text-gray-800 text-lg leading-relaxed mb-6">
              {post.content}
            </p>
            {post.mediaUrls?.map((url, index) => (
              <div
                key={index}
                className="mb-6 rounded-xl overflow-hidden shadow-md"
              >
                {post.fileTypes[index] === "image" ? (
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="object-cover h-1/2 w-full"
                  />
                ) : (
                  <video
                    src={url}
                    controls
                    className="h-1/2 w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Interaction Bar */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center ${
                  hasLiked
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors duration-200`}
              >
                <ThumbsUp
                  size={22}
                  className={hasLiked ? "fill-current" : ""}
                />
              </button>
              <span
                onClick={handleShowLikes}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                {likes} Likes
              </span>
              <button
                onClick={() => document.getElementById("comment-input").focus()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <MessageCircle size={22} />
                <span className="text-sm font-medium">
                  {commentCount} Comments
                </span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-4 sm:p-6 bg-gray-50">
            {/* Comment Input */}
            <div className="flex space-x-3 mb-6 sm:mb-8">
              <img
                src={user?.picture || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-gray-300 flex-shrink-0"
              />
              <div className="flex-1 relative">
                <textarea
                  id="comment-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 sm:p-4 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[80px] sm:min-h-[100px] shadow-sm transition-all duration-200 text-sm sm:text-base"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className={`absolute right-2 sm:right-3 bottom-2 sm:bottom-3 p-1 sm:p-2 rounded-full ${
                    commentText.trim()
                      ? "text-blue-600 hover:bg-blue-100"
                      : "text-gray-400 cursor-not-allowed"
                  } transition-colors duration-200`}
                >
                  <FaPaperPlane size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 sm:space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex space-x-3">
                      <Link to={`/profile/${comment.user?.id}`}>
                        <img
                          src={
                            comment.user?.picture ||
                            "https://via.placeholder.com/40"
                          }
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-gray-300 flex-shrink-0"
                        />
                      </Link>
                      <div className="flex-1">
                        {editingCommentId === comment.id ? (
                          <div className="relative">
                            <textarea
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                              className="w-full bg-white border border-gray-200 rounded-xl p-3 sm:p-4 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[80px] sm:min-h-[100px] shadow-sm text-sm sm:text-base"
                            />
                            <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 flex space-x-2 sm:space-x-3">
                              <button
                                onClick={() => setEditingCommentId(null)}
                                className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm font-medium"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(comment.id)}
                                disabled={!editCommentText.trim()}
                                className={`text-xs sm:text-sm font-medium ${
                                  editCommentText.trim()
                                    ? "text-blue-600 hover:text-blue-700"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <Link
                                  to={`/profile/${comment.user?.id}`}
                                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base"
                                >
                                  {comment.user?.name || "Unknown User"}
                                </Link>
                                <p className="text-gray-700 mt-1 text-sm sm:text-base">
                                  {comment.content}
                                </p>
                              </div>
                              {user?.id === comment.user?.id && (
                                <div className="flex space-x-2 sm:space-x-3">
                                  <button
                                    onClick={() =>
                                      handleEditComment(
                                        comment.id,
                                        comment.content
                                      )
                                    }
                                    className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                  >
                                    <Edit size={16} className="sm:w-5 sm:h-5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                                  >
                                    <Trash2
                                      size={16}
                                      className="sm:w-5 sm:h-5"
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center space-x-3 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-500">
                              <span>
                                {new Date(comment.createdAt).toLocaleString(
                                  [],
                                  {
                                    timeStyle: "short",
                                    dateStyle: "medium",
                                  }
                                )}
                                {comment.updatedAt &&
                                  comment.updatedAt > comment.createdAt && (
                                    <span className="ml-1 sm:ml-2 italic text-gray-400">
                                      (Edited)
                                    </span>
                                  )}
                              </span>
                              <button
                                onClick={() => handleCommentLike(comment.id)}
                                className={`flex items-center space-x-1 ${
                                  hasLikedComment[comment.id]
                                    ? "text-red-500 hover:text-red-600"
                                    : "text-gray-500 hover:text-gray-700"
                                } transition-colors duration-200`}
                              >
                                {hasLikedComment[comment.id] ? (
                                  <FaHeart
                                    size={12}
                                    className="sm:w-4 sm:h-4"
                                  />
                                ) : (
                                  <FaRegHeart
                                    size={12}
                                    className="sm:w-4 sm:h-4"
                                  />
                                )}
                                <span>{commentLikes[comment.id] || 0}</span>
                              </button>
                              <button
                                onClick={() => toggleReplyInput(comment.id)}
                                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                              >
                                <FaReply size={12} className="sm:w-4 sm:h-4" />
                                <span>Reply</span>
                              </button>
                              {commentReplies[comment.id]?.length > 0 && (
                                <button
                                  onClick={() => toggleReplies(comment.id)}
                                  className="text-gray-500 hover:text-blue-600 font-medium transition-colors duration-200"
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
                        )}

                        {/* Reply Input */}
                        {showReplyInput[comment.id] && (
                          <div className="ml-8 sm:ml-12 flex space-x-2 sm:space-x-3 mt-3">
                            <img
                              src={
                                user?.picture ||
                                "https://via.placeholder.com/30"
                              }
                              alt="Profile"
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-gray-300 flex-shrink-0"
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
                                className="w-full bg-white border border-gray-200 rounded-xl p-2 sm:p-3 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px] sm:min-h-[80px] shadow-sm text-sm"
                              />
                              <button
                                onClick={() => handleReply(comment.id)}
                                disabled={!replyText[comment.id]?.trim()}
                                className={`absolute right-1 sm:right-2 bottom-1 sm:bottom-2 p-1 sm:p-2 rounded-full ${
                                  replyText[comment.id]?.trim()
                                    ? "text-blue-600 hover:bg-blue-100"
                                    : "text-gray-400 cursor-not-allowed"
                                } transition-colors duration-200`}
                              >
                                <FaPaperPlane
                                  size={14}
                                  className="sm:w-4 sm:h-4"
                                />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {showReplies[comment.id] &&
                          commentReplies[comment.id]?.length > 0 && (
                            <div className="ml-8 sm:ml-12 space-y-3 sm:space-y-4 mt-3">
                              {commentReplies[comment.id].map((reply) => (
                                <div
                                  key={reply.id}
                                  className="flex space-x-2 sm:space-x-3"
                                >
                                  <Link to={`/profile/${reply.user?.id}`}>
                                    <img
                                      src={
                                        reply.user?.picture ||
                                        "https://via.placeholder.com/30"
                                      }
                                      alt={reply.user?.name}
                                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-gray-300 flex-shrink-0"
                                    />
                                  </Link>
                                  <div className="flex-1">
                                    <div className="bg-white rounded-xl p-2 sm:p-3 shadow-sm">
                                      <Link
                                        to={`/profile/${reply.user?.id}`}
                                        className="font-semibold text-gray-900 hover:text-blue-600 text-xs sm:text-sm"
                                      >
                                        {reply.user?.name || "Unknown User"}
                                      </Link>
                                      <p className="text-gray-700 mt-1 text-xs sm:text-sm">
                                        {reply.content}
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap items-center space-x-3 sm:space-x-4 mt-1 sm:mt-2 text-xs text-gray-500">
                                      <span>
                                        {new Date(
                                          reply.createdAt
                                        ).toLocaleString([], {
                                          timeStyle: "short",
                                          dateStyle: "medium",
                                        })}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleCommentLike(reply.id)
                                        }
                                        className={`flex items-center space-x-1 ${
                                          hasLikedComment[reply.id]
                                            ? "text-red-500 hover:text-red-600"
                                            : "text-gray-500 hover:text-gray-700"
                                        } transition-colors duration-200`}
                                      >
                                        {hasLikedComment[reply.id] ? (
                                          <FaHeart
                                            size={12}
                                            className="sm:w-4 sm:h-4"
                                          />
                                        ) : (
                                          <FaRegHeart
                                            size={12}
                                            className="sm:w-4 sm:h-4"
                                          />
                                        )}
                                        <span>
                                          {commentLikes[reply.id] || 0}
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 font-medium text-sm sm:text-base">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </main>

        {/* Likes Modal */}
        {showLikesModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Likes</h2>
                <button
                  onClick={() => setShowLikesModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <FaTimes size={22} className="text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                {loadingLikes ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                  </div>
                ) : likesList.length > 0 ? (
                  likesList.map((like) => (
                    <div
                      key={like.id}
                      className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <Link to={`/profile/${like.user?.id}`}>
                        <img
                          src={
                            like.user?.picture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={like.user?.name}
                          className="w-10 h-10 rounded-full ring-2 ring-gray-300 object-cover"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/profile/${like.user?.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                        >
                          {like.user?.name || "Unknown User"}
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4 font-medium">
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
