import React, { useState, useEffect } from "react";
import { FaTimes, FaLeaf, FaAward, FaBullseye, FaLightbulb, FaImage } from "react-icons/fa";
import api from "../services/api";

function CreatePostModal({ onClose, onSubmit }) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [postType, setPostType] = useState("ALL"); // ALL, UPDATE, BADGE, GOAL, TIP
  
  // Daily Updates
  const [selectedTags, setSelectedTags] = useState([]);
  const availableTags = [
    "🚲 Cycled to work",
    "🥗 Ate vegetarian lunch",
    "♻️ Used reusable bottle",
    "🔌 Unplugged phantom loads",
    "🚌 Took public transit",
    "📦 Bought second-hand",
    "🚿 Took short shower",
    "💡 Switched to LED lights",
  ];

  // Unlocked Badges
  const [userBadges, setUserBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Goal info
  const [goalTarget, setGoalTarget] = useState("");
  
  // Sustainability Tip
  const [tipText, setTipText] = useState("");

  // Carbon stats
  const [dashboardStats, setDashboardStats] = useState(null);
  const currentUserId = localStorage.getItem("id");

  useEffect(() => {
    // Fetch today's emissions and stats
    api.get("/dashboard")
      .then((res) => setDashboardStats(res.data))
      .catch((err) => console.error(err));

    // Fetch user profile stats for unlocked badges
    if (currentUserId) {
      api.get(`/users/${currentUserId}/profile-stats`)
        .then((res) => {
          setUserBadges(res.data.badges || []);
        })
        .catch((err) => console.error(err));
    }
  }, [currentUserId]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    
    // Auto calculate carbon saved if eco updates are selected (e.g. 3.5kg per action)
    let carbonSavedVal = null;
    if (postType === "UPDATE") {
      carbonSavedVal = selectedTags.length * 3.5;
    } else if (postType === "GOAL") {
      carbonSavedVal = parseFloat(goalTarget) || 20.0;
    }

    const payload = {
      caption,
      imageUrl: imageUrl.trim() || null,
      postType,
      ecoUpdates: postType === "UPDATE" ? selectedTags : null,
      sharedBadgeName: postType === "BADGE" && selectedBadge ? selectedBadge.name : null,
      sharedBadgeIcon: postType === "BADGE" && selectedBadge ? selectedBadge.icon : null,
      sharedGoalTarget: postType === "GOAL" ? parseFloat(goalTarget) || 20.0 : null,
      sustainabilityTip: postType === "TIP" ? tipText : null,
      carbonSaved: carbonSavedVal,
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay-glass" onClick={onClose}>
      <div className="modal-content-glass" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h2>Create GreenPost</h2>

        {/* Display Today's Emissions (Requirement 4) */}
        {dashboardStats && (
          <div
            style={{
              background: "rgba(51, 255, 199, 0.08)",
              border: "1px solid rgba(51, 255, 199, 0.2)",
              borderRadius: "12px",
              padding: "12px",
              marginBottom: "20px",
              fontSize: "13.5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>TODAY'S EMISSIONS:</span>
            <span style={{ color: "var(--primary-glow)", fontWeight: "800" }}>
              {dashboardStats.todayEmission?.toFixed(2) || "0.00"} kg CO₂
            </span>
          </div>
        )}

        <form onSubmit={handlePostSubmit}>
          {/* Post Type Selector Tabs */}
          <div className="feed-filters-row" style={{ marginBottom: "20px" }}>
            <button
              type="button"
              className={`filter-chip ${postType === "ALL" ? "active" : ""}`}
              onClick={() => setPostType("ALL")}
            >
              💬 General Post
            </button>
            <button
              type="button"
              className={`filter-chip ${postType === "UPDATE" ? "active" : ""}`}
              onClick={() => setPostType("UPDATE")}
            >
              🚲 Daily Update
            </button>
            <button
              type="button"
              className={`filter-chip ${postType === "BADGE" ? "active" : ""}`}
              onClick={() => setPostType("BADGE")}
            >
              🏆 Share Badge
            </button>
            <button
              type="button"
              className={`filter-chip ${postType === "GOAL" ? "active" : ""}`}
              onClick={() => setPostType("GOAL")}
            >
              🎯 Share Goal
            </button>
            <button
              type="button"
              className={`filter-chip ${postType === "TIP" ? "active" : ""}`}
              onClick={() => setPostType("TIP")}
            >
              💡 Share Tip
            </button>
          </div>

          {/* Caption Input */}
          <div className="modal-form-group">
            <label>Caption</label>
            <textarea
              className="modal-text-area"
              placeholder="What's on your eco mind today?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </div>

          {/* Optional Image Input */}
          <div className="modal-form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaImage /> Optional Image URL
            </label>
            <input
              type="url"
              className="modal-text-input"
              placeholder="Paste a direct image link (e.g. https://images.unsplash.com/photo...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {/* Mock Image Suggestion Chips to wow the user */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", overflowX: "auto" }}>
              <button
                type="button"
                className="filter-chip"
                style={{ padding: "4px 10px", fontSize: "11px" }}
                onClick={() => setImageUrl("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60")}
              >
                🌳 Forest
              </button>
              <button
                type="button"
                className="filter-chip"
                style={{ padding: "4px 10px", fontSize: "11px" }}
                onClick={() => setImageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=60")}
              >
                🏖 Ocean
              </button>
              <button
                type="button"
                className="filter-chip"
                style={{ padding: "4px 10px", fontSize: "11px" }}
                onClick={() => setImageUrl("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=60")}
              >
                🌱 Sprout
              </button>
            </div>
          </div>

          {/* Daily Updates Tag Checkboxes (PostType === UPDATE) */}
          {postType === "UPDATE" && (
            <div className="modal-form-group">
              <label>Daily Eco Activities (Select all that apply)</label>
              <div className="checkbox-tag-selector">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`checkbox-tag-btn ${selectedTags.includes(tag) ? "selected" : ""}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Badge Selector Grid (PostType === BADGE) */}
          {postType === "BADGE" && (
            <div className="modal-form-group">
              <label>Select Unlocked Badge to Share (Click to select)</label>
              <div className="selector-scroll-grid">
                {userBadges.filter((b) => b.unlocked).length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "10px 0" }}>
                    No unlocked badges available yet. Lower your emissions to unlock badges!
                  </p>
                ) : (
                  userBadges
                    .filter((b) => b.unlocked)
                    .map((badge) => (
                      <div
                        key={badge.id}
                        className={`selector-asset-pill ${selectedBadge?.id === badge.id ? "selected" : ""}`}
                        onClick={() => setSelectedBadge(badge)}
                      >
                        <span className="selector-asset-icon">{badge.icon}</span>
                        <span className="selector-asset-name">{badge.name}</span>
                        <span className="selector-asset-status">Unlocked</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Goal achievement target input (PostType === GOAL) */}
          {postType === "GOAL" && (
            <div className="modal-form-group">
              <label>Goal Target Reduction (%)</label>
              <input
                type="number"
                className="modal-text-input"
                placeholder="Enter target reduction percent (e.g. 25)"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                min="1"
                max="100"
              />
            </div>
          )}

          {/* Sustainability Tip Input (PostType === TIP) */}
          {postType === "TIP" && (
            <div className="modal-form-group">
              <label>Sustainability Tip</label>
              <textarea
                className="modal-text-area"
                placeholder="Share a tip (e.g. 'Setting your fridge temperature to 4°C keeps food fresh and saves energy!')"
                value={tipText}
                onChange={(e) => setTipText(e.target.value)}
              />
              <button
                type="button"
                className="filter-chip"
                style={{ width: "max-content", marginTop: "8px", fontSize: "11px" }}
                onClick={() => setTipText("Try swapping one beef-based meal for a plant-based alternative each week. Doing so reduces your food footprint by up to 20%!")}
              >
                💡 Insert Example Tip
              </button>
            </div>
          )}

          {/* Submit Actions */}
          <div className="modal-submit-row">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-post-trigger-btn">
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
