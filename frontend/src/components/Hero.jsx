import { motion } from "framer-motion";

function Hero() {
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
              <h2>10K+</h2>
              <p>Activities Logged</p>
          </div>

          <div>
              <h2>150T</h2>
              <p>CO₂ Tracked</p>
          </div>

          <div>
              <h2>500+</h2>
              <p>Users</p>
          </div>

      </div>
    </section>
  );
}

export default Hero;