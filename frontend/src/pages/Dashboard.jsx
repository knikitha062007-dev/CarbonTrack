import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ReportCenter from "../components/ReportCenter";
import Certificate from "./Certificate";
import LightThemeBG from "../components/LightThemeBG";
import DarkThemeBG from "../components/DarkThemeBG";
import PodiumBadge from "../components/PodiumBadge";
import GoogleTranslate from "../components/GoogleTranslate";

import api from "../services/api";
import { FaPen } from "react-icons/fa";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaLeaf,
  FaCar,
  FaBolt,
  FaUtensils,
  FaShoppingBag,
  FaChartLine,
  FaHistory,
  FaUser,
  FaUsers,
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


function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dashboard, setDashboard] = useState(null);
  const [userCount, setUserCount] = useState(0);
  // Load User Info from localStorage with safe fallbacks
  const [userInfo, setUserInfo] = useState({
    id: localStorage.getItem("id") ? Number(localStorage.getItem("id")) : null,
    fullName: localStorage.getItem("fullName") || "Eco Warrior",
    email: localStorage.getItem("email") || "warrior@carbontracker.com",
    goal: parseFloat(localStorage.getItem("co2Goal")) || 500,
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const getAnonymousName = (rank) => {
    return `ECO-${String(rank).padStart(4, "0")}`;
  };
  const [search, setSearch] = useState("");
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [language, setLanguage] = useState(
      localStorage.getItem("language") || "English"
  );
  const [weeklyChart, setWeeklyChart] = useState([]);
  useEffect(() => {
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

  // Current active tab state: 'dashboard', 'activities', 'reports', 'profile'
  const [activeTab, setActiveTab] = useState("dashboard");
  const [monthlyEmission, setMonthlyEmission] = useState([]);
  // Custom greeting based on time of day
  const [greeting, setGreeting] = useState("Welcome");
  const [chartView, setChartView] = useState("week");
  const [monthlyChart, setMonthlyChart] = useState([]);
  const [comparison, setComparison] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
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
  const [monthlyData, setMonthlyData] = useState([]);

  // Search and filter state for Activities Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Interactive profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: userInfo.fullName,
    email: userInfo.email,
    goal: userInfo.goal,
    showName:false,
  });

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState("");

  // Simulated reports loading state
  const [isExporting, setIsExporting] = useState(false);
  const [fromDate, setFromDate] = useState("2026-08-01");
  const [toDate, setToDate] = useState("2026-08-31");
  const [email, setEmail] = useState(userInfo.email || "");
  const [reportLoading, setReportLoading] = useState(false);

  // List of professional eco tips
  const ecoTips = [
    "Your transport emissions are making progress! Swapping one car commute for public transit saves 15kg of CO₂ weekly.",
    "Did you know? Setting your AC thermostat 1°C higher can reduce its electricity usage by up to 10%.",
    "Adopting a plant-based diet even one day a week reduces your individual food water footprint by 20% and emissions by 8kg.",
    "Fast fashion has a heavy footprint. Extending clothes lifespan by 9 months reduces carbon, waste, and water footprints by 20-30%.",
    "Unplugging chargers and devices when not in use stops 'phantom loads' and saves up to 50kg CO₂ annually.",
  ];
  const [editingId, setEditingId] = useState(null);

  // Set greeting based on time of day — re-run when language changes
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting(t("dashboard.goodMorning"));
    else if (hours < 18) setGreeting(t("dashboard.goodAfternoon"));
    else setGreeting(t("dashboard.goodEvening"));
  }, [t]);

  // Rotate eco tips automatically every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ecoTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
// Fetch activities from backend when dashboard loads

  const fetchActivities = async () => {
    try {
      const response = await api.get("/activities");

      console.log("Activities from backend:", response.data);

      setActivities(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await api.delete(`/activities/${id}`);

      triggerToast(t("toast.activityDeleted"));

      await fetchActivities();
      await fetchDashboard();
      await fetchLeaderboard();

    } catch (error) {
      console.error(error);
      triggerToast(t("toast.deleteFailed"));
    }
  };
  const handleEditActivity = (activity) => {

    setEditingId(activity.id);

    setActivityForm({
      type: activity.activityType === "TRANSPORT"
          ? "Transport"
          : activity.activityType === "ELECTRICITY"
              ? "Electricity"
              : activity.activityType === "FOOD"
                  ? "Food"
                  : "Shopping",

      detail: "",
      calcMode: "auto",
      manualValue: "",

      distance: activity.unit === "km" ? activity.quantity : "",
      hours: activity.unit === "hours" ? activity.quantity : "",
      itemsCount: activity.unit === "item" ? activity.quantity : "",

      transportMode:
          activity.activityType === "TRANSPORT"
              ? activity.subType
              : "Petrol Car",

      appliance:
          activity.activityType === "ELECTRICITY"
              ? activity.subType
              : "Desktop PC",

      mealType:
          activity.activityType === "FOOD"
              ? activity.subType
              : "Vegetarian",

      shoppingCat:
          activity.activityType === "SHOPPING"
              ? activity.subType
              : "Clothing",
    });

    setIsModalOpen(true);
  };

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");

      console.log("Dashboard =", response.data);

      setDashboard(response.data);

    } catch (error) {
      console.error(error);
    }
  };
  const fetchWeeklyChart = async () => {
    try {
      const response = await api.get("/dashboard/weekly");
      setWeeklyChart(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchMonthlyChart = async () => {
    try {
      const res = await api.get("/dashboard/monthly");
      setMonthlyChart(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchComparison = async () => {
    try {
      const response = await api.get("/comparison");

      console.log("Comparison =", response.data);

      setComparison(response.data);

    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserCount = async () => {
    try {
      const response = await api.get("/users/count");

      console.log("User Count =", response.data);

      setUserCount(response.data.count);

    } catch (error) {
      console.error(error);
    }
  };
  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("fullName", response.data.fullName);
      localStorage.setItem("email", response.data.email);
      setUserInfo(prev => ({
        ...prev,
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
      }));
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const fetchLeaderboard = async () => {
    setIsLeaderboardLoading(true);
    try {
      const response = await api.get("/leaderboard");
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchDashboard();
    fetchUserCount();
    fetchWeeklyChart();
    fetchMonthlyChart();
    fetchComparison();   // <-- add this line
    fetchProfile();
    fetchLeaderboard();
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
    triggerToast(t("toast.loggingOut"));
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // Base emissions (historical baselines) + calculated from active activities list
  const catStats = {
    Transport: dashboard?.transportEmission || 0,
    Electricity: dashboard?.electricityEmission || 0,
    Food: dashboard?.foodEmission || 0,
    Shopping: dashboard?.shoppingEmission || 0,
  };

  const totalEmissions = dashboard?.totalEmission || 0;

  const goal = dashboard?.goal || userInfo.goal || 500;

  const goalPercentage = dashboard?.goalPercentage || 0;
  const progressPercent = goalPercentage;

  const isOverGoal = progressPercent >= 100;

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
        unit:
            activityForm.type === "Transport"
                ? "km"
                : activityForm.type === "Electricity"
                    ? "hours"
                    : activityForm.type === "Shopping"
                        ? "item"
                        : "meal",
        subType:
            activityForm.type === "Transport"
                ? activityForm.transportMode
                : activityForm.type === "Electricity"
                    ? activityForm.appliance
                    : activityForm.type === "Food"
                        ? activityForm.mealType
                        : activityForm.shoppingCat,
      };
      console.log("PAYLOAD =", payload);
      if (editingId) {
        await api.put(`/activities/${editingId}`, payload);
      } else {
        await api.post("/activities", payload);
      }

      await fetchActivities();
      await fetchDashboard();
      await fetchLeaderboard();
      setEditingId(null);

      setIsModalOpen(false);

      triggerToast(editingId ? t("toast.activityUpdated") : t("toast.activityAdded"));

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

      triggerToast(t("toast.activityFailed"));
    }
  };



  // Save profile modifications
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put("/users/profile", {
        fullName: profileForm.fullName,
        email: profileForm.email,
        preferredUnit: "kg",
        goalVisibility: true,
        co2Goal: parseFloat(profileForm.goal),
        showNameOnLeaderboard: profileForm.showName
      });
      setUserInfo({
        fullName: response.data.fullName,
        email: response.data.email,
        goal: response.data.co2Goal,
      });

      localStorage.setItem("fullName", response.data.fullName);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("co2Goal", response.data.co2Goal);

      await fetchProfile();
      await fetchDashboard();

      triggerToast(t("toast.profileUpdated"));

    } catch (error) {
      console.error(error);
      triggerToast(t("toast.profileFailed"));
    }
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
  const downloadPdf = async () => {
    // PDF code
  };

  const downloadExcel = async () => {
    // Excel code
  };

  const sendEmail = async () => {
    // Email code
  };



  // Chart 1: Weekly emissions summary (Area chart with smooth spline)
  // Let's dynamically map activities to standard days of week
  const getWeeklyData = () => {
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    const baseEmissions = days.map(day => {
      const found = weeklyChart.find(item => item.day === day);
      return found ? found.emission : 0;
    });

    const isDark = theme === "dark";
    const primaryColor = isDark ? "#33FFC7" : "#10b981";
    const gradStart = isDark ? "rgba(51, 255, 199, 0.45)" : "rgba(16, 185, 129, 0.45)";
    const gradEnd = isDark ? "rgba(51, 255, 199, 0.0)" : "rgba(16, 185, 129, 0.0)";

    return {
      labels: days,
      datasets: [
        {
          label: "Carbon Footprint (kg CO₂e)",
          data: baseEmissions.map((v) => parseFloat(v.toFixed(1))),
          borderColor: primaryColor,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, gradStart);
            gradient.addColorStop(1, gradEnd);
            return gradient;
          },
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: isDark ? "#ffffff" : "#0f172a",
          pointBorderColor: primaryColor,
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: primaryColor,
          pointHoverBorderColor: isDark ? "#ffffff" : "#0f172a",
          pointHoverBorderWidth: 3,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    animation: {
      duration: 1600,
      easing: "easeOutQuart",
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor:
            theme === "dark"
                ? "rgba(18,24,38,0.95)"
                : "rgba(255,255,255,0.96)",

        titleColor:
            theme === "dark"
                ? "#33FFC7"
                : "#10b981",

        bodyColor:
            theme === "dark"
                ? "#ffffff"
                : "#0f172a",

        borderColor:
            theme === "dark"
                ? "#33FFC7"
                : "#10b981",

        borderWidth: 1,

        cornerRadius: 14,

        padding: 14,

        displayColors: false,

        titleFont: {
          size: 14,
          weight: "bold",
        },

        bodyFont: {
          size: 13,
        },
      },
    },

    scales: {

      x: {

        grid: {
          display: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color:
              theme === "dark"
                  ? "#94A3B8"
                  : "#475569",

          font: {
            size: 13,
            weight: "600",
          },
        },
      },

      y: {

        beginAtZero: true,
        suggestedMax: 25,

        border: {
          display: false,
        },

        grid: {
          color:
              theme === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",

          drawTicks: false,
        },

        ticks: {

          stepSize: 5,

          color:
              theme === "dark"
                  ? "#94A3B8"
                  : "#475569",

          font: {
            size: 12,
            weight: "600",
          },
        },
      },
    },

    elements: {

      line: {

        tension: 0.45,

        borderWidth: 4,
      },

      point: {

        radius: 5,

        hoverRadius: 8,

        borderWidth: 3,

        hoverBorderWidth: 5,

        backgroundColor:
            theme === "dark"
                ? "#33FFC7"
                : "#10b981",

        borderColor: "#ffffff",
      },
    },
  };

  // Chart 2: Monthly Comparison (Reports page)
  const getMonthlyData = () => {

    return {
      labels: monthlyEmission.map(item => item.month),

      datasets: [
        {
          label: "Monthly Carbon Emission",
          data: monthlyEmission.map(item => item.emission),
          borderWidth: 2,
        }
      ]
    };
  };

  const monthlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: theme === "dark" ? "#ffffff" : "#0f172a", font: { weight: "600" } },
        position: "top",
      },
      tooltip: {
        backgroundColor: theme === "dark" ? "rgba(10, 20, 30, 0.95)" : "rgba(255, 255, 255, 0.98)",
        titleColor: theme === "dark" ? "#33FFC7" : "#10b981",
        bodyColor: theme === "dark" ? "#ffffff" : "#0f172a",
        borderColor: theme === "dark" ? "rgba(51, 255, 199, 0.3)" : "rgba(16, 185, 129, 0.2)",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: theme === "dark" ? "#94a3b8" : "#334155", font: { weight: "600" } },
      },
      y: {
        grid: { color: theme === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.05)" },
        ticks: { color: theme === "dark" ? "#94a3b8" : "#334155", font: { weight: "600" } },
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

  // Calculate streak and calendar week indicators
  const getStreakInfo = () => {
    if (!activities || activities.length === 0) {
      return {
        maxStreak: 0,
        ongoingStreak: 0,
        hasSevenDayStreak: false,
        isCarbonHero: false,
        weekStatus: [false, false, false, false, false, false, false]
      };
    }

    // Sort unique date strings
    const dates = activities.map(a => {
      try {
        return new Date(a.createdAt).toISOString().split('T')[0];
      } catch (e) {
        return "";
      }
    }).filter(d => d !== "");
    const uniqueDates = [...new Set(dates)].sort();

    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate = null;

    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr);
      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      }
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
      lastDate = currentDate;
    }

    // Ongoing streak including today
    let ongoingStreak = 0;
    const uniqueDatesSet = new Set(uniqueDates);
    let checkDate = new Date();
    // Normalize checkDate to midnight of local date
    checkDate.setHours(0, 0, 0, 0);

    // Check if user logged today. If not, start check from yesterday.
    const todayStr = checkDate.toISOString().split('T')[0];
    if (!uniqueDatesSet.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (uniqueDatesSet.has(checkStr)) {
        ongoingStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Week indicators: Mon-Sun of current week
    const now = new Date();
    // Monday of current week
    const monday = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const weekStatus = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const dayStr = dayDate.toISOString().split('T')[0];
      weekStatus.push(uniqueDatesSet.has(dayStr));
    }

    // Carbon Hero: daily emissions < 20kg for last 30 days
    // Group all emissions by date string
    const dailyEmissions = {};
    activities.forEach(a => {
      try {
        const dateStr = new Date(a.createdAt).toISOString().split('T')[0];
        dailyEmissions[dateStr] = (dailyEmissions[dateStr] || 0) + a.emission;
      } catch (e) {}
    });

    let exceeded = false;
    const nowTime = new Date();
    for (let i = 0; i < 30; i++) {
      const tempDate = new Date();
      tempDate.setDate(nowTime.getDate() - i);
      const tempStr = tempDate.toISOString().split('T')[0];
      if ((dailyEmissions[tempStr] || 0) > 20.0) {
        exceeded = true;
        break;
      }
    }
    const isCarbonHero = !exceeded && activities.length > 0;

    return {
      maxStreak,
      ongoingStreak,
      hasSevenDayStreak: maxStreak >= 7,
      isCarbonHero,
      weekStatus
    };
  };

  const streakInfo = getStreakInfo();

  const myUserId = userInfo.id;
  const myRank = leaderboard.findIndex(u => u.id === myUserId || u.name === userInfo.fullName) + 1;
  const totalUsers = leaderboard.length || 1;
  const percentile = myRank > 0 ? Math.ceil((myRank / totalUsers) * 100) : 100;

  // Calculate badges unlocked dynamically
  const userBadges = [
    {
      id: "b1",
      name: "Eco Beginner",
      desc: "Logged first carbon activity.",
      unlocked: activities.length > 0,
      icon: "🌱",
    },
    {
      id: "b2",
      name: "Green Commuter",
      desc: "Maintain transport emissions under 50 kg CO₂.",
      unlocked: activities.some(a => a.activityType === "TRANSPORT") && catStats.Transport < 50.0,
      icon: "🚶",
    },
    {
      id: "b3",
      name: "Energy Saver",
      desc: "Keep electricity emissions under 80 kg CO₂.",
      unlocked: activities.some(a => a.activityType === "ELECTRICITY") && catStats.Electricity < 80.0,
      icon: "⚡",
    },
    {
      id: "b4",
      name: "Sustainable Eater",
      desc: "Select low impact foods (under 30 kg CO₂ total).",
      unlocked: activities.some(a => a.activityType === "FOOD") && catStats.Food < 30.0,
      icon: "🥗",
    },
    {
      id: "b5",
      name: "Conscious Shopper",
      desc: "Keep shopping emissions under 25 kg CO₂.",
      unlocked: activities.some(a => a.activityType === "SHOPPING") && catStats.Shopping < 25.0,
      icon: "🛍",
    },
    {
      id: "b6",
      name: "7-Day Streak",
      desc: "Logged activities for 7 consecutive days.",
      unlocked: streakInfo.hasSevenDayStreak,
      icon: "🔥",
    },
    {
      id: "b7",
      name: "Carbon Hero",
      desc: "Daily emissions below 20kg for 30 consecutive days.",
      unlocked: streakInfo.isCarbonHero,
      icon: "🌍",
    },
    {
      id: "b8",
      name: "Community Leader",
      desc: "Reach the Top 3 on the community leaderboard.",
      unlocked: myRank > 0 && myRank <= 3,
      icon: "🏆",
    },
  ];

  const unlockedCount = userBadges.filter((b) => b.unlocked).length;
  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyRechartData = monthlyChart.map((item) => ({
    month: monthNames[Number(item.month)],
    emission: Number(item.emission.toFixed(1)),
  }));
  const weeklyRechartData = [
    { day: "Mon", emission: weeklyChart.find(d => d.day === "MON")?.emission || 0 },
    { day: "Tue", emission: weeklyChart.find(d => d.day === "TUE")?.emission || 0 },
    { day: "Wed", emission: weeklyChart.find(d => d.day === "WED")?.emission || 0 },
    { day: "Thu", emission: weeklyChart.find(d => d.day === "THU")?.emission || 0 },
    { day: "Fri", emission: weeklyChart.find(d => d.day === "FRI")?.emission || 0 },
    { day: "Sat", emission: weeklyChart.find(d => d.day === "SAT")?.emission || 0 },
    { day: "Sun", emission: weeklyChart.find(d => d.day === "SUN")?.emission || 0 },
  ];
  const topThree = leaderboard.slice(0, 3);
  const pieChartData = [
    {
      name: "Transport",
      value: Number(catStats.Transport.toFixed(1)),
      color: "#3B82F6",
    },
    {
      name: "Electricity",
      value: Number(catStats.Electricity.toFixed(1)),
      color: "#FACC15",
    },
    {
      name: "Food",
      value: Number(catStats.Food.toFixed(1)),
      color: "#F97316",
    },
    {
      name: "Shopping",
      value: Number(catStats.Shopping.toFixed(1)),
      color: "#A855F7",
    },
  ];
  return (
      <div className={`dashboard-container theme-${theme} ${theme === 'dark' ? 'dark' : ''}`}>
        {/* Light Theme 3D Eco Background — renders only in light mode */}
        <LightThemeBG theme={theme} />
        {/* Dark Theme Floating Leaves — renders only in dark mode */}
        <DarkThemeBG theme={theme} />
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
              <span className="profile-role">{t("sidebar.ecoRank")}: {activities.length===0 ? t("leaderboard.beginner") : `Level ${unlockedCount}`}</span>
            </div>
          </div>

          <ul className="sidebar-menu">
            <li
                className={`sidebar-item ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("dashboard")}
            >
              <FaChartLine className="sidebar-item-icon" />
              <span className="sidebar-item-text">{t("sidebar.dashboard")}</span>
            </li>

            <li
                className={`sidebar-item ${activeTab === "reportCenter" ? "active" : ""}`}
                onClick={() => setActiveTab("reportCenter")}
            >
              <FaChartBar className="sidebar-item-icon" />
              <span className="sidebar-item-text">{t("sidebar.reportsCenter")}</span>
            </li>
            <li
                className={`sidebar-item ${activeTab === "certificate" ? "active" : ""}`}
                onClick={() => setActiveTab("certificate")}
            >
              <span className="sidebar-item-text">🏆 {t("sidebar.certificate")}</span>
            </li>
            <li
                className={`sidebar-item ${activeTab === "activities" ? "active" : ""}`}
                onClick={() => setActiveTab("activities")}
            >
              <FaHistory className="sidebar-item-icon" />
              <span className="sidebar-item-text">{t("sidebar.activities")}</span>
            </li>
            <li
                className={`sidebar-item ${activeTab === "reports" ? "active" : ""}`}
                onClick={() => setActiveTab("reports")}
            >
              <FaTrophy className="sidebar-item-icon" />
              <span className="sidebar-item-text">{t("sidebar.leaderboard")}</span>
            </li>
            <li
                className="sidebar-item"
                onClick={() => navigate("/eco-coach")}
            >
              <FaLeaf className="sidebar-item-icon" />
              <span className="sidebar-item-text">{t("sidebar.ecoCoach")}</span>
            </li>

            <li
                className="sidebar-item"
                onClick={() => navigate("/community")}
            >
              <FaUsers className="sidebar-item-icon" />
              <span className="sidebar-item-text">{t("sidebar.communityFeed")}</span>
            </li>

            <li
                className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => {
                  setProfileForm({
                    fullName: userInfo.fullName,
                    email: userInfo.email,
                    goal: userInfo.goal,
                    showName: userInfo.showName ?? false,
                  });
                  setActiveTab("profile");
                }}
            >
              <FaUser className="sidebar-item-icon" />
              <span className="sidebar-item-text">{t("sidebar.profileSettings")}</span>
            </li>

            <li className="sidebar-item logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="sidebar-item-icon" />
              <span className="sidebar-item-text">{t("sidebar.logOut")}</span>
            </li>
          </ul>
        </aside>

        {/* Main Panel Area */}
        <main className="dashboard-main">
          {/* Page Title & Actions */}
          <div className="page-header">
            <div className="page-title">
              <h1>
                {activeTab === "dashboard" && t("dashboard.title")}
                {activeTab === "activities" && t("dashboard.activitiesTitle")}
                {activeTab === "reports" && t("dashboard.leaderboardTitle")}
                {activeTab === "profile" && t("dashboard.profileTitle")}
              </h1>
              <p>
                {activeTab === "dashboard" && t("dashboard.subtitle")}
                {activeTab === "activities" && t("dashboard.activitiesSub")}
                {activeTab === "reports" && t("dashboard.leaderboardSub")}
                {activeTab === "profile" && t("dashboard.profileSub")}
              </p>
            </div>

            <div className="header-actions">
              <GoogleTranslate theme={theme} />
              <div className="date-badge">
                <FaCalendarAlt style={{ color: "#33FFC7" }} />
                <span>{new Date().toLocaleDateString("en-IN",{
                  weekday:"long",
                  day:"numeric",
                  month:"long",
                  year:"numeric"
                })}</span>
              </div>
              <button className="action-btn-primary"   onClick={() => {
                setEditingId(null);
                setIsModalOpen(true);
              }}>
                <FaPlus />
                <span>{t("dashboard.logActivity")}</span>
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
                      <p>{t("dashboard.welcomeMsg")}</p>
                    </div>
                    <div className="welcome-tip">
                      <FaLeaf className="tip-icon" />
                      <div className="tip-text">
                        <strong>{t("dashboard.dailyEcoTip")}</strong> {ecoTips[tipIndex]}
                      </div>
                    </div>
                  </div>

                  {/* Carbon Footprint Summary Card */}
                  <div className="glass-card summary-card">
                    <div className="summary-title">
                      <h3>{t("dashboard.carbonFootprintSummary")}</h3>
                      <div className={`status-indicator ${isOverGoal ? "warning" : "on-track"}`}>
                        <FaGlobe />
                        <span>{isOverGoal ? t("dashboard.criticalLimit") : t("dashboard.onTrack")}</span>
                      </div>
                    </div>
                    <div className="emission-display">
                      <span className="emission-value">
                        {dashboard ? dashboard.totalEmission.toFixed(2) : "0.00"}
                      </span>
                      <span className="emission-unit">{t("dashboard.kgCO2Total")}</span>
                    </div>
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>{t("dashboard.dailyLimitBudget")}</span>
                        <span>{dashboard ? dashboard.goalPercentage.toFixed(1) : "0"}% {t("dashboard.used")}</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className={`progress-bar-fill ${isOverGoal ? "warning-fill" : ""}`} style={{ width: `${dashboard ? dashboard.goalPercentage : 0}%` }}></div>
                      </div>
                      <div className="progress-header" style={{ marginTop: "8px", fontSize: "11px" }}>
                        <span>0 kg CO₂</span>
                        <span>{t("dashboard.target")}: {dashboard ? dashboard.goal : 500} kg CO₂</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistic Cards Grid */}
                <div className="stats-grid">
                  {/* Transport Card */}
                  <div className="glass-card stat-card transport" onClick={() => setActiveTab("activities")}>
                    <div className="stat-card-header">
                      <span className="stat-title">{t("dashboard.transport")}</span>
                      <div className="stat-icon-wrapper" style={{ "--icon-color-rgb": "59, 130, 246" }}>
                        <FaCar />
                      </div>
                    </div>
                    <div className="stat-value">{catStats.Transport.toFixed(1)} kg</div>
                    <div className="stat-trend decrease">
                      <span>{t("dashboard.basedOnLatest")}</span>
                    </div>
                  </div>

                  {/* Electricity Card */}
                  <div className="glass-card stat-card electricity" onClick={() => setActiveTab("activities")}>
                    <div className="stat-card-header">
                      <span className="stat-title">{t("dashboard.electricity")}</span>
                      <div className="stat-icon-wrapper" style={{ "--icon-color-rgb": "234, 179, 8" }}>
                        <FaBolt />
                      </div>
                    </div>
                    <div className="stat-value">{catStats.Electricity.toFixed(1)} kg</div>
                    <div className="stat-trend increase">
                      <span>{t("dashboard.basedOnLatest")}</span>
                    </div>
                  </div>

                  {/* Food Card */}
                  <div className="glass-card stat-card food" onClick={() => setActiveTab("activities")}>
                    <div className="stat-card-header">
                      <span className="stat-title">{t("dashboard.foodChoice")}</span>
                      <div className="stat-icon-wrapper" style={{ "--icon-color-rgb": "249, 115, 22" }}>
                        <FaUtensils />
                      </div>
                    </div>
                    <div className="stat-value">{catStats.Food.toFixed(1)} kg</div>
                    <div className="stat-trend decrease">
                      <span>{t("dashboard.basedOnLatest")}</span>
                    </div>
                  </div>

                  {/* Shopping Card */}
                  <div className="glass-card stat-card shopping" onClick={() => setActiveTab("activities")}>
                    <div className="stat-card-header">
                      <span className="stat-title">{t("dashboard.shoppingGoods")}</span>
                      <div className="stat-icon-wrapper" style={{ "--icon-color-rgb": "168, 85, 247" }}>
                        <FaShoppingBag />
                      </div>
                    </div>
                    <div className="stat-value">{catStats.Shopping.toFixed(1)} kg</div>
                    <div className="stat-trend decrease">
                      <span>{t("dashboard.basedOnLatest")}</span>
                    </div>
                  </div>
                </div>
                {/* ── Goal Progress Card — REDESIGNED ── */}
                <div className="gp2-wrapper glass-card">
                  {/* Header row */}
                  <div className="gp2-header">
                    <div className="gp2-title-group">
                      <span className="gp2-icon">🎯</span>
                      <div>
                        <h3 className="gp2-title">{t("dashboard.goalProgress")}</h3>
                        <p className="gp2-subtitle">Track your journey towards a greener future</p>
                      </div>
                    </div>
                    <span className={`gp2-status-pill ${progressPercent < 80 ? "pill-safe" : "pill-danger"}`}>
                      <span className="gp2-status-dot" />
                      {progressPercent < 50 ? t("dashboard.safe") : progressPercent < 80 ? t("dashboard.warn") : t("dashboard.danger")}
                    </span>
                  </div>

                  {/* Main body: ring + right info */}
                  <div className="gp2-body">
                    {/* Circular ring */}
                    <div className="gp2-ring-container">
                      <svg className="gp2-ring-svg" viewBox="0 0 200 200">
                        <defs>
                          <linearGradient id="gpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#33FFC7" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                          <filter id="gpGlow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                          </filter>
                        </defs>
                        {/* Track */}
                        <circle cx="100" cy="100" r="80" fill="none"
                          stroke={theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                          strokeWidth="14" />
                        {/* Progress arc */}
                        <circle cx="100" cy="100" r="80" fill="none"
                          stroke="url(#gpGrad)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 80}`}
                          strokeDashoffset={`${2 * Math.PI * 80 * (1 - Math.min(progressPercent, 100) / 100)}`}
                          transform="rotate(-90 100 100)"
                          filter="url(#gpGlow)"
                          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                        />
                        {/* Glow dot at tip */}
                        <circle cx="100" cy="20" r="7" fill="#33FFC7" opacity="0.9"
                          transform={`rotate(${progressPercent * 3.6 - 90} 100 100)`}
                          style={{ transition: "transform 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                        />
                      </svg>
                      {/* Center content */}
                      <div className="gp2-ring-center">
                        <span className="gp2-leaf-icon">🌿</span>
                        <span className="gp2-ring-value">{totalEmissions.toFixed(1)}</span>
                        <span className="gp2-ring-unit">of {goal} kg</span>
                      </div>
                    </div>

                    {/* Right info panel */}
                    <div className="gp2-info-panel">
                      <div className="gp2-info-top">
                        <p className="gp2-daily-label">{t("dashboard.goal")}</p>
                        <div className="gp2-daily-value">{goal} <span>kg CO₂e</span></div>
                        <p className={`gp2-motivational ${progressPercent < 50 ? "motiv-green" : progressPercent < 80 ? "motiv-yellow" : "motiv-red"}`}>
                          {progressPercent < 50
                            ? "You're doing great! Keep it up."
                            : progressPercent < 80
                              ? "Getting close — stay mindful."
                              : "Reduce emissions to meet your goal."}
                        </p>
                      </div>

                      {/* Slim progress bar */}
                      <div className="gp2-bar-wrap">
                        <div className="gp2-bar-track">
                          <div
                            className={`gp2-bar-fill ${progressPercent < 50 ? "fill-safe" : progressPercent < 80 ? "fill-warn" : "fill-danger"}`}
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                          />
                        </div>
                        <div className="gp2-bar-labels">
                          <span>{progressPercent.toFixed(1)}% of daily goal</span>
                          <span>{Math.max(0, goal - totalEmissions).toFixed(1)} kg remaining</span>
                        </div>
                      </div>

                      {/* 3 stat mini-cards */}
                      <div className="gp2-mini-cards">
                        <div className="gp2-mini-card">
                          <span className="gp2-mini-icon" style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>📈</span>
                          <div>
                            <div className="gp2-mini-lbl">{t("dashboard.current")}</div>
                            <div className="gp2-mini-val">{totalEmissions.toFixed(1)} kg</div>
                            <div className="gp2-mini-sub">Today</div>
                          </div>
                        </div>
                        <div className="gp2-mini-card">
                          <span className="gp2-mini-icon" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>🏆</span>
                          <div>
                            <div className="gp2-mini-lbl">Best Streak</div>
                            <div className="gp2-mini-val">{streakInfo.ongoingStreak} <span style={{fontSize:"13px"}}>Days</span></div>
                            <div className="gp2-mini-sub">Keep it going!</div>
                          </div>
                        </div>
                        <div className="gp2-mini-card">
                          <span className="gp2-mini-icon" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>🌱</span>
                          <div>
                            <div className="gp2-mini-lbl">{t("dashboard.remaining")}</div>
                            <div className="gp2-mini-val">{Math.max(0, goal - totalEmissions).toFixed(1)} kg</div>
                            <div className="gp2-mini-sub">Available</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Emission Comparison Card — REDESIGNED ── */}
                <div className="ec2-wrapper glass-card">
                  {/* Header */}
                  <div className="ec2-header">
                    <div className="ec2-title-group">
                      <span className="ec2-leaf">🌿</span>
                      <div>
                        <h3 className="ec2-title">{t("dashboard.emissionComparison")}</h3>
                        <p className="ec2-subtitle">Visualize and compare your emissions over time</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary cards row */}
                  <div className="ec2-cards-row">
                    {/* Today vs Yesterday */}
                    <div className="ec2-card" style={{ "--ec-accent": "#33FFC7" }}>
                      <div className="ec2-card-top">
                        <div>
                          <div className="ec2-card-period">{t("dashboard.today")}</div>
                          <div className="ec2-card-sub">vs {t("dashboard.yesterday")}</div>
                        </div>
                        <div className="ec2-card-icon">📅</div>
                      </div>
                      <div className="ec2-card-value">{(comparison?.today ?? 0).toFixed(2)} kg</div>
                      {(() => {
                        const curr = comparison?.today ?? 0;
                        const prev = comparison?.yesterday ?? 0;
                        const diff = prev > 0 ? ((curr - prev) / prev * 100) : 0;
                        const better = curr <= prev;
                        return (
                          <>
                            <div className={`ec2-card-change ${better ? "change-good" : "change-bad"}`}>
                              {better ? "↓" : "↑"} {Math.abs(diff).toFixed(1)}%
                            </div>
                            <div className="ec2-card-status">{better ? "Better than yesterday" : "More than yesterday"}</div>
                          </>
                        );
                      })()}
                    </div>

                    {/* This Week vs Last Week */}
                    <div className="ec2-card" style={{ "--ec-accent": "#818cf8" }}>
                      <div className="ec2-card-top">
                        <div>
                          <div className="ec2-card-period">{t("dashboard.thisWeek")}</div>
                          <div className="ec2-card-sub">vs {t("dashboard.lastWeek")}</div>
                        </div>
                        <div className="ec2-card-icon" style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8" }}>📆</div>
                      </div>
                      <div className="ec2-card-value">{(comparison?.thisWeek ?? 0).toFixed(2)} kg</div>
                      {(() => {
                        const curr = comparison?.thisWeek ?? 0;
                        const prev = comparison?.lastWeek ?? 0;
                        const diff = prev > 0 ? ((curr - prev) / prev * 100) : 0;
                        const better = curr <= prev;
                        return (
                          <>
                            <div className={`ec2-card-change ${better ? "change-good" : "change-bad"}`}>
                              {better ? "↓" : "↑"} {Math.abs(diff).toFixed(1)}%
                            </div>
                            <div className="ec2-card-status">{better ? "Better than last week" : "More than last week"}</div>
                          </>
                        );
                      })()}
                    </div>

                    {/* This Month vs Last Month */}
                    <div className="ec2-card" style={{ "--ec-accent": "#f59e0b" }}>
                      <div className="ec2-card-top">
                        <div>
                          <div className="ec2-card-period">{t("dashboard.thisMonth")}</div>
                          <div className="ec2-card-sub">vs {t("dashboard.lastMonth")}</div>
                        </div>
                        <div className="ec2-card-icon" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>🗓️</div>
                      </div>
                      <div className="ec2-card-value">{(comparison?.thisMonth ?? 0).toFixed(2)} kg</div>
                      {(() => {
                        const curr = comparison?.thisMonth ?? 0;
                        const prev = comparison?.lastMonth ?? 0;
                        const diff = prev > 0 ? ((curr - prev) / prev * 100) : 0;
                        const better = curr <= prev;
                        return (
                          <>
                            <div className={`ec2-card-change ${better ? "change-good" : "change-bad"}`}>
                              {better ? "↓" : "↑"} {Math.abs(diff).toFixed(1)}%
                            </div>
                            <div className="ec2-card-status">{better ? "Better than last month" : "More than last month"}</div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Total Emissions */}
                    <div className="ec2-card" style={{ "--ec-accent": "#f97316" }}>
                      <div className="ec2-card-top">
                        <div>
                          <div className="ec2-card-period">Total Emissions</div>
                          <div className="ec2-card-sub">All Time</div>
                        </div>
                        <div className="ec2-card-icon" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>☁️</div>
                      </div>
                      <div className="ec2-card-value">{totalEmissions.toFixed(2)} kg</div>
                      <div className="ec2-card-change change-neutral">— recorded</div>
                      <div className="ec2-card-status">Total recorded</div>
                    </div>
                  </div>

                  {/* Comparison chart */}
                  <div className="ec2-chart-section">
                    <div className="ec2-chart-legend">
                      <span className="ec2-legend-dot" style={{ background: "#33FFC7" }} /> {t("dashboard.currentPeriod")}
                      <span className="ec2-legend-dot" style={{ background: "#818cf8", marginLeft: "18px" }} /> {t("dashboard.previousPeriod")}
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart
                        data={[
                          { label: t("dashboard.todayVsYesterday"),   current: comparison?.today ?? 0,     previous: comparison?.yesterday ?? 0 },
                          { label: t("dashboard.thisWeekVsLast"),     current: comparison?.thisWeek ?? 0,  previous: comparison?.lastWeek ?? 0 },
                          { label: t("dashboard.thisMonthVsLast"),    current: comparison?.thisMonth ?? 0, previous: comparison?.lastMonth ?? 0 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="ecGradCurrent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#33FFC7" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#33FFC7" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="ecGradPrev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3"
                          stroke={theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} />
                        <XAxis dataKey="label"
                          tick={{ fill: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: 12 }} />
                        <YAxis tick={{ fill: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: 11 }} />
                        <RechartsTooltip
                          contentStyle={{
                            background: theme === "dark" ? "rgba(10,16,32,0.97)" : "#ffffff",
                            border: "1px solid rgba(51,255,199,0.2)",
                            borderRadius: "12px",
                          }}
                          labelStyle={{ color: theme === "dark" ? "#ffffff" : "#1e293b" }}
                        />
                        <Area type="monotone" dataKey="previous" stroke="#818cf8" strokeWidth={2.5}
                          fill="url(#ecGradPrev)" dot={{ fill: "#818cf8", r: 4 }} />
                        <Area type="monotone" dataKey="current" stroke="#33FFC7" strokeWidth={3}
                          fill="url(#ecGradCurrent)" dot={{ fill: "#33FFC7", r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bottom motivational row */}
                  <div className="ec2-bottom-row">
                    <div className="ec2-reduce-badge">
                      <span>🌿</span>
                      <span>Reducing emissions one step at a time!</span>
                    </div>
                    <button className="ec2-report-btn" onClick={() => setActiveTab("reportCenter")}>
                      View Detailed Report →
                    </button>
                  </div>
                </div>
                {/* ================= AI Assistant Card ================= */}

                <div className="glass-card ai-dashboard-card">

                  <div className="ai-left">

                    <div className="ai-title">{t("dashboard.ecoAssistant")}</div>
                    <p>{t("dashboard.aiDesc")}</p>
                    <button className="ask-ai-btn" onClick={() => navigate("/eco-coach")}>
                      {t("dashboard.askEcoAI")}
                    </button>

                  </div>

                  <div className="ai-right">

                    <DotLottieReact
                        src="https://lottie.host/745d3bfc-8a8e-4790-bf40-f7342d237010/mwVCCUjLAu.lottie"
                        loop
                        autoplay
                        style={{
                          width: 140,
                          height: 140
                        }}
                    />

                  </div>

                </div>
                {/* Middle Section: Chart + Breakdowns */}
                <div className="visuals-grid">
                  {/* Weekly Chart */}
                  <div className="glass-card">
                    <div className="chart-card-header">
                      <h3>
                        {chartView === "week" ? t("dashboard.weeklyEmissions") : t("dashboard.monthlyEmissions")}
                      </h3>
                      <div className="chart-period-selector">
                        <button className={`period-btn ${chartView === "week" ? "active" : ""}`} onClick={() => setChartView("week")}>
                          {t("dashboard.weekMon")} - {t("dashboard.weekSun")}
                        </button>
                        <button className={`period-btn ${chartView === "month" ? "active" : ""}`} onClick={() => setChartView("month")}>
                          {t("dashboard.monthlyEmissions")}
                        </button>
                      </div>
                    </div>
                    <div
                        className="chart-canvas-container"
                        style={{ width: "100%", height: "340px" }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartView === "week" ? weeklyRechartData : monthlyRechartData}
                        >

                          <defs>
                            <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                  offset="5%"
                                  stopColor={theme === "dark" ? "#33FFC7" : "#10b981"}
                                  stopOpacity={0.55}
                              />
                              <stop
                                  offset="95%"
                                  stopColor={theme === "dark" ? "#33FFC7" : "#10b981"}
                                  stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                              strokeDasharray="3 3"
                              stroke={theme === "dark"
                                  ? "rgba(255,255,255,0.06)"
                                  : "rgba(0,0,0,0.08)"}
                          />

                          <XAxis
                              dataKey={chartView === "week" ? "day" : "month"}
                              tick={{ fill: theme === "dark" ? "#94A3B8" : "#475569" }}
                          />

                          <YAxis
                              tick={{ fill: theme === "dark" ? "#94A3B8" : "#475569" }}
                          />

                          <RechartsTooltip />

                          <Area
                              type="monotone"
                              dataKey="emission"
                              stroke={theme === "dark" ? "#33FFC7" : "#10b981"}
                              strokeWidth={4}
                              fill="url(#carbonGradient)"
                          />

                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Breakdown Card */}
                  <div className="glass-card breakdown-card">
                    <div className="chart-card-header">
                      <h3>{t("dashboard.emissionBreakdown")}</h3>
                    </div>
                    <div
                        style={{
                          height: "260px",
                          width: "100%",
                          marginBottom: "15px",
                        }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>

                          <Pie
                              data={pieChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={58}
                              outerRadius={82}
                              paddingAngle={4}
                              cornerRadius={8}
                          >
                            {pieChartData.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={entry.color}
                                    stroke={theme === "dark" ? "#0f172a" : "#ffffff"}
                                    strokeWidth={2}
                                />
                            ))}
                          </Pie>

                          <RechartsTooltip
                              formatter={(value) => [`${value} kg CO₂e`, "Emission"]}
                          />

                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="breakdown-list">
                      <div className="breakdown-item">
                        <div className="breakdown-label-group">
                          <div className="breakdown-color-dot" style={{ background: "rgba(59, 130, 246, 0.8)" }}></div>
                          <span className="breakdown-label">{t("dashboard.transport")}</span>
                        </div>
                        <div className="breakdown-details">
                          <div className="breakdown-val">{catStats.Transport.toFixed(1)} kg</div>
                          <div className="breakdown-pct">
                            {totalEmissions > 0
                                ? ((catStats.Transport / totalEmissions) * 100).toFixed(1)
                                : 0}%
                          </div>
                        </div>
                      </div>

                      <div className="breakdown-item">
                        <div className="breakdown-label-group">
                          <div className="breakdown-color-dot" style={{ background: "rgba(234, 179, 8, 0.8)" }}></div>
                          <span className="breakdown-label">{t("dashboard.electricity")}</span>
                        </div>
                        <div className="breakdown-details">
                          <div className="breakdown-val">{catStats.Electricity.toFixed(1)} kg</div>
                          <div className="breakdown-pct">
                            {totalEmissions > 0
                                ? ((catStats.Electricity/ totalEmissions) * 100).toFixed(1)
                                : 0}%
                          </div>
                        </div>
                      </div>

                      <div className="breakdown-item">
                        <div className="breakdown-label-group">
                          <div className="breakdown-color-dot" style={{ background: "rgba(249, 115, 22, 0.8)" }}></div>
                          <span className="breakdown-label">{t("dashboard.foodChoice")}</span>
                        </div>
                        <div className="breakdown-details">
                          <div className="breakdown-val">{catStats.Food.toFixed(1)} kg</div>
                          <div className="breakdown-pct">
                            {totalEmissions > 0
                                ? ((catStats.Food / totalEmissions) * 100).toFixed(1)
                                : 0}%
                          </div>
                        </div>
                      </div>

                      <div className="breakdown-item">
                        <div className="breakdown-label-group">
                          <div className="breakdown-color-dot" style={{ background: "rgba(168, 85, 247, 0.8)" }}></div>
                          <span className="breakdown-label">{t("dashboard.shoppingGoods")}</span>
                        </div>
                        <div className="breakdown-details">
                          <div className="breakdown-val">{catStats.Shopping.toFixed(1)} kg</div>
                          <div className="breakdown-pct">
                            {totalEmissions > 0
                                ? ((catStats.Shopping / totalEmissions) * 100).toFixed(1)
                                : 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities Section */}
                <div className="glass-card table-card">
                  <div className="table-header">
                    <h3>{t("dashboard.recentActivities")}</h3>
                    <button className="table-view-all" onClick={() => setActiveTab("activities")}>
                      <span>{t("dashboard.seeFullLog")}</span>
                      <FaChevronRight style={{ fontSize: "11px" }} />
                    </button>
                  </div>
                  <div className="table-container">
                    <table className="activities-table">
                      <thead>
                      <tr>
                        <th>{t("dashboard.activityType")}</th>
                        <th>{t("dashboard.loggedDetails")}</th>
                        <th>{t("dashboard.carbonImpact")}</th>
                        <th>{t("dashboard.dateTime")}</th>
                        <th>{t("dashboard.actions")}</th>
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
                      borderBottom: "1px solid var(--card-border)",
                      paddingBottom: "20px",
                    }}
                >
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {[t("activities.all"), t("activities.transport"), t("activities.electricity"), t("activities.food"), t("activities.shopping")].map((cat, idx) => {
                      const vals = ["All","Transport","Electricity","Food","Shopping"];
                      return (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(vals[idx])}
                            style={{
                              background: categoryFilter === vals[idx] ? "var(--primary-glow)" : "var(--input-bg)",
                              color: categoryFilter === vals[idx] ? "var(--sidebar-item-active-text)" : "var(--text-primary)",
                              border: "1px solid var(--input-border)",
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
                      );
                    })}
                  </div>

                  <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        placeholder={t("activities.searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          background: "var(--input-bg)",
                          border: "1px solid var(--input-border)",
                          borderRadius: "30px",
                          padding: "10px 20px",
                          color: "var(--text-primary)",
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
                          <th>{t("activities.activityType")}</th>
                          <th>{t("activities.loggedDetails")}</th>
                          <th>{t("activities.carbonImpact")}</th>
                          <th>{t("activities.dateTime")}</th>
                          <th>{t("activities.actions")}</th>
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

                                    {act.emission ? act.emission.toFixed(2) : "0.00"} kg CO₂e

                                  </td>

                                  <td>

                                    {new Date(act.createdAt).toLocaleDateString()}

                                    <br/>

                                    {new Date(act.createdAt).toLocaleTimeString()}

                                  </td>

                                  <td className="action-buttons">
                                    <button
                                        className="action-icon-btn edit"
                                        title="Edit Activity"
                                        onClick={() => handleEditActivity(act)}
                                    >
                                      <FaPen />
                                    </button>

                                    <button
                                        className="action-icon-btn delete"
                                        title="Delete Activity"
                                        onClick={() => handleDeleteActivity(act.id)}
                                    >
                                      <FaTrash />
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
                        <h3 style={{ fontSize: "18px", color: "var(--text-muted)" }}>{t("dashboard.noMatch")}</h3>
                        <button className="btn-primary" style={{ marginTop: "20px" }}
                            onClick={() => { setSearchQuery(""); setCategoryFilter("All"); }}>
                          {t("dashboard.resetFilters")}
                        </button>
                      </div>
                  )}
                </div>
              </div>
          )}

          {/* ─── COMMUNITY LEADERBOARD — REDESIGNED ─── */}
          {activeTab === "reports" && (
            <div className="clb-root">

              {/* Page header */}
              <div className="clb-page-header">
                <div className="clb-page-title-group">
                  <h1 className="clb-page-title">
                    Community <span className="clb-green">Leaderboard</span> 🌿
                  </h1>
                  <p className="clb-page-sub">Together we make Earth a better place 💚</p>
                </div>
                <div className="clb-page-controls">
                  <div className="clb-search-wrap">
                    <span className="clb-search-icon">🔍</span>
                    <input className="clb-search-input" type="text"
                      placeholder={t("leaderboard.searchPlaceholder")}
                      value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* 4 insight cards */}
              <div className="clb-insight-row">
                {[
                  { icon: "🌍", title: "Community Power",  sub: "Every action creates a bigger impact",      color: "#22c55e", bg: "rgba(34,197,94,0.1)"  },
                  { icon: "🌐", title: "Global Impact",    sub: "Together we're building a greener planet",  color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
                  { icon: "💜", title: "Good Vibes",       sub: "Inspire, encourage and grow together",      color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
                  { icon: "⭐", title: "You Matter",       sub: "Your effort makes our community stronger",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                ].map((c, i) => (
                  <motion.div key={i} className="clb-insight-card"
                    style={{ "--ic": c.color, "--ic-bg": c.bg }}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}>
                    <div className="clb-insight-icon">{c.icon}</div>
                    <div className="clb-insight-text">
                      <div className="clb-insight-title">{c.title}</div>
                      <div className="clb-insight-sub">{c.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Leaderboard table card */}
              <div className="clb-table-card">
                {/* Column headers */}
                <div className="clb-col-headers">
                  <div className="clb-ch-rank">RANK</div>
                  <div className="clb-ch-user">USER</div>
                  <div className="clb-ch-badge">BADGE</div>
                  <div className="clb-ch-ecorank">ECO RANK</div>
                  <div className="clb-ch-points">TOTAL POINTS 🌿</div>
                </div>

                {/* Rows */}
                <AnimatePresence mode="wait">
                  <motion.div key={search}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    {leaderboard
                      .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
                      .map((item, index) => {
                        const rank = index + 1;
                        const isMe = item.id === myUserId || item.name === userInfo.fullName;

                        const ECO_RANKS = [
                          { min:1,  max:1,        label:"Green Guardian",  desc:"Protecting the planet",  color:"#22c55e", icon:"🌿" },
                          { min:2,  max:3,        label:"Earth Protector", desc:"Making a big impact",    color:"#3b82f6", icon:"🌍" },
                          { min:4,  max:5,        label:"Nature Lover",    desc:"Spreading good vibes",   color:"#a855f7", icon:"💜" },
                          { min:6,  max:10,       label:"Eco Warrior",     desc:"Taking real action",     color:"#f59e0b", icon:"⚡" },
                          { min:11, max:20,       label:"Change Maker",    desc:"Driving the change",     color:"#06b6d4", icon:"✨" },
                          { min:21, max:40,       label:"Eco Contributor", desc:"Every effort counts",    color:"#84cc16", icon:"🌱" },
                          { min:41, max:Infinity, label:"Eco Starter",     desc:"Just getting started",   color:"#94a3b8", icon:"🌾" },
                        ];
                        const er = ECO_RANKS.find(r => rank >= r.min && rank <= r.max) || ECO_RANKS[ECO_RANKS.length - 1];

                        const pts = Math.max(0, Math.round((500 - (item.totalEmission || 0)) * 4)) + Math.max(0, (100 - rank) * 20);
                        const pct = Math.min(100, Math.round((pts / 3000) * 100));

                        const AV = ["#22c55e","#3b82f6","#a855f7","#f59e0b","#ec4899","#06b6d4","#84cc16","#f97316"];
                        const avColor = AV[item.name.charCodeAt(0) % AV.length];

                        const BS = [
                          { bg:"#FFD700", shadow:"0 0 14px rgba(255,215,0,0.55)",  icon:"👑" },
                          { bg:"#60a5fa", shadow:"0 0 12px rgba(96,165,250,0.45)", icon:"🌐" },
                          { bg:"#c084fc", shadow:"0 0 12px rgba(192,132,252,0.4)", icon:"💎" },
                          { bg:"#4ade80", shadow:"0 0 10px rgba(74,222,128,0.35)", icon:"🛡️" },
                        ];
                        const bs = BS[Math.min(rank - 1, BS.length - 1)];

                        return (
                          <motion.div key={item.id || item.name}
                            className={`clb-row ${rank === 1 ? "clb-row--rank1" : rank <= 3 ? `clb-row--top${rank}` : ""} ${isMe ? "clb-row--me" : ""}`}
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.015 }}
                            whileHover={{ backgroundColor: "rgba(34,197,94,0.04)" }}>

                            {/* RANK */}
                            <div className="clb-col-rank">
                              {rank === 1 ? (
                                <div className="clb-medal clb-medal--gold"><span>👑</span><span className="clb-medal-num">1</span></div>
                              ) : rank === 2 ? (
                                <div className="clb-medal clb-medal--silver"><span>🥈</span><span className="clb-medal-num">2</span></div>
                              ) : rank === 3 ? (
                                <div className="clb-medal clb-medal--bronze"><span>🥉</span><span className="clb-medal-num">3</span></div>
                              ) : (
                                <div className="clb-rank-num">
                                  {rank === 4 && <span className="clb-rank-diamond">♦</span>}
                                  {rank}
                                </div>
                              )}
                            </div>

                            {/* USER */}
                            <div className="clb-col-user">
                              <div className="clb-avatar" style={{ background: avColor }}>{item.name.charAt(0).toUpperCase()}</div>
                              <div className="clb-user-text">
                                <span className="clb-user-name">{item.name}{isMe && <span className="clb-you-tag"> (You)</span>}</span>
                                <span className="clb-user-handle">@{item.name.toLowerCase().replace(/[\s-]/g,"_")}</span>
                                {rank === 1 && <span className="clb-active-badge">🟢 Active Member</span>}
                              </div>
                            </div>

                            {/* BADGE */}
                            <div className="clb-col-badge">
                              <div className="clb-shield" style={{ "--bs-bg": bs.bg, "--bs-shadow": bs.shadow }}>
                                <span className="clb-shield-icon">{bs.icon}</span>
                              </div>
                            </div>

                            {/* ECO RANK */}
                            <div className="clb-col-ecorank">
                              <div className="clb-ecorank-title" style={{ color: er.color }}>{er.icon} {er.label}</div>
                              <div className="clb-ecorank-desc">{er.desc}</div>
                            </div>

                            {/* TOTAL POINTS */}
                            <div className="clb-col-points">
                              <div className="clb-points-top">
                                <span className="clb-points-val">{pts.toLocaleString()}</span>
                                <span className="clb-points-leaf">🌿</span>
                              </div>
                              <div className="clb-points-bar-track">
                                <motion.div className="clb-points-bar-fill" style={{ "--er-color": er.color }}
                                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, delay: index * 0.02 }} />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    {leaderboard.length === 0 && (
                      <div className="clb-empty">No users yet. Log an activity to appear here!</div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Footer */}
                <div className="clb-footer">
                  <span className="clb-footer-count">
                    Showing 1 to {leaderboard.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).length} of {leaderboard.length} contributors 🌿
                  </span>
                  <span className="clb-footer-live">⚡ Updated in real-time</span>
                </div>
              </div>

              {/* Personal stats row */}
              <div className="clb-personal-row">
                <motion.div className="clb-personal-card"
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.3 }}>
                  <div className="clb-pc-label">Your Community Rank</div>
                  <div className="clb-pc-rank">{myRank > 0 ? `#${myRank}` : "—"}</div>
                  <div className="clb-pc-sub">{percentile <= 10 ? "Top 10% 🥇" : percentile <= 25 ? "Top 25% 🥈" : percentile <= 50 ? "Top 50% 🥉" : `Top ${percentile}%`}</div>
                </motion.div>
                <motion.div className="clb-personal-card"
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.4 }}>
                  <div className="clb-pc-label">🔥 Daily Streak</div>
                  <div className="clb-pc-rank" style={{ color:"#fb923c" }}>
                    {streakInfo.ongoingStreak}<span style={{ fontSize:"18px", marginLeft:"4px" }}>days</span>
                  </div>
                  <div className="clb-week-dots">
                    {["M","T","W","T","F","S","S"].map((d, i) => (
                      <div key={i} className={`clb-dot ${streakInfo.weekStatus[i] ? "clb-dot--done" : ""}`} title={d} />
                    ))}
                  </div>
                </motion.div>
                <motion.div className="clb-personal-card"
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.5 }}>
                  <div className="clb-pc-label">Eco Badges Earned</div>
                  <div className="clb-pc-rank">{unlockedCount}<span style={{ fontSize:"18px" }}> / {userBadges.length}</span></div>
                  <div className="clb-badges-mini">
                    {userBadges.slice(0, 5).map(b => (
                      <span key={b.id} style={{ opacity: b.unlocked ? 1 : 0.3, fontSize:"18px" }}>{b.icon}</span>
                    ))}
                  </div>
                </motion.div>
              </div>

            </div>
          )}
          {activeTab === "reportCenter" && (
              <ReportCenter leaderboard={leaderboard} />
          )}
          {activeTab === "certificate" && (
              <Certificate />
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
                      <span className="p-stat-val">{unlockedCount} / 8</span>
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

                {/* Right Column Profile Editor & Preview */}
                <div className="profile-form-container" style={{ flexGrow: 1 }}>
                  <div className="settings-grid">

                    {/* 3D Glassmorphic Form Card */}
                    <motion.div
                        className="settings-card-3d"
                        style={{ perspective: 1000 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{
                          rotateY: -0.5,
                          rotateX: 1,
                          y: -3
                        }}
                    >
                      <div>
                        <h3 className="text-xl font-bold pb-4 mb-6 flex items-center gap-2" style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-primary)" }}>
                          <FaLeaf className="text-emerald-400 animate-pulse" />
                          Configure Dashboard Parameters
                        </h3>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                          <div className="settings-input-row">
                            {/* Full Name input */}
                            <div className="settings-input-col">
                              <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Account Full Name</label>
                              <div className="settings-input-wrapper">
                                <FaUser className="settings-input-icon" />
                                <input
                                    type="text"
                                    value={profileForm.fullName}
                                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                    required
                                    className="settings-input-field"
                                />
                              </div>
                            </div>

                            {/* Email Input */}
                            <div className="settings-input-col">
                              <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Email Address</label>
                              <div className="settings-input-wrapper">
                                <FaEnvelope className="settings-input-icon" />
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                    required
                                    className="settings-input-field"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="settings-input-row">
                            {/* Daily Carbon Goal */}
                            <div className="settings-input-col">
                              <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Daily Carbon Limit (kg CO₂e)</label>
                              <div className="settings-input-wrapper">
                                <FaLeaf className="settings-input-icon" />
                                <input
                                    type="number"
                                    step="1"
                                    value={profileForm.goal}
                                    onChange={(e) => setProfileForm({ ...profileForm, goal: e.target.value })}
                                    required
                                    className="settings-input-field"
                                />
                              </div>
                              <span className="settings-helper-text">
                            Set your daily emission goal and track your sustainability progress.
                          </span>
                            </div>

                            {/* Theme Preference selector */}
                            <div className="settings-input-col">
                              <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>System Theme Preference</label>
                              <div className="theme-options-grid">

                                {/* Dark Neon Card Option */}
                                <div
                                    onClick={() => setTheme("dark")}
                                    className={`theme-option-card ${theme === "dark" ? "active" : ""}`}
                                >
                                  <span className="emoji">🌙</span>
                                  <span className="label">Dark Neon</span>
                                  {theme === "dark" && (
                                      <motion.div
                                          layoutId="activeThemeGlow"
                                          className="absolute inset-0 rounded-xl border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] pointer-events-none"
                                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                      />
                                  )}
                                </div>

                                {/* Light Eco Card Option */}
                                <div
                                    onClick={() => setTheme("light")}
                                    className={`theme-option-card ${theme === "light" ? "active" : ""}`}
                                >
                                  <span className="emoji">☀️</span>
                                  <span className="label">Light Eco</span>
                                  {theme === "light" && (
                                      <motion.div
                                          layoutId="activeThemeGlow"
                                          className="absolute inset-0 rounded-xl border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] pointer-events-none"
                                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                      />
                                  )}
                                </div>

                              </div>
                            </div>
                          </div>
                          <div className="settings-input-col" style={{ marginTop: "20px" }}>
                            <label
                                className="text-xs font-semibold"
                                style={{ color: "var(--text-muted)" }}
                            >
                              Language
                            </label>


                          </div>
                          <div className="settings-input-col" style={{ marginTop: "20px" }}>
                            <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  cursor: "pointer",
                                  fontWeight: "600",
                                  color: "var(--text-primary)",
                                }}
                            >
                              <input
                                  type="checkbox"
                                  checked={profileForm.showName}
                                  onChange={(e) =>
                                      setProfileForm({
                                        ...profileForm,
                                        showName: e.target.checked,
                                      })
                                  }
                              />

                              Show my name on Community Leaderboard
                            </label>

                            <p
                                style={{
                                  marginTop: "8px",
                                  fontSize: "12px",
                                  color: "var(--text-muted)",
                                }}
                            >
                              If disabled, other users will see an anonymous ID like <b>ECO-0001</b>.
                              You will always see your own name.
                            </p>
                          </div>

                          <div className="pt-4 border-t flex justify-end" style={{ borderTop: "1px solid var(--card-border)" }}>
                            <button type="submit" className="action-btn-primary px-6 py-3 font-extrabold flex items-center gap-2">
                              <FaSave />
                              <span>Save Parameters</span>
                            </button>
                          </div>
                        </form>
                      </div>

                      <div
                          className="mt-6 p-4 rounded-xl flex gap-3 items-center"
                          style={{
                            background: "rgba(16, 185, 129, 0.05)",
                            border: "1px solid var(--card-border)"
                          }}
                      >
                        <FaShieldAlt className="text-2xl text-emerald-400 flex-shrink-0 animate-pulse" />
                        <p className="text-xs leading-normal" style={{ color: "var(--text-primary)" }}>
                          <strong>Security Guarantee:</strong> Your profile settings and activity entries are stored safely in your local session. CarbonTracker does not distribute your telemetry to external marketing streams.
                        </p>
                      </div>
                    </motion.div>

                    {/* Live Preview Card */}
                    <motion.div
                        className="preview-pane"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="preview-badge-live">
                        <div className="preview-badge-dot" />
                        <span className="preview-badge-text">Live Preview</span>
                      </div>

                      <h4 className="preview-title">Theme Preview</h4>

                      {/* Mock Mini Dashboard Card */}
                      <motion.div
                          className="mini-dashboard-mock"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {/* Floating Eco Badge */}
                        <div className="mini-header">
                          <span className="mini-header-title">Dashboard</span>
                          <span className="mini-badge">
                        🌱 Eco Leader
                      </span>
                        </div>

                        {/* Circular Score representation */}
                        <div className="mini-score-section">
                          <svg className="mini-score-svg">
                            <circle
                                cx="48"
                                cy="48"
                                r="38"
                                className="mini-score-circle-bg"
                            />
                            <motion.circle
                                cx="48"
                                cy="48"
                                r="38"
                                className="mini-score-circle-fill"
                                strokeDasharray={2 * Math.PI * 38}
                                initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 38 * 0.28 }} // 72% completed score
                                transition={{ duration: 1, delay: 0.3 }}
                            />
                          </svg>
                          <div className="mini-score-text-container">
                            <span className="mini-score-percentage">72%</span>
                            <span className="mini-score-lbl">CO₂ saved</span>
                          </div>
                        </div>

                        {/* Simulated Line graph placeholder */}
                        <div className="mini-chart-section">
                          <div className="mini-chart-header">
                            <span>Emission trend</span>
                            <span className="mini-chart-val">-14.2%</span>
                          </div>
                          {/* SVG mini graph */}
                          <div className="mini-chart-svg-container">
                            <svg className="mini-chart-svg" viewBox="0 0 100 40" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={theme === 'dark' ? '#33FFC7' : '#10b981'} stopOpacity="0.4" />
                                  <stop offset="100%" stopColor={theme === 'dark' ? '#33FFC7' : '#10b981'} stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <motion.path
                                  d="M0,35 Q15,25 30,30 T60,10 T90,20 L100,15 L100,40 L0,40 Z"
                                  fill="url(#chartGlow)"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                              />
                              <motion.path
                                  d="M0,35 Q15,25 30,30 T60,10 T90,20 L100,15"
                                  fill="transparent"
                                  stroke={theme === 'dark' ? '#33FFC7' : '#10b981'}
                                  strokeWidth="2"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 1.2, ease: "easeInOut" }}
                              />
                            </svg>
                          </div>
                        </div>
                      </motion.div>

                      {/* Visual design hint */}
                      <p className="text-[11px] text-center mt-5 leading-normal max-w-[200px]" style={{ color: "var(--text-muted)" }}>
                        Theme: <span className="font-extrabold uppercase" style={{ color: "var(--primary-glow)" }}>{theme === 'dark' ? 'Dark Neon' : 'Light Eco'}</span>
                      </p>
                    </motion.div>

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
                <h3>{editingId ? t("modal.editActivity") : t("modal.logActivity")}</h3>
                <p>{t("modal.modalSub")}</p>

                <form onSubmit={handleAddActivity}>
                  <div className="form-group">
                    <label>{t("modal.categoryLabel")}</label>
                    <select value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}>
                      <option value="Transport">{t("modal.transport")}</option>
                      <option value="Electricity">{t("modal.electricity")}</option>
                      <option value="Food">{t("modal.food")}</option>
                      <option value="Shopping">{t("modal.shopping")}</option>
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
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>{t("modal.calculatedFootprint")}</span>
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--primary-glow)" }}>
                  {calculateCarbon()} kg CO₂e
                </span>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                      {t("modal.cancel")}
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingId ? t("modal.updateActivity") : t("modal.appendLogs")}
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