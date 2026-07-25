import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartLine,
  FaHistory,
  FaTrophy,
  FaLeaf,
  FaUser,
  FaUsers,
  FaSignOutAlt,
  FaSearch,
  FaPlus,
  FaTimes,
  FaAward,
} from "react-icons/fa";
import api from "../services/api";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import CommunitySidebar from "../components/CommunitySidebar";
import "../styles/Community.css";
import "../styles/dashboard.css"; // inherit layout variables

function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [sidebarData, setSidebarData] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Profile modal states
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedProfileStats, setSelectedProfileStats] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [userInfo, setUserInfo] = useState({
    fullName: localStorage.getItem("fullName") || "Eco Warrior",
  });
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const filterCategories = ["All", "Updates", "Badges", "Goals", "Tips"];

  // Fetch feed and sidebar stats
  const fetchFeed = async () => {
    try {
      const response = await api.get(`/community/posts`, {
        params: {
          filter: filter === "All" ? null : filter,
          search: search.trim() ? search : null,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  const fetchSidebar = async () => {
    try {
      const response = await api.get("/community/sidebar");
      setSidebarData(response.data);
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [filter, search]);

  useEffect(() => {
    fetchSidebar();
    
    // Load theme
    localStorage.setItem("theme", theme);
    const bodyClass = document.body.classList;
    if (theme === "dark") {
      bodyClass.add("theme-dark", "dark");
      bodyClass.remove("theme-light");
    } else {
      bodyClass.add("theme-light");
      bodyClass.remove("theme-dark", "dark");
    }
  }, [theme]);

  // Fetch profile stats on selection
  useEffect(() => {
    if (selectedUserId) {
      setLoadingProfile(true);
      api.get(`/users/${selectedUserId}/profile-stats`)
        .then((res) => {
          setSelectedProfileStats(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingProfile(false));
    } else {
      setSelectedProfileStats(null);
    }
  }, [selectedUserId]);

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/community/posts/${postId}/like`);
      const liked = res.data.liked;
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likedByMe: liked,
              likesCount: liked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleReact = async (postId, reactionType) => {
    try {
      const res = await api.post(`/community/posts/${postId}/react`, {
        reactionType,
      });
      const activeReaction = res.data.reaction;
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const prevReaction = post.myReaction;
            const newReactionsCount = { ...post.reactionsCount };

            if (prevReaction) {
              newReactionsCount[prevReaction] = Math.max(0, (newReactionsCount[prevReaction] || 0) - 1);
            }

            if (activeReaction) {
              newReactionsCount[activeReaction] = (newReactionsCount[activeReaction] || 0) + 1;
            }

            return {
              ...post,
              myReaction: activeReaction || null,
              reactionsCount: newReactionsCount,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
  };

  const handleCommentAdded = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = async (payload) => {
    try {
      const response = await api.post("/community/posts", payload);
      setPosts((prev) => [response.data, ...prev]);
      setIsCreateOpen(false);
      fetchSidebar(); // refresh sidebar if they shared a badge
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="community-container">
      {/* Background ambient glowing shapes */}
      <div className="community-glow glow-left" />
      <div className="community-glow glow-right" />

      {/* Sidebar Section */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaLeaf style={{ color: "var(--primary-glow)", fontSize: "24px" }} />
            <span>CarbonTrack</span>
          </div>
        </div>

        <div className="community-sidebar-profile">
          <div className="profile-avatar">
            {userInfo.fullName?.charAt(0).toUpperCase() || "E"}
          </div>
          <div className="profile-info">
            <span className="profile-name">{userInfo.fullName}</span>
            <span className="profile-role">Eco Ambassador</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="sidebar-item" onClick={() => navigate("/dashboard")}>
            <FaChartLine className="sidebar-item-icon" />
            <span className="sidebar-item-text">Dashboard</span>
          </li>
          <li className="sidebar-item" onClick={() => navigate("/dashboard")}>
            <FaHistory className="sidebar-item-icon" />
            <span className="sidebar-item-text">Activities</span>
          </li>
          <li className="sidebar-item" onClick={() => navigate("/dashboard")}>
            <FaTrophy className="sidebar-item-icon" />
            <span className="sidebar-item-text">Leaderboard</span>
          </li>
          <li className="sidebar-item" onClick={() => navigate("/eco-coach")}>
            <FaLeaf className="sidebar-item-icon" />
            <span className="sidebar-item-text">Eco Coach</span>
          </li>
          <li className="sidebar-item active">
            <FaUsers className="sidebar-item-icon" style={{ color: "var(--bg-dark)" }} />
            <span className="sidebar-item-text" style={{ color: "var(--bg-dark)", fontWeight: 700 }}>GreenHub</span>
          </li>
          <li className="sidebar-item" onClick={() => navigate("/dashboard")}>
            <FaUser className="sidebar-item-icon" />
            <span className="sidebar-item-text">Profile Settings</span>
          </li>
          <li className="sidebar-item logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-item-icon" />
            <span className="sidebar-item-text">Log Out</span>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="community-layout">
        {/* Left Feed Column */}
        <section className="community-feed-col">
          <header className="community-header">
            <h1>GreenHub Community</h1>
            <div className="community-actions">
              <div className="search-box-wrapper">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="create-post-trigger-btn"
              >
                <FaPlus />
                <span>Create Post</span>
              </button>
            </div>
          </header>

          {/* Filter Row */}
          <div className="feed-filters-row">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`filter-chip ${filter === cat ? "active" : ""}`}
              >
                {cat === "All"
                  ? "🌍 All Posts"
                  : cat === "Updates"
                  ? "🚲 Updates"
                  : cat === "Badges"
                  ? "🏆 Badges"
                  : cat === "Goals"
                  ? "🎯 Goals"
                  : "💡 Tips"}
              </button>
            ))}
          </div>

          {/* Post Feed List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "10px" }}>
            {posts.length === 0 ? (
              <div
                className="post-card-premium"
                style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}
              >
                🌱 No community posts found. Be the first to share your sustainability updates!
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUserClick={setSelectedUserId}
                  onLike={handleLike}
                  onReact={handleReact}
                  onCommentAdded={handleCommentAdded}
                />
              ))
            )}
          </div>
        </section>

        {/* Right Sidebar stats column */}
        <CommunitySidebar
          sidebarData={sidebarData}
          onUserClick={setSelectedUserId}
        />
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <CreatePostModal
            onClose={() => setIsCreateOpen(false)}
            onSubmit={handleCreatePost}
          />
        )}
      </AnimatePresence>

      {/* Profile Details Modal */}
      <AnimatePresence>
        {selectedUserId && (
          <div className="modal-overlay-glass" onClick={() => setSelectedUserId(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content-glass"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "460px" }}
            >
              <button className="modal-close-btn" onClick={() => setSelectedUserId(null)}>
                <FaTimes />
              </button>

              {loadingProfile || !selectedProfileStats ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)" }}>
                  Retrieving Profile Data...
                </div>
              ) : (
                <div>
                  <div className="profile-modal-banner">
                    <div className="profile-modal-avatar">
                      {selectedProfileStats.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-modal-name-info">
                      <h3>{selectedProfileStats.fullName}</h3>
                      <span className="profile-modal-rank-tag">
                        Rank #{selectedProfileStats.rank}
                      </span>
                    </div>
                  </div>

                  <div className="profile-stats-dashboard-grid">
                    <div className="profile-modal-stat-box">
                      <span className="profile-modal-stat-val">
                        {selectedProfileStats.carbonSaved} kg
                      </span>
                      <span className="profile-modal-stat-lbl">CO₂ Saved</span>
                    </div>
                    <div className="profile-modal-stat-box">
                      <span className="profile-modal-stat-val">
                        🔥 {selectedProfileStats.streak} Days
                      </span>
                      <span className="profile-modal-stat-lbl">Log Streak</span>
                    </div>
                  </div>

                  <div className="profile-modal-badges-section">
                    <h4>Earned Eco Badges</h4>
                    <div className="profile-modal-badges-grid">
                      {selectedProfileStats.badges?.map((badge) => (
                        <div
                          key={badge.id}
                          className={`profile-modal-badge-pill ${badge.unlocked ? "unlocked" : ""}`}
                          title={`${badge.name}: ${badge.desc}`}
                        >
                          <span className="icon">{badge.icon}</span>
                          <span className="name">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Community;
