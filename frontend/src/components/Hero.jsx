import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../services/api";

function Hero() {
  const [userCount, setUserCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);

  const fetchUserCount = async () => {
    try {
      const response = await api.get("/users/count");
      setUserCount(response.data.count);
    } catch (err) {
      console.error(err);
    }
  };
const fetchActivityCount = async () => {
  try {
    const response = await api.get("/users/activity-count");
    setActivityCount(response.data.count);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchUserCount();
    fetchActivityCount();
  }, []);

  return (
    <section className="hero">
      <motion.h1
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Track Every Step
        <br />
        <span>Towards A Greener Future</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        CarbonTracker helps individuals monitor transport,
        electricity, food and shopping activities while
        visualizing their carbon footprint through an
        immersive 3D experience.
      </motion.p>

      <motion.div
        className="hero-buttons"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <button className="primary-btn">Get Started</button>
        <button className="secondary-btn">Learn More</button>
      </motion.div>

      <div className="stats">
        <div>
            <h2>{activityCount}</h2>
            <p>Activities Logged</p>
        </div>

        <div>
          <h2>150T</h2>
          <p>CO₂ Tracked</p>
        </div>

        <div>
          <h2>{userCount}</h2>
          <p>Registered Users</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;