import React, { useState, useEffect } from "react";
import api from "../services/api";

function CommentSection({ postId, commentsCount, onCommentAdded }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/community/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, postId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const res = await api.post(`/community/posts/${postId}/comments`, {
        content: newCommentText,
      });
      setComments((prev) => [...prev, res.data]);
      setNewCommentText("");
      if (onCommentAdded) {
        onCommentAdded(postId);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="comments-container-block">
      <button
        onClick={() => setShowComments(!showComments)}
        className="action-btn-glass"
        style={{ alignSelf: "flex-start", fontSize: "13px", padding: "0 0 10px 0" }}
      >
        💬 {showComments ? "Hide" : "Show"} Comments ({commentsCount})
      </button>

      {showComments && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="comment-list-scroll">
            {loading ? (
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "10px 0" }}>Loading comments...</p>
            ) : comments.length === 0 ? (
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "10px 0" }}>No comments yet. Share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item-glass">
                  <div className="comment-author-row">
                    <span className="comment-author-name">{comment.userFullName}</span>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="comment-body">{comment.content}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handlePostComment} className="comment-input-row-wrapper">
            <input
              type="text"
              placeholder="Write an encouraging comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="comment-input-text"
            />
            <button type="submit" className="comment-post-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CommentSection;
