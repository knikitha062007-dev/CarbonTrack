import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaLeaf, FaPlay } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import api from "../services/api";

function CountUp({ to, duration = 2 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current || !to) return;
    ref.current = true;
    let start = 0;
    const steps = 60;
    const inc = to / steps;
    const interval = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(interval); }
      else setVal(Math.floor(start));
    }, (duration * 1000) / steps);
    return () => clearInterval(interval);
  }, [to]);
  return <>{val.toLocaleString()}</>;
}

function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userCount, setUserCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);

  useEffect(() => {
    api.get("/users/count").then(r => setUserCount(r.data.count)).catch(() => {});
    api.get("/users/activity-count").then(r => setActivityCount(r.data.count)).catch(() => {});
  }, []);

  const floatingBadges = [
    { label: t("hero.badge1"), color: "#3b82f6", x: "-120px", y: "60px", delay: 0.2 },
    { label: t("hero.badge2"), color: "#fbbf24", x: "-140px", y: "160px", delay: 0.5 },
    { label: t("hero.badge3"), color: "#f97316", x: "-110px", y: "260px", delay: 0.8 },
  ];

  return (
    <section className="hero">
      {/* Floating eco-reduction badges shown on left */}
      {floatingBadges.map((b, i) => (
        <motion.div
          key={i}
          className="hero-float-badge"
          style={{ "--badge-color": b.color }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.85, x: 0, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: b.delay + 0.8, duration: 0.5 },
            x: { delay: b.delay + 0.8, duration: 0.5 },
            y: { delay: b.delay + 1.5, duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="hfb-dot" />
          {b.label}
        </motion.div>
      ))}

      <motion.div className="hero-pill" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
        <span className="hero-pill-dot" />
        <span>{t("hero.badge")}</span>
      </motion.div>

      <motion.h1 className="hero-headline" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
        {t("hero.headline1")}
        <br />
        <span className="hero-gradient-text">{t("hero.headline2")}</span>
        <br />
        {t("hero.headline3")}
      </motion.h1>

      <motion.p className="hero-desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }}>
        {t("hero.desc")}
      </motion.p>

      <motion.div className="hero-cta-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <button className="hero-btn-primary" onClick={() => navigate("/register")}>
          <span>{t("hero.startFree")}</span>
          <FaArrowRight className="btn-icon" />
        </button>
        <button className="hero-btn-ghost" onClick={() => navigate("/login")}>
          <div className="ghost-play"><FaPlay style={{ fontSize: "9px" }} /></div>
          <span>{t("hero.signIn")}</span>
        </button>
      </motion.div>

      <motion.div className="hero-stats-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
        <div className="hero-stat">
          <span className="hs-value"><CountUp to={activityCount} />+</span>
          <span className="hs-label">{t("hero.activitiesLogged")}</span>
        </div>
        <div className="hs-sep" />
        <div className="hero-stat">
          <span className="hs-value">150T+</span>
          <span className="hs-label">{t("hero.co2Monitored")}</span>
        </div>
        <div className="hs-sep" />
        <div className="hero-stat">
          <span className="hs-value"><CountUp to={userCount} />+</span>
          <span className="hs-label">{t("hero.ecoWarriors")}</span>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
