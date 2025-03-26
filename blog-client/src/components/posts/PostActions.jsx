import React from "react";
import { Heart, MessageCircle } from "lucide-react";

export const PostActions = ({
  likes,
  hasLiked,
  commentCount,
  onLike,
  onCommentFocus,
}) => {
  return (
    <div className="flex items-center space-x-4 border-t pt-4">
      <button
        onClick={onLike}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
          hasLiked
            ? "bg-red-50 text-red-500"
            : "hover:bg-gray-100 text-gray-600"
        }`}
      >
        <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
        <span>{likes} Likes</span>
      </button>

      <button
        className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600"
        onClick={onCommentFocus}
      >
        <MessageCircle className="w-5 h-5" />
        <span>{commentCount} Comments</span>
      </button>
    </div>
  );
};
