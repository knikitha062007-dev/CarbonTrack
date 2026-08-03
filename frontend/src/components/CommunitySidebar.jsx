import React from "react";
import { FaTrophy, FaAward, FaUserPlus } from "react-icons/fa";

function CommunitySidebar({ sidebarData, onUserClick }) {
  const topContributors = sidebarData?.topContributors || [];
  const latestBadges = sidebarData?.latestBadges || [];
  const newMembers = sidebarData?.newMembers || [];

  return (
    <div className="community-sidebar-col">
      {/* 1. Top Contributors Widget */}
      <div className="sidebar-widget-card">
        <h3>
          <FaTrophy style={{ color: "#fbbf24" }} />
          <span>Top 50 Contributors</span>
        </h3>
        <div className="widget-item-list">
          {topContributors.length === 0 ? (
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>No contributors yet</p>
          ) : (
            topContributors.map((c) => (
              <div
                key={c.userId}
                className="contributor-item-row"
                onClick={() => onUserClick(c.userId)}
              >
                <div className={`rank-badge-number rank-${c.rank}`}>
                  {c.rank === 1 ? "🥇" : c.rank === 2 ? "🥈" : c.rank === 3 ? "🥉" : c.rank}
                </div>
                <div className="contributor-meta-info">
                  <span className="contributor-name">{c.fullName}</span>
                  <span className="contributor-saved">{c.carbonSaved} kg CO₂ saved</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Latest Badges Widget */}
      <div className="sidebar-widget-card">
        <h3>
          <FaAward style={{ color: "var(--primary-glow)" }} />
          <span>Latest Badges</span>
        </h3>
        <div className="widget-item-list">
          {latestBadges.map((b, idx) => (
            <div key={idx} className="latest-badge-item-row">
              <span className="badge-item-icon-circle">{b.badgeIcon}</span>
              <div className="badge-item-meta">
                <span className="badge-item-title">{b.badgeName}</span>
                <span className="badge-item-shared-by">Shared by {b.userFullName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. New Members Widget */}
      <div className="sidebar-widget-card">
        <h3>
          <FaUserPlus style={{ color: "#3b82f6" }} />
          <span>New Members</span>
        </h3>
        <div className="widget-item-list">
          {newMembers.length === 0 ? (
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>No members found</p>
          ) : (
            newMembers.map((m) => (
              <div
                key={m.userId}
                className="member-item-row"
                onClick={() => onUserClick(m.userId)}
              >
                <div className="rank-badge-number">👤</div>
                <div className="member-meta-info">
                  <span className="member-name">{m.fullName}</span>
                  <span className="member-joined">Joined {new Date(m.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunitySidebar;
