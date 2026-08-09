import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilePdf, FaFileExcel, FaEnvelope, FaChevronDown,
  FaDownload, FaCalendarAlt, FaTrophy, FaSearch,
  FaLeaf, FaFilter, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import api from "../services/api";

/* ─── helpers ──────────────────────────────────────────────── */
function ecoRankOf(rank) {
  if (rank === 1) return "Eco Champion";
  if (rank <= 3)  return "Eco Leader";
  if (rank <= 10) return "Eco Warrior";
  return "Beginner";
}

const RANK_STYLE = {
  "Eco Champion": { color: "#22c55e", icon: "👑", border: "#22c55e44" },
  "Eco Leader":   { color: "#a78bfa", icon: "🏅", border: "#a78bfa44" },
  "Eco Warrior":  { color: "#60a5fa", icon: "🛡️", border: "#60a5fa44" },
  "Beginner":     { color: "#94a3b8", icon: "🌱", border: "#94a3b844" },
};

/* Shield badge SVGs for the reference style */
function EcoBadge({ rank }) {
  const title = ecoRankOf(rank);
  const s = RANK_STYLE[title];
  const icons = {
    "Eco Champion": "👑",
    "Eco Leader":   "⭐",
    "Eco Warrior":  "★",
    "Beginner":     "🌱",
  };
  return (
    <div className="eco-badge-wrap" style={{ "--badge-color": s.color }}>
      <div className="eco-badge-icon">{icons[title]}</div>
      <span className="eco-badge-label" style={{ color: s.color }}>{title}</span>
    </div>
  );
}

/* Rank medal for top 3 */
function RankMedal({ rank }) {
  const cfg = {
    1: { bg: "linear-gradient(135deg,#FFD700,#D97706)", shadow: "0 0 16px rgba(255,215,0,0.6)", text: "#1a0800" },
    2: { bg: "linear-gradient(135deg,#9ca3af,#6b7280)",  shadow: "0 0 10px rgba(156,163,175,0.4)", text: "#fff" },
    3: { bg: "linear-gradient(135deg,#CD7F32,#78350f)",  shadow: "0 0 10px rgba(205,127,50,0.4)", text: "#fff" },
  }[rank] || null;

  if (!cfg) {
    return (
      <div className="rank-number-circle">
        <span>{rank}</span>
      </div>
    );
  }

  return (
    <div className="rank-medal-wrap">
      {/* laurel ring */}
      <div className="rank-medal-laurel">🏵</div>
      <div className="rank-medal-circle"
        style={{ background: cfg.bg, boxShadow: cfg.shadow, color: cfg.text }}>
        {rank}
      </div>
    </div>
  );
}

/* Avatar */
const AVATAR_COLORS = [
  "#22c55e","#3b82f6","#a855f7","#f59e0b","#ec4899","#06b6d4","#84cc16","#f97316",
];
function UserAvatar({ name, rank }) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return (
    <div className="lb2-avatar" style={{ background: AVATAR_COLORS[idx] }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function ReportCenter({ leaderboard }) {
  const userId    = localStorage.getItem("id");
  const [from, setFrom]           = useState("");
  const [to,   setTo]             = useState("");
  const [dropOpen, setDropOpen]   = useState(false);
  const [exporting, setExporting] = useState("");
  const [search, setSearch]       = useState("");
  const [rankFilter, setRankFilter] = useState("all");
  const dropRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Export handlers — all original logic preserved */
  const downloadPdf = async () => {
    setExporting("pdf"); setDropOpen(false);
    try {
      const res = await api.get(`/reports/pdf/${userId}?from=${from}&to=${to}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url; a.download = "CarbonTrack_Report.pdf";
      document.body.appendChild(a); a.click(); a.remove();
    } catch { alert("Failed to download PDF"); }
    finally { setExporting(""); }
  };

  const downloadExcel = async () => {
    setExporting("excel"); setDropOpen(false);
    try {
      const res = await api.get(`/reports/excel/${userId}?from=${from}&to=${to}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url; a.download = "CarbonTrack_Report.xlsx";
      document.body.appendChild(a); a.click(); a.remove();
    } catch { alert("Failed to download Excel"); }
    finally { setExporting(""); }
  };

  const sendEmail = async () => {
    setExporting("email"); setDropOpen(false);
    try {
      const email = localStorage.getItem("email");
      await api.post(`/reports/email/${userId}?email=${email}&from=${from}&to=${to}`);
      alert("Report sent to " + email);
    } catch { alert("Failed to send email"); }
    finally { setExporting(""); }
  };

  const exportActions = [
    { key:"pdf",   icon:<FaFilePdf />,   label:"Export PDF",     hint:"Formatted report file",                               color:"#ef4444", fn:downloadPdf   },
    { key:"excel", icon:<FaFileExcel />, label:"Export Excel",   hint:"Spreadsheet with raw data",                           color:"#22c55e", fn:downloadExcel },
    { key:"email", icon:<FaEnvelope />,  label:"Send via Email", hint:`To: ${localStorage.getItem("email")||"your email"}`,  color:"#f59e0b", fn:sendEmail     },
  ];

  /* Data */
  const all50 = (leaderboard || []).slice(0, 50);
  const totalCO2 = all50.reduce((sum, u) => sum + (u.totalEmission || 0), 0);

  const filtered = all50.filter(item => {
    const rank = all50.indexOf(item) + 1;
    const ms   = item.name.toLowerCase().includes(search.toLowerCase());
    const mr   = rankFilter === "all" ? true : rankFilter === "top3" ? rank <= 3 : rankFilter === "top10" ? rank <= 10 : true;
    return ms && mr;
  });

  return (
    <div className="rcp-root">

      {/* ── Report header + export ── */}
      <div className="rcp-header-row">
        <div className="rcp-heading">
          <h1 className="rcp-title">Report Center</h1>
          <p className="rcp-sub">Generate, download and share your carbon emission reports</p>
        </div>
        <div className="rcp-export-wrap" ref={dropRef}>
          <button className="rcp-export-btn" onClick={() => setDropOpen(v => !v)} disabled={!!exporting}>
            {exporting ? <span className="rcp-btn-spinner" /> : <FaDownload className="rcp-btn-icon" />}
            <span>{exporting ? "Exporting…" : "Export Report"}</span>
            <motion.span animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display:"flex",alignItems:"center" }}>
              <FaChevronDown style={{ fontSize:"11px" }} />
            </motion.span>
          </button>
          <AnimatePresence>
            {dropOpen && (
              <motion.div className="rcp-dropdown"
                initial={{ opacity:0, y:-8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:-8, scale:0.96 }} transition={{ duration:0.16 }}>
                {exportActions.map((a, i) => (
                  <React.Fragment key={a.key}>
                    {i === 2 && <div className="rcp-drop-divider" />}
                    <button className="rcp-drop-item" onClick={a.fn}>
                      <div className="rcp-drop-icon" style={{ "--ic": a.color }}>{a.icon}</div>
                      <div className="rcp-drop-text">
                        <span className="rcp-drop-label">{a.label}</span>
                        <span className="rcp-drop-hint">{a.hint}</span>
                      </div>
                    </button>
                  </React.Fragment>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Date range ── */}
      <div className="rcp-date-row">
        <div className="rcp-date-field">
          <label className="rcp-date-label"><FaCalendarAlt /> From Date</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="rcp-date-input" />
        </div>
        <div className="rcp-date-field">
          <label className="rcp-date-label"><FaCalendarAlt /> To Date</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="rcp-date-input" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          TOP 50 ECO CONTRIBUTORS — NEW FLAT TABLE DESIGN
          (matches reference image exactly — NO podium)
      ══════════════════════════════════════════════ */}
      <div className="lb2-card">

        {/* ── Card header ── */}
        <div className="lb2-header">
          {/* Left: title */}
          <div className="lb2-title-group">
            <div className="lb2-trophy-wrap">
              <FaTrophy className="lb2-trophy-icon" />
            </div>
            <div>
              <h2 className="lb2-title">
                Top 50 <span className="lb2-title-eco">Eco</span> Contributors
              </h2>
              <p className="lb2-subtitle">
                Recognizing our community leaders in building a greener tomorrow.
              </p>
            </div>
          </div>

          {/* Right: total CO₂ + filter */}
          <div className="lb2-header-right">
            <div className="lb2-total-card">
              <div className="lb2-total-top">
                <FaLeaf className="lb2-total-leaf" />
                <span className="lb2-total-label">Total CO₂ Saved by Top 50</span>
              </div>
              <div className="lb2-total-value">{totalCO2.toFixed(2)} kg</div>
            </div>
            <select className="lb2-time-filter" value={rankFilter} onChange={e => setRankFilter(e.target.value)}>
              <option value="all">All Time</option>
              <option value="top3">Top 3</option>
              <option value="top10">Top 10</option>
            </select>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="lb2-search-row">
          <div className="lb2-search-wrap">
            <FaSearch className="lb2-search-icon" />
            <input
              className="lb2-search-input"
              type="text"
              placeholder="Search user…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Column headers ── */}
        <div className="lb2-col-headers">
          <div className="lb2-col-rank">RANK</div>
          <div className="lb2-col-user">USER</div>
          <div className="lb2-col-badge">ECO BADGE</div>
          <div className="lb2-col-ecorank">ECO RANK</div>
          <div className="lb2-col-co2">CO₂ SAVED</div>
        </div>

        {/* ── Rows ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={search + rankFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length === 0 ? (
              <div className="lb2-empty">
                No contributors found. Log activities to appear here!
              </div>
            ) : (
              filtered.map((item, idx) => {
                const rank    = all50.indexOf(item) + 1;
                const title   = ecoRankOf(rank);
                const rs      = RANK_STYLE[title];
                const isRank1 = rank === 1;
                const isTop3  = rank <= 3;

                return (
                  <motion.div
                    key={item.id || item.name}
                    className={`lb2-row${isRank1 ? " lb2-row--rank1" : isTop3 ? ` lb2-row--top${rank}` : ""}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    whileHover={{ backgroundColor: "rgba(34,197,94,0.05)" }}
                  >
                    {/* RANK */}
                    <div className="lb2-col-rank">
                      <RankMedal rank={rank} />
                    </div>

                    {/* USER */}
                    <div className="lb2-col-user">
                      <div className="lb2-user-inner">
                        <UserAvatar name={item.name} rank={rank} />
                        <div className="lb2-user-text">
                          <span className="lb2-user-name">{item.name}</span>
                          <span className="lb2-user-sub">@{item.name.toLowerCase().replace(/\s/g,"_")}</span>
                        </div>
                      </div>
                    </div>

                    {/* ECO BADGE */}
                    <div className="lb2-col-badge">
                      <EcoBadge rank={rank} />
                    </div>

                    {/* ECO RANK */}
                    <div className="lb2-col-ecorank">
                      <span className="lb2-ecorank-tag" style={{ color: rs.color, borderColor: rs.border }}>
                        {rs.icon} {title}
                      </span>
                    </div>

                    {/* CO₂ */}
                    <div className="lb2-col-co2">
                      <span className="lb2-co2-val">
                        {item.totalEmission ? item.totalEmission.toFixed(2) : "0.00"} kg
                      </span>
                      <FaLeaf className="lb2-co2-leaf" />
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Footer ── */}
        <div className="lb2-footer">
          <span className="lb2-footer-count">
            Showing 1 to {filtered.length} of {filtered.length} contributors
          </span>
          <div className="lb2-pagination">
            <button className="lb2-pg-btn" disabled>
              <FaChevronLeft />
            </button>
            <button className="lb2-pg-btn lb2-pg-btn--active">1</button>
            <button className="lb2-pg-btn" disabled>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
