import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaRegSmile } from "react-icons/fa";

function ReactionBar({ post, onLike, onReact }) {
  const [showPopover, setShowPopover] = useState(false);

  const ecoReactions = [
    { type: "INSPIRED", emoji: "🌱", label: "Inspired" },
    { type: "GREAT_CHOICE", emoji: "♻️", label: "Great Choice" },
    { type: "APPRECIATE", emoji: "❤️", label: "Appreciate" },
    { type: "MOTIVATED", emoji: "🔥", label: "Motivated" },
  ];

  const getEmojiForType = (type) => {
    switch (type) {
      case "INSPIRED": return "🌱";
      case "GREAT_CHOICE": return "♻️";
      case "APPRECIATE": return "❤️";
      case "MOTIVATED": return "🔥";
      default: return "🌱";
    }
  };

  return (
    <div className="reaction-combo-wrapper-parent" style={{ width: "100%" }}>
      <div className="post-action-row">
        {/* Like and React Actions */}
        <div className="like-react-combo">
          <button
            onClick={() => onLike(post.id)}
            className={`action-btn-glass ${post.likedByMe ? "liked" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            {post.likedByMe ? <FaHeart style={{ color: "#f87171" }} /> : <FaRegHeart />}
            <span>Like ({post.likesCount})</span>
          </button>

          <div
            className="reaction-combo-wrapper"
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
          >
            <button
              className={`action-btn-glass ${post.myReaction ? "active-react" : ""}`}
              onClick={() => setShowPopover(!showPopover)}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: post.myReaction ? "var(--primary-glow)" : "inherit" }}
            >
              <FaRegSmile />
              <span>React {post.myReaction ? `(${getEmojiForType(post.myReaction)})` : ""}</span>
            </button>

            {showPopover && (
              <div className="reactions-popover">
                {ecoReactions.map((rx) => (
                  <button
                    key={rx.type}
                    onClick={() => {
                      onReact(post.id, rx.type);
                      setShowPopover(false);
                    }}
                    className="react-emoji-btn"
                    title={rx.label}
                  >
                    {rx.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Display reaction counts */}
        <div className="active-reactions-list">
          {Object.entries(post.reactionsCount || {}).map(([type, count]) => {
            if (count <= 0) return null;
            const isMyReaction = post.myReaction === type;
            return (
              <div
                key={type}
                className={`reaction-pill ${isMyReaction ? "active" : ""}`}
                onClick={() => onReact(post.id, type)}
              >
                <span>{getEmojiForType(type)}</span>
                <span>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ReactionBar;
