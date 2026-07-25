import React from "react";
import { FaAward, FaBullseye, FaLightbulb, FaLeaf } from "react-icons/fa";
import ReactionBar from "./ReactionBar";
import CommentSection from "./CommentSection";

function PostCard({ post, onUserClick, onLike, onReact, onCommentAdded }) {
  const getPostTypeBadge = (type) => {
    switch (type) {
      case "UPDATE":
        return <span className="post-badge-indicator">🚲 Daily Update</span>;
      case "BADGE":
        return <span className="post-badge-indicator" style={{ color: "#fbbf24", borderColor: "rgba(251, 191, 36, 0.3)", background: "rgba(251, 191, 36, 0.1)" }}>🏆 Badge Earned</span>;
      case "GOAL":
        return <span className="post-badge-indicator" style={{ color: "#3b82f6", borderColor: "rgba(59, 130, 246, 0.3)", background: "rgba(59, 130, 246, 0.1)" }}>🎯 Goal Achieved</span>;
      case "TIP":
        return <span className="post-badge-indicator" style={{ color: "#a855f7", borderColor: "rgba(168, 85, 247, 0.3)", background: "rgba(168, 85, 247, 0.1)" }}>💡 Eco Tip</span>;
      default:
        return <span className="post-badge-indicator">💬 Post</span>;
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="post-card-premium">
      {/* Post Card Header */}
      <div className="post-header">
        <div className="post-author-info" onClick={() => onUserClick(post.userId)}>
          <div className="author-avatar">{getInitials(post.userFullName)}</div>
          <div className="author-meta">
            <span className="author-name">{post.userFullName}</span>
            <span className="post-date">
              {new Date(post.createdAt).toLocaleDateString()} at{" "}
              {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        {getPostTypeBadge(post.postType)}
      </div>

      {/* Caption Content */}
      <div className="post-caption">{post.caption}</div>

      {/* Post Attachments */}
      <div className="post-attachment-container">
        {/* Uploaded Image */}
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Attachment" className="post-uploaded-img" />
        )}

        {/* Daily Eco Updates Section */}
        {post.postType === "UPDATE" && post.ecoUpdates && post.ecoUpdates.length > 0 && (
          <div className="eco-updates-container">
            {post.ecoUpdates.map((tag, idx) => (
              <span key={idx} className="eco-update-item">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Shared Badge Asset Card */}
        {post.postType === "BADGE" && post.sharedBadgeName && (
          <div className="shared-badge-card">
            <div className="shared-badge-icon-box">{post.sharedBadgeIcon || "🏆"}</div>
            <div className="shared-badge-details">
              <h4>{post.sharedBadgeName}</h4>
              <p>Earned for outstanding green activities</p>
            </div>
          </div>
        )}

        {/* Shared Goal Card */}
        {post.postType === "GOAL" && post.sharedGoalTarget && (
          <div className="shared-goal-card">
            <div className="shared-goal-header">
              <FaBullseye />
              <span>Goal Achieved!</span>
            </div>
            <div className="shared-goal-body">
              Successfully reduced carbon footprint target by{" "}
              <strong>{post.sharedGoalTarget}%</strong>!
            </div>
          </div>
        )}

        {/* Sustainability Tip Card */}
        {post.postType === "TIP" && post.sustainabilityTip && (
          <div className="shared-tip-card">
            <span className="tip-bulb">💡</span>
            <div className="tip-text-box">
              <h4>Green Tip</h4>
              <p>{post.sustainabilityTip}</p>
            </div>
          </div>
        )}

        {/* Carbon Saved ribbon if savings present */}
        {post.carbonSaved && post.carbonSaved > 0 && (
          <div className="carbon-saved-ribbon">
            <FaLeaf />
            <span>Saved {post.carbonSaved.toFixed(1)} kg CO₂</span>
          </div>
        )}
      </div>

      {/* Action and Reactions Section */}
      <ReactionBar post={post} onLike={onLike} onReact={onReact} />

      {/* Comment Section Inline UI */}
      <CommentSection
        postId={post.id}
        commentsCount={post.commentsCount}
        onCommentAdded={onCommentAdded}
      />
    </div>
  );
}

export default PostCard;
