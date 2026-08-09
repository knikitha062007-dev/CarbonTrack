import Earth from "./Earth";
import { FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      {/* 3D Earth stays — kept in background */}
      <Earth />

      {/* Dark overlay to make form readable over the earth */}
      <div className="auth-bg-overlay" />

      {/* Ambient glow orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-layout-inner">
        {/* Left brand panel */}
        <motion.div
          className="auth-brand-panel"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="abp-logo">
            <div className="abp-logo-icon"><FaLeaf /></div>
            <span className="abp-logo-text">CarbonTracker</span>
          </div>

          <h2 className="abp-headline">
            Monitor, Reduce,<br />
            <span className="abp-accent">Thrive.</span>
          </h2>

          <p className="abp-sub">
            Join thousands of eco warriors tracking and reducing
            their carbon footprint every single day.
          </p>

          <div className="abp-stats">
            {[
              { val: "500+",  lbl: "Users" },
              { val: "10K+", lbl: "Activities" },
              { val: "AI",   lbl: "Powered" },
            ].map((s) => (
              <div className="abp-stat" key={s.lbl}>
                <span className="abp-stat-val">{s.val}</span>
                <span className="abp-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <ul className="abp-features">
            {[
              "Real-time CO₂ footprint tracking",
              "AI-powered sustainability coaching",
              "Community leaderboard & badges",
              "Downloadable eco certificate",
            ].map((f) => (
              <li key={f}>
                <span className="abp-check">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right form slot */}
        <div className="auth-form-slot">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
