import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import api from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FaLeaf,
  FaCar,
  FaBolt,
  FaUtensils,
  FaShoppingBag,
  FaChartLine,
  FaHistory,
  FaUser,
  FaSignOutAlt,
  FaPlus,
  FaTrophy,
  FaCalendarAlt,
  FaChevronRight,
  FaTimes,
  FaGlobe,
  FaTrash,
  FaCheckCircle,
  FaEnvelope,
  FaShieldAlt,
  FaClock,
  FaSave,
  FaChartBar,
} from "react-icons/fa";

import "../styles/dashboard.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const navigate = useNavigate();

  // Load User Info from localStorage with safe fallbacks
  const [userInfo, setUserInfo] = useState({
    fullName: localStorage.getItem("fullName") || "Eco Warrior",
    email: localStorage.getItem("email") || "warrior@carbontracker.com",
    goal: parseFloat(localStorage.getItem("co2Goal")) || 500.0,
  });

  // Current active tab state: 'dashboard', 'activities', 'reports', 'profile'
  const [activeTab, setActiveTab] = useState("dashboard");

  // Custom greeting based on time of day
  const [greeting, setGreeting] = useState("Welcome");

  // Rotating tips state
  const [tipIndex, setTipIndex] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for adding an activity with calculator support
  const [activityForm, setActivityForm] = useState({
    type: "Transport",
    detail: "",
    calcMode: "auto", // 'auto' (smart calculator) or 'manual' (enter kg CO2 directly)
    manualValue: "",
    
    // Transport calculator inputs
    distance: "",
    transportMode: "Petrol Car",
    
    // Electricity calculator inputs
    hours: "",
    appliance: "Air Conditioner",
    
    // Food calculator inputs
    mealType: "Red Meat",
    
    // Shopping calculator inputs
    shoppingCat: "Clothing",
    itemsCount: "1",
  });

  // Dummy activities list representing high-fidelity historical data
  const [activities, setActivities] = useState([]);

  // Search and filter state for Activities Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Interactive profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: userInfo.fullName,
    email: userInfo.email,
    goal: userInfo.goal,
  });

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState("");

  // Simulated reports loading state
  const [isExporting, setIsExporting] = useState(false);

  // List of professional eco tips
  const ecoTips = [
    "Your transport emissions are making progress! Swapping one car commute for public transit saves 15kg of CO₂ weekly.",
    "Did you know? Setting your AC thermostat 1°C higher can reduce its electricity usage by up to 10%.",
    "Adopting a plant-based diet even one day a week reduces your individual food water footprint by 20% and emissions by 8kg.",
    "Fast fashion has a heavy footprint. Extending clothes lifespan by 9 months reduces carbon, waste, and water footprints by 20-30%.",
    "Unplugging chargers and devices when not in use stops 'phantom loads' and saves up to 50kg CO₂ annually.",
  ];
  const fetchActivities = async () => {
    try {
      const response = await api.get("/activities");

      console.log("Activities from backend:", response.data);

      setActivities(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  // Set greeting based on time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Rotate eco tips automatically every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ecoTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
// Fetch activities from backend when dashboard loads
useEffect(() => {
  fetchActivities();
}, []);

  // Display helpful toast message
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("co2Goal");
    triggerToast("Logging you out securely...");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // Base emissions (historical baselines) + calculated from active activities list
  const getCategoryStats = () => {
    const totals = {
      Transport: 42.5,
      Electricity: 84.2,
      Food: 31.8,
      Shopping: 25.5,
    };

    // Aggregate values from current interactive activities state
    activities.forEach((act) => {
      if (totals[act.type] !== undefined) {
        totals[act.type] += act.emission;
      }
    });

    return totals;
  };

  const catStats = getCategoryStats();
  const totalEmissions = parseFloat(
    (catStats.Transport + catStats.Electricity + catStats.Food + catStats.Shopping).toFixed(1)
  );

  // Smart calculations for adding an activity
  const calculateCarbon = () => {
    if (activityForm.calcMode === "manual") {
      return parseFloat(activityForm.manualValue) || 0.0;
    }

    // Auto smart carbon calculations based on established greenhouse gas protocol parameters
    if (activityForm.type === "Transport") {
      const dist = parseFloat(activityForm.distance) || 0;
      const multipliers = {
        "Petrol Car": 0.18,
        "Diesel Car": 0.17,
        "Hybrid Car": 0.10,
        "Electric Car": 0.04,
        "Public Transit": 0.03,
        "Bicycle/Walk": 0.00,
      };
      return parseFloat((dist * (multipliers[activityForm.transportMode] || 0)).toFixed(1));
    }

    if (activityForm.type === "Electricity") {
      const hrs = parseFloat(activityForm.hours) || 0;
      const multipliers = {
        "Air Conditioner": 0.80,
        "Heater": 0.90,
        "Desktop PC": 0.15,
        "Washing Machine": 0.30,
        "Refrigerator": 0.05,
        "LED Bulbs": 0.01,
      };
      return parseFloat((hrs * (multipliers[activityForm.appliance] || 0)).toFixed(1));
    }

    if (activityForm.type === "Food") {
      const meals = {
        "Red Meat": 6.0,
        "Poultry/Fish": 1.8,
        "Vegetarian": 0.8,
        "Vegan": 0.4,
      };
      return meals[activityForm.mealType] || 0.0;
    }

    if (activityForm.type === "Shopping") {
      const count = parseInt(activityForm.itemsCount) || 1;
      const multipliers = {
        "Clothing": 8.5,
        "Electronics": 25.0,
        "Home Goods": 4.5,
        "Plastic/Packaging": 1.2,
      };
      return parseFloat((count * (multipliers[activityForm.shoppingCat] || 0)).toFixed(1));
    }

    return 0.0;
  };

  // Generate a friendly summary description for calculated activity
  const getFormDetailText = (calcVal) => {
    if (activityForm.detail.trim()) return activityForm.detail;

    if (activityForm.type === "Transport") {
      return `Drove ${activityForm.distance || 0}km in ${activityForm.transportMode}`;
    }
    if (activityForm.type === "Electricity") {
      return `Used ${activityForm.appliance} for ${activityForm.hours || 0} hrs`;
    }
    if (activityForm.type === "Food") {
      return `${activityForm.mealType} meal log`;
    }
    if (activityForm.type === "Shopping") {
      return `Bought ${activityForm.itemsCount} ${activityForm.shoppingCat} item(s)`;
    }
    return "Custom Eco Activity Logged";
  };

  // Handle Add Activity submit
  const handleAddActivity = async (e) => {
    e.preventDefault();

    const computedVal = calculateCarbon();

    try {

      const payload = {
        activityType: activityForm.type.toUpperCase(),
        quantity:
          Number(activityForm.distance) ||
          Number(activityForm.hours) ||
          Number(activityForm.itemsCount) ||
          1,
        emission: computedVal,
        unit:
          activityForm.type === "Transport"
            ? "km"
            : activityForm.type === "Electricity"
            ? "hours"
            : activityForm.type === "Shopping"
            ? "items"
            : "meal",
        subType:
          activityForm.transportMode ||
          activityForm.appliance ||
          activityForm.mealType ||
          activityForm.shoppingCat,
      };

      await api.post("/activities", payload);

      await fetchActivities();

      setIsModalOpen(false);

      triggerToast(
        `Activity added successfully! +${computedVal.toFixed(2)} kg CO₂e`
      );

      setActivityForm({
        type: "Transport",
        detail: "",
        calcMode: "auto",
        manualValue: "",
        distance: "",
        transportMode: "Petrol Car",
        hours: "",
        appliance: "Air Conditioner",
        mealType: "Red Meat",
        shoppingCat: "Clothing",
        itemsCount: "1",
      });

    } catch (error) {

      console.log(error);
        console.log(error.response);
        console.log(error.response?.data);

        alert(JSON.stringify(error.response?.data || error.message));

        triggerToast("Failed to save activity.");
    }
  };

  // Delete activity handler
  const handleDeleteActivity = (id, value) => {
    setActivities(activities.filter((act) => act.id !== id));
    triggerToast(`Activity removed. Deducted ${value} kg CO₂e from total.`);
  };

  // Save profile modifications
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUserInfo({
      fullName: profileForm.fullName,
      email: profileForm.email,
      goal: parseFloat(profileForm.goal) || 500.0,
    });
    localStorage.setItem("fullName", profileForm.fullName);
    localStorage.setItem("email", profileForm.email);
    localStorage.setItem("co2Goal", profileForm.goal);
    triggerToast("Your profile and targets have been successfully updated!");
  };

  // Simulate downloading report files
  const triggerExport = (format) => {
    setIsExporting(true);
    triggerToast(`Compiling greenhouse emissions report for ${userInfo.fullName}...`);
    setTimeout(() => {
      setIsExporting(false);
      triggerToast(`Successfully downloaded: CarbonTracker_Report_${format.toUpperCase()}.zip`);
    }, 2500);
  };

  // Progress calculations
  const progressPercent = Math.min(Math.round((totalEmissions / userInfo.goal) * 100), 100);
  const isOverGoal = totalEmissions > userInfo.goal;

  // Chart 1: Weekly emissions summary (Area chart with smooth spline)
  // Let's dynamically map activities to standard days of week
  const getWeeklyData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const baseEmissions = [25.4, 38.6, 18.2, 32.4, 21.1, 14.5, 29.8]; // baselines

    // Map current activities dates to days of week to add on top
    activities.forEach((act) => {
      const actDate = new Date(new Date(act.createdAt).toLocaleDateString());
      const dayIndex = (actDate.getDay() + 6) % 7; // Mon is 0, Sun is 6
      if (dayIndex >= 0 && dayIndex < 7) {
        baseEmissions[dayIndex] += act.emission;
      }
    });

    return {
      labels: days,
      datasets: [
        {
          label: "Carbon Footprint (kg CO₂e)",
          data: baseEmissions.map((v) => parseFloat(v.toFixed(1))),
          borderColor: "#33FFC7",
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, "rgba(51, 255, 199, 0.45)");
            gradient.addColorStop(1, "rgba(51, 255, 199, 0.0)");
            return gradient;
          },
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#33FFC7",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "#33FFC7",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10, 20, 30, 0.95)",
        titleColor: "#33FFC7",
        bodyColor: "#ffffff",
        borderColor: "rgba(51, 255, 199, 0.3)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.04)" },
        ticks: { color: "#94a3b8", font: { weight: "600" } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.04)" },
        ticks: { color: "#94a3b8", font: { weight: "600" } },
      },
    },
  };

  // Chart 2: Monthly Comparison (Reports page)
  const getMonthlyData = () => {
    return {
      labels: ["March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "This Year (2026)",
          data: [480, 410, 375, 310, parseFloat(totalEmissions.toFixed(0))],
          backgroundColor: "rgba(51, 255, 199, 0.75)",
          hoverBackgroundColor: "#33FFC7",
          borderRadius: 6,
          borderWidth: 0,
        },
        {
          label: "National Average",
          data: [520, 520, 520, 520, 520],
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: 6,
          borderWidth: 0,
        },
      ],
    };
  };

  const monthlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#ffffff", font: { weight: "600" } },
        position: "top",
      },
      tooltip: {
        backgroundColor: "rgba(10, 20, 30, 0.95)",
        borderColor: "rgba(51, 255, 199, 0.3)",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { weight: "600" } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.04)" },
        ticks: { color: "#94a3b8", font: { weight: "600" } },
      },
    },
  };

  // Chart 3: Category distribution (Doughnut chart)
  const getBreakdownData = () => {
    return {
      labels: ["Transport", "Electricity", "Food", "Shopping"],
      datasets: [
        {
          data: [
            parseFloat(catStats.Transport.toFixed(1)),
            parseFloat(catStats.Electricity.toFixed(1)),
            parseFloat(catStats.Food.toFixed(1)),
            parseFloat(catStats.Shopping.toFixed(1)),
          ],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(234, 179, 8, 0.8)",
            "rgba(249, 115, 22, 0.8)",
            "rgba(168, 85, 247, 0.8)",
          ],
          borderColor: "rgba(10, 15, 30, 0.9)",
          borderWidth: 2,
          hoverOffset: 12,
        },
      ],
    };
  };

  const breakdownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item) => ` ${item.label}: ${item.raw} kg CO₂e`,
        },
      },
    },
    cutout: "70%",
  };

  // Filter & Search activities logic
  const filteredActivities = activities.filter((act) => {
    const matchesSearch = act.subType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || act.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate badges unlocked dynamically
  const userBadges = [
    {
      id: "b1",
      name: "Carbon Cutter",
      desc: "Maintain net emissions under 300 kg CO₂e.",
      unlocked: activities.length > 0 && totalEmissions < 300,
      icon: "⚡",
    },
    {
      id: "b2",
      name: "Solar Champion",
      desc: "Log 3 or more low-impact Electricity activities.",
      unlocked:
      activities.length>0 &&
      activities.filter((a) => a.type === "Electricity" && a.value < 1.0).length >= 2,
      icon: "☀️",
    },
    {
      id: "b3",
      name: "Green Commuter",
      desc: "Swap car commutes with a zero-emission transport activity.",
      unlocked:
      activities.length>0 &&
      activities.some((a) => a.type === "Transport" && a.value === 0.0),
      icon: "🚲",
    },
    {
      id: "b4",
      name: "Vegan Warrior",
      desc: "Log at least two organic or vegan meals.",
      unlocked:
      activities.length>0 &&
      activities.filter((a) => a.type === "Food" && a.detail.toLowerCase().includes("vegan")).length >= 1,
      icon: "🌱",
    },
  ];

  const unlockedCount = userBadges.filter((b) => b.unlocked).length;

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid #33FFC7",
            padding: "16px 24px",
            borderRadius: "12px",
            zIndex: 2000,
            display: "flex",
            alignItems:" center",
            gap: "12px",
            boxShadow: "0 10px 30px rgba(51, 255, 199, 0.25)",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <FaCheckCircle style={{ color: "#33FFC7", fontSize: "20px" }} />
          <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Section */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaLeaf />
            <span>CarbonTracker</span>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {userInfo.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-name">{userInfo.fullName}</span>
            <span className="profile-role">Eco Rank: {activities.length===0
                                                     ? "Beginner"
                                                     : `Level ${unlockedCount}`}</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartLine className="sidebar-item-icon" />
            <span className="sidebar-item-text">Dashboard</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === "activities" ? "active" : ""}`}
            onClick={() => setActiveTab("activities")}
          >
            <FaHistory className="sidebar-item-icon" />
            <span className="sidebar-item-text">Activities</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <FaChartBar className="sidebar-item-icon" />
            <span className="sidebar-item-text">Reports</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => {
              setProfileForm({
                fullName: userInfo.fullName,
                email: userInfo.email,
                goal: userInfo.goal,
              });
              setActiveTab("profile");
            }}
          >
            <FaUser className="sidebar-item-icon" />
            <span className="sidebar-item-text">Profile Settings</span>
          </li>
          <li className="sidebar-item logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-item-icon" />
            <span className="sidebar-item-text">Log Out</span>
          </li>
        </ul>
      </aside>

      {/* Main Panel Area */}
      <main className="dashboard-main">
        {/* Page Title & Actions */}
        <div className="page-header">
          <div className="page-title">
            <h1>
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "activities" && "Your Activity Logs"}
              {activeTab === "reports" && "Carbon Emission Reports"}
              {activeTab === "profile" && "Account & Profile Settings"}
            </h1>
            <p>
              {activeTab === "dashboard" && "Real-time summary of your ecological carbon footprint."}
              {activeTab === "activities" && "Add, track, filter, and inspect your carbon emitting events."}
              {activeTab === "reports" && "Deep-dive analysis comparing your scores against average targets."}
              {activeTab === "profile" && "Personalize your dashboard and optimize your monthly carbon goals."}
            </p>
          </div>

          <div className="header-actions">
            <div className="date-badge">
              <FaCalendarAlt style={{ color: "#33FFC7" }} />
              <span>{new Date().toLocaleDateString("en-IN",{
                    weekday:"long",
                    day:"numeric",
                    month:"long",
                    year:"numeric"
                    })}</span>
            </div>
            <button className="action-btn-primary" onClick={() => setIsModalOpen(true)}>
              <FaPlus />
              <span>Log Activity</span>
            </button>
          </div>
        </div>

        {/* Tab content rendering */}
        {activeTab === "dashboard" && (
          <>
            {/* Top Cards Grid */}
            <div className="highlights-grid">
              {/* Welcome Card */}
              <div className="glass-card welcome-card">
                <div className="welcome-info">
                  <h2>
                    {greeting}, {userInfo.fullName}! 👋
                  </h2>
                  <p>
                    Great to see you today! Let's continue logging transport, electricity, food, and shopping inputs to stay carbon neutral. Swapping habits today guarantees a greener tomorrow.
                  </p>
                </div>
                <div className="welcome-tip">
                  <FaLeaf className="tip-icon" />
                  <div className="tip-text">
                    <strong>Daily Eco Tip:</strong> {ecoTips[tipIndex]}
                  </div>
                </div>
              </div>

              {/* Carbon Footprint Summary Card */}
              <div className="glass-card summary-card">
                <div className="summary-title">
                  <h3>CARBON FOOTPRINT SUMMARY</h3>
                  <div className={`status-indicator ${isOverGoal ? "warning" : "on-track"}`}>
                    <FaGlobe />
                    <span>{isOverGoal ? "CRITICAL LIMIT" : "ON TRACK"}</span>
                  </div>
                </div>
                <div className="emission-display">
                  <span className="emission-value">{totalEmissions}</span>
                  <span className="emission-unit">kg CO₂e Total</span>
                </div>
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Monthly Target Budget</span>
                    <span>{progressPercent}% Used</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${isOverGoal ? "warning-fill" : ""}`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="progress-header" style={{ marginTop: "8px", fontSize: "11px" }}>
                    <span>0 kg CO₂</span>
                    <span>Target: {userInfo.goal} kg CO₂</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistic Cards Grid */}
            <div className="stats-grid">
              {/* Transport Card */}
              <div className="glass-card stat-card transport" onClick={() => setActiveTab("activities")}>
                <div className="stat-card-header">
                  <span className="stat-title">TRANSPORT</span>
                  <div className="stat-icon-wrapper" style={{ "--icon-color-rgb": "59, 130, 246" }}>
                    <FaCar />
                  </div>
                </div>
                <div className="stat-value">{catStats.Transport.toFixed(1)} kg</div>
                <div className="stat-trend decrease">
                  <span>↓ 12.4% from last week</span>
                </div>
              </div>

              {/* Electricity Card */}
              <div className="glass-card stat-card electricity" onClick={() => setActiveTab("activities")}>
                <div className="stat-card-header">
                  <span className="stat-title">ELECTRICITY</span>
                  <div className="stat-icon-wrapper" style={{ "--icon-color-rgb": "234, 179, 8" }}>
                    <FaBolt />
                  </div>
                </div>
                <div className="stat-value">{catStats.Electricity.toFixed(1)} kg</div>
                <div className="stat-trend increase">
                  <span>↑ 3.1% from last week</span>
                </div>
              </div>

              {/* Food Card */}
              <div className="glass-card stat-card food" onClick={() => setActiveTab("activities")}>
                <div className="stat-card-header">
                  <span className="stat-title">FOOD CHOICE</span>
                  <div className="stat-icon-wrapper" style={{ "--icon-color-rgb": "249, 115, 22" }}>
                    <FaUtensils />
                  </div>
                </div>
                <div className="stat-value">{catStats.Food.toFixed(1)} kg</div>
                <div className="stat-trend decrease">
                  <span>↓ 24.0% from last week</span>
                </div>
              </div>

              {/* Shopping Card */}
              <div className="glass-card stat-card shopping" onClick={() => setActiveTab("activities")}>
                <div className="stat-card-header">
                  <span className="stat-title">SHOPPING & GOODS</span>
                  <div className="stat-icon-wrapper" style={{ "--icon-color-rgb": "168, 85, 247" }}>
                    <FaShoppingBag />
                  </div>
                </div>
                <div className="stat-value">{catStats.Shopping.toFixed(1)} kg</div>
                <div className="stat-trend decrease">
                  <span>↓ 5.5% from last week</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Chart + Breakdowns */}
            <div className="visuals-grid">
              {/* Weekly Chart */}
              <div className="glass-card">
                <div className="chart-card-header">
                  <h3>Weekly Carbon Emissions</h3>
                  <div className="chart-period-selector">
                    <button className="period-btn active">Week (Mon - Sun)</button>
                    <button className="period-btn" onClick={() => setActiveTab("reports")}>Month</button>
                  </div>
                </div>
                <div className="chart-canvas-container">
                  <Line data={getWeeklyData()} options={chartOptions} />
                </div>
              </div>

              {/* Breakdown Card */}
              <div className="glass-card breakdown-card">
                <div className="chart-card-header">
                  <h3>Emission Breakdown</h3>
                </div>
                <div style={{ height: "130px", position: "relative" }}>
                  <Doughnut data={getBreakdownData()} options={breakdownOptions} />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#94a3b8", display: "block", fontWeight: "600" }}>Total</span>
                    <span style={{ fontSize: "20px", fontWeight: "800", color: "#fff" }}>
                      {totalEmissions.toFixed(0)}
                    </span>
                    <span style={{ fontSize: "10px", color: "#94a3b8", display: "block" }}>kg</span>
                  </div>
                </div>

                <div className="breakdown-list">
                  <div className="breakdown-item">
                    <div className="breakdown-label-group">
                      <div className="breakdown-color-dot" style={{ background: "rgba(59, 130, 246, 0.8)" }}></div>
                      <span className="breakdown-label">Transport</span>
                    </div>
                    <div className="breakdown-details">
                      <div className="breakdown-val">{catStats.Transport.toFixed(1)} kg</div>
                      <div className="breakdown-pct">
                        {Math.round((catStats.Transport / totalEmissions) * 100) || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-label-group">
                      <div className="breakdown-color-dot" style={{ background: "rgba(234, 179, 8, 0.8)" }}></div>
                      <span className="breakdown-label">Electricity</span>
                    </div>
                    <div className="breakdown-details">
                      <div className="breakdown-val">{catStats.Electricity.toFixed(1)} kg</div>
                      <div className="breakdown-pct">
                        {Math.round((catStats.Electricity / totalEmissions) * 100) || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-label-group">
                      <div className="breakdown-color-dot" style={{ background: "rgba(249, 115, 22, 0.8)" }}></div>
                      <span className="breakdown-label">Food Choice</span>
                    </div>
                    <div className="breakdown-details">
                      <div className="breakdown-val">{catStats.Food.toFixed(1)} kg</div>
                      <div className="breakdown-pct">
                        {Math.round((catStats.Food / totalEmissions) * 100) || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-label-group">
                      <div className="breakdown-color-dot" style={{ background: "rgba(168, 85, 247, 0.8)" }}></div>
                      <span className="breakdown-label">Shopping</span>
                    </div>
                    <div className="breakdown-details">
                      <div className="breakdown-val">{catStats.Shopping.toFixed(1)} kg</div>
                      <div className="breakdown-pct">
                        {Math.round((catStats.Shopping / totalEmissions) * 100) || 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities Section */}
            <div className="glass-card table-card">
              <div className="table-header">
                <h3>Recent Activities Log</h3>
                <button className="table-view-all" onClick={() => setActiveTab("activities")}>
                  <span>See Full Log</span>
                  <FaChevronRight style={{ fontSize: "11px" }} />
                </button>
              </div>

              <div className="table-container">
                <table className="activities-table">
                  <thead>
                    <tr>
                      <th>Activity Type</th>
                      <th>Logged Details</th>
                      <th>Carbon Impact</th>
                      <th>Date / Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.slice(0, 4).map((act) => (
                      <tr key={act.id}>
                        <td>
                          <div className="category-cell">
                            <span
                              className="cat-dot"
                              style={{
                                background:
                                  act.activityType === "TRANSPORT"
                                    ? "var(--color-transport)"
                                    : act.activityType === "ELECTRICITY"
                                    ? "var(--color-electricity)"
                                    : act.activityType === "FOOD"
                                    ? "var(--color-food)"
                                    : "var(--color-shopping)",
                              }}
                            ></span>

                            <span>
                              {act.activityType.charAt(0) +
                                act.activityType.slice(1).toLowerCase()}
                            </span>
                          </div>
                        </td>

                        <td>{act.subType}</td>

                        <td>
                          <span
                            className={`impact-badge ${
                              act.emission > 5
                                ? "high"
                                : act.emission > 2
                                ? "moderate"
                                : "low"
                            }`}
                          >
                            {act.emission.toFixed(2)} kg CO₂e (
                            {act.emission > 5
                              ? "HIGH"
                              : act.emission > 2
                              ? "MODERATE"
                              : "LOW"}
                            )
                          </span>
                        </td>

                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaClock
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "12px",
                              }}
                            />

                            <span>
                              {new Date(act.createdAt).toLocaleDateString()} /{" "}
                              {new Date(act.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>

                        <td>
                          <button
                            className="action-icon-btn delete"
                            title="Delete Activity"
                            onClick={() => handleDeleteActivity(act.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Activities Logs Panel */}
        {activeTab === "activities" && (
          <div className="glass-card" style={{ padding: "35px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px",
                marginBottom: "30px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "20px",
              }}
            >
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["All", "Transport", "Electricity", "Food", "Shopping"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      background: categoryFilter === cat ? "var(--primary-glow)" : "rgba(255, 255, 255, 0.05)",
                      color: categoryFilter === cat ? "#050816" : "#ffffff",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: "20px",
                      fontSize: "13.5px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "30px",
                    padding: "10px 20px",
                    color: "white",
                    outline: "none",
                    width: "250px",
                    fontSize: "13.5px",
                  }}
                />
              </div>
            </div>

            <div className="table-container">
              {filteredActivities.length > 0 ? (
                <table className="activities-table">
                  <thead>
                    <tr>
                      <th>Activity Type</th>
                      <th>Logged Details</th>
                      <th>Carbon Impact</th>
                      <th>Date / Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>

                  {filteredActivities.length === 0 ? (

                  <tr>

                  <td
                  colSpan={5}
                  style={{
                  padding:"40px",
                  textAlign:"center",
                  color:"#bdbdbd",
                  fontSize:"18px"
                  }}
                  >

                  🌱 No activities logged yet.

                  <br/><br/>

                  Start by clicking

                  <strong> Log Activity </strong>

                  to record your first carbon activity.

                  </td>

                  </tr>

                  ) : (

                  filteredActivities.map((act)=>(

                  <tr key={act.id}>

                  <td>

                  <div className="category-cell">

                  <span
                  className="cat-dot"
                  style={{
                  background:
                  act.activityType==="TRANSPORT"
                  ? "var(--color-transport)"
                  : act.activityType==="ELECTRICITY"
                  ? "var(--color-electricity)"
                  : act.activityType==="FOOD"
                  ? "var(--color-food)"
                  : "var(--color-shopping)"
                  }}
                  ></span>

                  {act.activityType}

                  </div>

                  </td>

                  <td>{act.subType}</td>

                  <td>

                  {act.emission} {act.unit}

                  </td>

                  <td>

                  {new Date(act.createdAt).toLocaleDateString()}

                  <br/>

                  {new Date(act.createdAt).toLocaleTimeString()}

                  </td>

                  <td>

                  <button
                  className="delete-btn"
                  onClick={()=>deleteActivity(act.id)}
                  >

                  Delete

                  </button>

                  </td>

                  </tr>

                  ))

                  )}

                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: "center", padding: "50px 20px" }}>
                  <FaLeaf style={{ fontSize: "50px", color: "rgba(255,255,255,0.15)", marginBottom: "15px" }} />
                  <h3 style={{ fontSize: "18px", color: "var(--text-muted)" }}>No activities matched your query.</h3>
                  <button
                    className="btn-primary"
                    style={{ marginTop: "20px" }}
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("All");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Reports & Analysis Panel */}
        {activeTab === "reports" && (
          <div className="reports-layout">
            {/* Top row with charts */}
            <div className="reports-charts-grid">
              {/* Monthly comparison */}
              <div className="glass-card" style={{ padding: "30px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>
                  Monthly Footprint Tracker (2026)
                </h3>
                <div style={{ height: "300px", width: "100%" }}>
                  <Bar data={getMonthlyData()} options={monthlyOptions} />
                </div>
              </div>

              {/* CO2 Savings card */}
              <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Carbon Efficiency Summary</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.5" }}>
                    Comparing your results with standard state records and ecological averages.
                  </p>
                </div>

                <div style={{ margin: "25px 0", textAlign: "center" }}>
                  <span style={{ fontSize: "48px", fontWeight: "800", color: "var(--primary-glow)", display: "block" }}>
                    {(520 - totalEmissions).toFixed(1)} kg
                  </span>
                  <span style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "600" }}>
                    Emissions Saved this month! 🌳
                  </span>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    padding: "15px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <p style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: "1.5" }}>
                    <strong>Environmental Equivalent:</strong> Your footprint reductions have prevented emissions equivalent to planting <strong>{Math.max(1, Math.round((520 - totalEmissions) / 20))}</strong> saplings today.
                  </p>
                </div>

                <div className="reports-action-row">
                  <button className="action-btn-outline" onClick={() => triggerExport("pdf")} disabled={isExporting}>
                    {isExporting ? "Compiling..." : "Export PDF Report"}
                  </button>
                  <button className="action-btn-outline" onClick={() => triggerExport("csv")} disabled={isExporting}>
                    {isExporting ? "Compiling..." : "Export CSV Data"}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row with Insights */}
            <div className="glass-card">
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>
                Algorithmic Eco Recommendations
              </h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-card-header">
                    <FaCar />
                    <span>Reduce Transport Load</span>
                  </div>
                  <p>
                    Your transport section is currently {catStats.Transport > 50 ? "high" : "well managed"}. Swapping even single private car commutes with high-efficiency rail or bicycles cuts localized PM2.5 and immediate CO₂ by up to 90%.
                  </p>
                </div>

                <div className="tip-card">
                  <div className="tip-card-header">
                    <FaBolt />
                    <span>Manage Phantom Energy</span>
                  </div>
                  <p>
                    Electricity remains your largest carbon source. Unplugging home devices (smart TVs, monitors, routers) overnight cancels 'vampire draws' which drain roughly 45W of uninterrupted current daily.
                  </p>
                </div>

                <div className="tip-card">
                  <div className="tip-card-header">
                    <FaUtensils />
                    <span>Carbon-wise Nutrition</span>
                  </div>
                  <p>
                    Transitioning beef or lamb meals to chicken, fish, or vegetable alternatives trims your calorie carbon footprint ratio from 25:1 to 3:1 immediately. It is the fastest single lifestyle swap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Profile and Goals Configuration */}
        {activeTab === "profile" && (
          <div className="glass-card profile-view-container">
            {/* Left Column Profile Showcase */}
            <div className="glass-card profile-card-left" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
              <div className="profile-pic-large">
                {userInfo.fullName.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "5px" }}>{userInfo.fullName}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{userInfo.email}</p>
              <div className="profile-badge-count">Eco Rank: Level {unlockedCount + 1}</div>

              <div className="profile-stats-mini">
                <div className="p-stat-box">
                  <span className="p-stat-val">{activities.length}</span>
                  <span className="p-stat-lbl">Logs</span>
                </div>
                <div className="p-stat-box">
                  <span className="p-stat-val">{unlockedCount} / 4</span>
                  <span className="p-stat-lbl">Badges</span>
                </div>
              </div>

              {/* Showcase badges */}
              <div className="badges-showcase">
                <h4>Unlocked Accomplishments</h4>
                <div className="badges-grid">
                  {userBadges.map((bdg) => (
                    <div
                      key={bdg.id}
                      className={`badge-item ${bdg.unlocked ? "unlocked" : ""}`}
                      title={`${bdg.name}: ${bdg.desc} (${bdg.unlocked ? "Unlocked" : "Locked"})`}
                    >
                      <span className="badge-icon">{bdg.icon}</span>
                      <span className="badge-name">{bdg.name}</span>
                      <span className="badge-desc">{bdg.unlocked ? "Unlocked" : "Locked"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column Profile Editor */}
            <div className="profile-form-container">
              <h3>Configure Dashboard Parameters</h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Account Full Name</label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Target carbon limit (kg CO₂e)</label>
                    <input
                      type="number"
                      step="10"
                      value={profileForm.goal}
                      onChange={(e) => setProfileForm({ ...profileForm, goal: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>System Theme Preference</label>
                    <select disabled style={{ cursor: "not-allowed" }}>
                      <option>Dark - Glassmorphism Green (Active)</option>
                      <option>Light - Solar Green (Soon)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: "15px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
                  <button type="submit" className="action-btn-primary">
                    <FaSave />
                    <span>Save Parameters</span>
                  </button>
                </div>
              </form>

              <div
                style={{
                  marginTop: "10px",
                  padding: "20px",
                  background: "rgba(51, 255, 199, 0.05)",
                  border: "1px solid rgba(51, 255, 199, 0.2)",
                  borderRadius: "14px",
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                <FaShieldAlt style={{ fontSize: "28px", color: "var(--primary-glow)", flexShrink: 0 }} />
                <p style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: "1.5", margin: 0 }}>
                  <strong>Security Guarantee:</strong> Your profile settings and activity entries are stored safely in your local session. CarbonTracker does not distribute your telemetry to external marketing streams.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Activity Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </button>
            <h3>Log Carbon Activity</h3>
            <p>Input parameters to calculate and append this carbon-emitting activity to your stream.</p>

            <form onSubmit={handleAddActivity}>
              <div className="form-group">
                <label>Carbon Category</label>
                <select
                  value={activityForm.type}
                  onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                >
                  <option value="Transport">🚗 Transport</option>
                  <option value="Electricity">⚡ Electricity</option>
                  <option value="Food">🍔 Food choices</option>
                  <option value="Shopping">🛍️ Shopping & Apparel</option>
                </select>
              </div>

              {/* Calculator mode toggle */}
              <div className="form-group">
                <label>Input Entry Method</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className={`period-btn ${activityForm.calcMode === "auto" ? "active" : ""}`}
                    style={{ flex: 1, padding: "10px" }}
                    onClick={() => setActivityForm({ ...activityForm, calcMode: "auto" })}
                  >
                    Smart Carbon Calculator
                  </button>
                  <button
                    type="button"
                    className={`period-btn ${activityForm.calcMode === "manual" ? "active" : ""}`}
                    style={{ flex: 1, padding: "10px" }}
                    onClick={() => setActivityForm({ ...activityForm, calcMode: "manual" })}
                  >
                    Manual Carbon Entry
                  </button>
                </div>
              </div>

              {/* Conditional calculator form fields */}
              {activityForm.calcMode === "manual" ? (
                <div className="form-group">
                  <label>Manual Footprint (kg CO₂e)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter explicit footprint..."
                    value={activityForm.manualValue}
                    onChange={(e) => setActivityForm({ ...activityForm, manualValue: e.target.value })}
                    required
                  />
                </div>
              ) : (
                <>
                  {/* Transport Fields */}
                  {activityForm.type === "Transport" && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Distance Traveled (km)</label>
                        <input
                          type="number"
                          placeholder="e.g. 15"
                          value={activityForm.distance}
                          onChange={(e) => setActivityForm({ ...activityForm, distance: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Transport Mode</label>
                        <select
                          value={activityForm.transportMode}
                          onChange={(e) => setActivityForm({ ...activityForm, transportMode: e.target.value })}
                        >
                          <option value="Petrol Car">Petrol Car (Large/Mid)</option>
                          <option value="Diesel Car">Diesel Car</option>
                          <option value="Hybrid Car">Hybrid Hybrid Car</option>
                          <option value="Electric Car">Pure Electric (EV)</option>
                          <option value="Public Transit">Bus / Tram / Train</option>
                          <option value="Bicycle/Walk">Bicycle / Walk</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Electricity Fields */}
                  {activityForm.type === "Electricity" && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Hours of usage</label>
                        <input
                          type="number"
                          placeholder="e.g. 4"
                          value={activityForm.hours}
                          onChange={(e) => setActivityForm({ ...activityForm, hours: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Household Appliance</label>
                        <select
                          value={activityForm.appliance}
                          onChange={(e) => setActivityForm({ ...activityForm, appliance: e.target.value })}
                        >
                          <option value="Air Conditioner">Air Conditioner (AC)</option>
                          <option value="Heater">Space Heater</option>
                          <option value="Desktop PC">Desktop Computer</option>
                          <option value="Washing Machine">Washing Machine</option>
                          <option value="Refrigerator">Refrigerator</option>
                          <option value="LED Bulbs">LED Light Bulb</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Food Fields */}
                  {activityForm.type === "Food" && (
                    <div className="form-group">
                      <label>Meal Classification</label>
                      <select
                        value={activityForm.mealType}
                        onChange={(e) => setActivityForm({ ...activityForm, mealType: e.target.value })}
                      >
                        <option value="Red Meat">🥩 Red Meat meal (Beef, Pork, Lamb)</option>
                        <option value="Poultry/Fish">🐟 Poultry / Fish meal</option>
                        <option value="Vegetarian">🍳 Vegetarian meal (Egg/Dairy)</option>
                        <option value="Vegan">🥗 Vegan meal (Fully Plant-Based)</option>
                      </select>
                    </div>
                  )}

                  {/* Shopping Fields */}
                  {activityForm.type === "Shopping" && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Purchased Goods Category</label>
                        <select
                          value={activityForm.shoppingCat}
                          onChange={(e) => setActivityForm({ ...activityForm, shoppingCat: e.target.value })}
                        >
                          <option value="Clothing">Clothing & Footwear</option>
                          <option value="Electronics">Electronics & Tech Devices</option>
                          <option value="Home Goods">Furniture & Home Decor</option>
                          <option value="Plastic/Packaging">Plastic / Packaged Items</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Item Count</label>
                        <input
                          type="number"
                          value={activityForm.itemsCount}
                          onChange={(e) => setActivityForm({ ...activityForm, itemsCount: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="form-group">
                <label>Custom Log Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Drove to the local supermarket"
                  value={activityForm.detail}
                  onChange={(e) => setActivityForm({ ...activityForm, detail: e.target.value })}
                />
              </div>

              {/* Dynamic Carbon Offset Preview */}
              <div
                style={{
                  background: "rgba(51, 255, 199, 0.08)",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "1px solid rgba(51, 255, 199, 0.25)",
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Calculated Footprint:</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--primary-glow)" }}>
                  {calculateCarbon()} kg CO₂e
                </span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Append to Logs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
