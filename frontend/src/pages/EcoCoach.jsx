import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { 
  FaArrowLeft, 
  FaWalking, 
  FaBus, 
  FaUsers, 
  FaLeaf, 
  FaRobot, 
  FaPaperPlane, 
  FaChartLine, 
  FaCar, 
  FaBolt,
  FaBullseye,
  FaUtensils, 
  FaShoppingBag, 
  FaTrophy, 
  FaHeart 
} from "react-icons/fa";
import api from "../services/api";
import "../styles/EcoCoach.css";

// -------------------------------------------------------------
// Custom Sparkles Icon Component
// -------------------------------------------------------------
function SparklesIcon({ className }) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      className={className}
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.25a.75.75 0 0 1 .75.75c0 3.75 2.25 6 6 6a.75.75 0 0 1 0 1.5c-3.75 0-6 2.25-6 6a.75.75 0 0 1-1.5 0c0-3.75-2.25-6-6-6a.75.75 0 0 1 0-1.5c3.75 0 6-2.25 6-6a.75.75 0 0 1 .75-.75Zm7.5 12a.375.375 0 0 1 .375.375c0 1.875 1.125 3 3 3a.375.375 0 0 1 0 .75c-1.875 0-3 1.125-3 3a.375.375 0 0 1-.75 0c0-1.875-1.125-3-3-3a.375.375 0 0 1 0-.75c1.875 0 3-1.125 3-3A.375.375 0 0 1 19.5 14.25Z" />
    </svg>
  );
}

// -------------------------------------------------------------
// Animated Counter Component
// -------------------------------------------------------------
function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 1.2; // seconds
    const increment = end / (duration * 60); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toFixed(1)}</span>;
}

// -------------------------------------------------------------
// Main EcoCoach Dashboard Component
// -------------------------------------------------------------
function EcoCoach() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);


  const [recommendation, setRecommendation] = useState(null);
  const [goalProgress, setGoalProgress] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your Eco Coach AI. How can I help you reduce your carbon footprint today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Load initial recommendation details
  // Load recommendation + dashboard data
  useEffect(() => {
    api.get("/recommendations")
      .then((res) => {
        setRecommendation(res.data);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
      });

    api.get("/dashboard")
      .then((res) =>{
        console.log("Dashboard from EcoCoach:", res.data);
        setDashboard(res.data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard:", err);
      });
  api.get("/users/goal-progress")
    .then((res) => {
      setGoalProgress(res.data);
    })
    .catch((err) => console.error(err));

  }, []);
useEffect(() => {
  console.log("Dashboard Data:", dashboard);
}, [dashboard]);

// Existing useEffect
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askAI = async (customQuestion) => {
    const queryText = customQuestion || question;
    if (!queryText.trim()) return;

    const userMessage = {
      sender: "user",
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customQuestion) setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", { question: queryText });
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I apologize, but I encountered an error connecting to the AI engines. Please check your connection and try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Pre-configured questions for the quick chips
  const handleChipClick = (chipType) => {
    if (!recommendation) return;
    let query = "";
    switch (chipType) {
      case "dashboard":
        query = `Can you analyze my dashboard and suggest how to improve my carbon health score of ${recommendation.carbonScore}?`;
        break;
      case "transport":
        query = `My biggest contributor is ${recommendation.topCategory} with ${recommendation.categoryEmission.toFixed(1)} kg CO₂ (${recommendation.percentage.toFixed(0)}%). How can I specifically reduce these emissions?`;
        break;
      case "improve":
        query = "What are the most effective daily habits to raise my Carbon Health Score?";
        break;
      case "challenge":
        query = `Give me a step-by-step weekly plan to successfully achieve my weekly challenge: "${recommendation.weeklyChallenge}" and save ${recommendation.possibleSaving} kg CO₂.`;
        break;
      default:
        return;
    }
    askAI(query);
  };

  // Determine Contributor Icon
  const getContributorIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "transport":
        return <FaCar className="card-icon contributor-icon-glow" />;
      case "electricity":
      case "energy":
        return <FaBolt className="card-icon contributor-icon-glow" />;
      case "food":
        return <FaUtensils className="card-icon contributor-icon-glow" />;
      case "shopping":
        return <FaShoppingBag className="card-icon contributor-icon-glow" />;
      default:
        return <FaLeaf className="card-icon contributor-icon-glow" />;
    }
  };

  if (!recommendation) {
    return (
      <div className="eco-loading-screen">
        <div className="loader-container">
          <DotLottieReact
            src="https://lottie.host/745d3bfc-8a8e-4790-bf40-f7342d237010/mwVCCUjLAu.lottie"
            loop
            autoplay
            style={{ width: 150, height: 150 }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Retrieving Sustainability Analytics...
          </motion.p>
        </div>
      </div>
    );
  }

  // Circular progress calculations for score
  const score = recommendation.carbonScore;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Score description formatting
  const getScoreDescription = (val) => {
    if (val >= 80) return { label: "Excellent 🌍", class: "score-excellent" };
    if (val >= 60) return { label: "Good 👍", class: "score-good" };
    if (val >= 40) return { label: "Needs Work 🌱", class: "score-needs-work" };
    return { label: "High Footprint ⚠️", class: "score-danger" };
  };
  const scoreInfo = getScoreDescription(score);

  return (
    <div className="eco-dashboard-theme">
      {/* Background ambient glowing shapes */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>

      <div className="eco-wrapper">
        {/* Navigation Toolbar */}
        <div className="eco-navigation">
          <button onClick={() => navigate("/dashboard")} className="back-btn-glass">
            <FaArrowLeft className="btn-icon" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Hero Section */}
        <header className="eco-hero">
          <div className="hero-lottie-container">
            <DotLottieReact
              src="https://lottie.host/745d3bfc-8a8e-4790-bf40-f7342d237010/mwVCCUjLAu.lottie"
              loop
              autoplay
              style={{ width: 180, height: 180 }}
            />
            <div className="lottie-glow-underlay"></div>
          </div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            Eco Coach
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-subtitle"
          >
            Your Personal AI Sustainability Assistant
          </motion.p>
        </header>

        {/* Statistics Row Grid */}
        <section className="eco-stats-grid">
          {/* CARD 1: Carbon Health Score */}
          <motion.div 
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="stats-card score-card-premium"
          >
          <h2 style={{ marginBottom: "10px" }}>
            {dashboard?.todayEmission?.toFixed(2)} / {dashboard?.dailyGoal?.toFixed(2)} kg
          </h2>

          {/* Daily Goal Progress */}
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#1e293b",
              borderRadius: "20px",
              overflow: "hidden",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: `${Math.min(dashboard?.dailyProgress || 0, 100)}%`,
                height: "100%",
                background:
                  dashboard?.dailyProgress <= 70
                    ? "#22c55e"
                    : dashboard?.dailyProgress <= 100
                    ? "#f59e0b"
                    : "#ef4444",
                transition: "0.5s",
              }}
            />
          </div>

          <p style={{ marginBottom: "8px" }}>
            Remaining:
            <strong> {dashboard?.remainingToday?.toFixed(2)} kg</strong>
          </p>

          <p
            style={{
              color:
                dashboard?.dailyStatus === "Exceeded"
                  ? "#ef4444"
                  : "#22c55e",
              fontWeight: 700,
              marginBottom: "18px",
            }}
          >
            {dashboard?.dailyStatus}
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              margin: "18px 0",
            }}
          />

          {/* Goal Progress Section */}
          <div>
            <p
              style={{
                fontSize: "13px",
                color: "#94a3b8",
                marginBottom: "6px",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Goal Progress
            </p>

            <h3
              style={{
                color: "#10b981",
                margin: 0,
                fontSize: "26px",
              }}
            >
              {goalProgress?.currentReduction?.toFixed(1)}%
            </h3>

            <p
              style={{
                margin: "4px 0 10px",
                color: "#cbd5e1",
                fontSize: "14px",
              }}
            >
              Target: {goalProgress?.targetReduction}%
            </p>

            <div
              style={{
                width: "100%",
                height: "8px",
                background: "#1e293b",
                borderRadius: "20px",
                overflow: "hidden",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: `${Math.min(
                    ((goalProgress?.currentReduction || 0) /
                      (goalProgress?.targetReduction || 1)) *
                      100,
                    100
                  )}%`,
                  height: "100%",
                  background: "#10b981",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                color: "#94a3b8",
              }}
            >
              <span>{goalProgress?.status}</span>
              <span>{goalProgress?.projectedCompletion}</span>
            </div>
          </div>

            <div className="card-header-with-icon">
              <FaLeaf className="card-top-icon green-icon" />
              <h3>Carbon Health Score</h3>
            </div>
            <div className="circular-progress-wrapper">
              <svg width="130" height="130" className="progress-ring">
                <circle
                  className="ring-bg"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                  fill="transparent"
                  r={radius}
                  cx="65"
                  cy="65"
                />
                <motion.circle
                  className="ring-bar"
                  stroke="var(--accent-green, #10b981)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  fill="transparent"
                  r={radius}
                  cx="65"
                  cy="65"
                  strokeLinecap="round"
                />
              </svg>
              <div className="progress-center-text">
                <span className="score-number">{score}</span>
                <span className="score-denom">/100</span>
              </div>
            </div>
            <div className={`score-badge ${scoreInfo.class}`}>{scoreInfo.label}</div>
          </motion.div>

          {/* CARD 2: Biggest Contributor */}
          <motion.div 
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="stats-card contributor-card-premium"
          >
            <div className="card-header-with-icon">
              <h3>Biggest Contributor</h3>
              {getContributorIcon(recommendation.topCategory)}
            </div>
            <div className="contributor-content">
              <h2 className="top-category-name">{recommendation.topCategory}</h2>
              <div className="emission-details">
                <span className="emission-number">{recommendation.categoryEmission.toFixed(1)}</span>
                <span className="emission-unit"> kg CO₂</span>
              </div>
              <div className="progress-container-linear">
                <div className="linear-progress-track">
                  <motion.div 
                    className="linear-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${recommendation.percentage}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
                <div className="progress-percentage-label">
                  {recommendation.percentage.toFixed(1)}% of total emissions
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: Possible Saving */}
          <motion.div 
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="stats-card savings-card-premium"
          >
            <div className="card-header-with-icon">
              <FaHeart className="card-top-icon heart-icon" />
              <h3>Possible Saving</h3>
            </div>
            <div className="savings-display">
              <div className="savings-number-glow">
                <AnimatedCounter value={recommendation.possibleSaving} />
                <span className="savings-unit"> kg</span>
              </div>
              <p className="savings-subtitle">Potential weekly reduction</p>
              <div className="saving-impact-indicator">
                <SparklesIcon className="impact-star animate-pulse" />
                <span>Equivalent to planting 1 tree</span>
              </div>
            </div>
          </motion.div>

          {/* CARD 4: Weekly Challenge */}
          <motion.div 
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="stats-card challenge-card-premium"
          >
            <div className="card-header-with-icon">
              <FaTrophy className="card-top-icon gold-icon" />
              <h3>Weekly Challenge</h3>
            </div>
            <div className="challenge-body">
              <p className="challenge-desc">"{recommendation.weeklyChallenge}"</p>
              <div className="challenge-lottie-side">
                <DotLottieReact
                  src="https://lottie.host/c8a5b5d6-b798-4a26-a66c-32972492e1cb/RcUN5zrllV.lottie"
                  loop
                  autoplay
                  style={{ width: 65, height: 65 }}
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Personalized Recommendations Grid */}
        <section className="eco-recommendations-section">
          <div className="section-title-wrapper">
            <SparklesIcon className="spark-title-icon" />
            <h2>Personalized Recommendations</h2>
          </div>
          <div className="recommendations-grid">
            {/* Recommendation 1: Walk More */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              className="recommendation-item walk-card"
            >
              <div className="item-glow-border"></div>
              <div className="rec-card-inner">
                <div className="rec-header">
                  <div className="rec-icon-wrapper walk-icon-bg">
                    <FaWalking />
                  </div>
                  <h4>Walk More</h4>
                </div>
                <p>{recommendation.recommendation1}</p>
                <div className="rec-footer-tag">Active Commute</div>
              </div>
            </motion.div>

            {/* Recommendation 2: Public Transport */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              className="recommendation-item transit-card"
            >
              <div className="item-glow-border"></div>
              <div className="rec-card-inner">
                <div className="rec-header">
                  <div className="rec-icon-wrapper transit-icon-bg">
                    <FaBus />
                  </div>
                  <h4>Public Transport</h4>
                </div>
                <p>{recommendation.recommendation2}</p>
                <div className="rec-footer-tag">Mass Transit</div>
              </div>
            </motion.div>

            {/* Recommendation 3: Carpool */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              className="recommendation-item carpool-card"
            >
              <div className="item-glow-border"></div>
              <div className="rec-card-inner">
                <div className="rec-header">
                  <div className="rec-icon-wrapper carpool-icon-bg">
                    <FaUsers />
                  </div>
                  <h4>Carpool</h4>
                </div>
                <p>{recommendation.recommendation3}</p>
                <div className="rec-footer-tag">Shared Commute</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI Assistant Chat Section */}
        <section className="eco-ai-assistant-section">
          <div className="ai-assistant-inner-glass">
            {/* Header */}
            <div className="chat-header-premium">
              <div className="robot-lottie-container">
                <DotLottieReact
                  src="https://lottie.host/745d3bfc-8a8e-4790-bf40-f7342d237010/mwVCCUjLAu.lottie"
                  loop
                  autoplay
                  style={{ width: 60, height: 60 }}
                />
                <div className="robot-dot-online"></div>
              </div>
              <div className="chat-header-text">
                <h2>Ask Eco AI</h2>
                <div className="status-indicator-wrapper">
                  <span className="pulse-green-dot"></span>
                  <p>Assistant Online & Powered by Gemini</p>
                </div>
              </div>
            </div>

            {/* Messages Thread Container */}
            <div className="chat-messages-container">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`chat-bubble-row ${m.sender === "user" ? "user-row" : "ai-row"}`}
                  >
                    {m.sender === "ai" && (
                      <div className="chat-avatar-icon ai-avatar">
                        <FaRobot />
                      </div>
                    )}
                    <div className={`chat-bubble-bubble ${m.sender === "user" ? "user-bubble" : "ai-bubble"}`}>
                      <div className="bubble-text">{m.text}</div>
                      <div className="bubble-time">{m.time}</div>
                    </div>
                    {m.sender === "user" && (
                      <div className="chat-avatar-icon user-avatar">
                        {localStorage.getItem("fullName")?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="chat-bubble-row ai-row"
                >
                  <div className="chat-avatar-icon ai-avatar">
                    <FaRobot />
                  </div>
                  <div className="chat-bubble-bubble ai-bubble typing-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form Box */}
            <div className="chat-input-controls-wrapper">
              {/* Quick Action Chips list */}
              <div className="quick-chips-scroll">
                <button onClick={() => handleChipClick("dashboard")} className="action-chip">
                  <FaChartLine className="chip-icon" />
                  <span>Analyze Dashboard</span>
                </button>
                <button onClick={() => handleChipClick("transport")} className="action-chip">
                  <FaCar className="chip-icon" />
                  <span>Reduce Transport</span>
                </button>
                <button onClick={() => handleChipClick("improve")} className="action-chip">
                  <FaLeaf className="chip-icon" />
                  <span>Improve Carbon Score</span>
                </button>
                <button onClick={() => handleChipClick("challenge")} className="action-chip">
                  <FaTrophy className="chip-icon" />
                  <span>Weekly Plan</span>
                </button>
              </div>

              {/* Chat Text Input field */}
              <div className="chat-interactive-input-row">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") askAI();
                  }}
                  placeholder="Ask anything about sustainable living or reducing emissions..."
                  className="interactive-chat-input"
                  disabled={loading}
                />
                <button 
                  onClick={() => askAI()} 
                  className={`interactive-send-btn ${!question.trim() || loading ? "btn-disabled" : ""}`}
                  disabled={!question.trim() || loading}
                >
                  <FaPaperPlane className="send-icon" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EcoCoach;