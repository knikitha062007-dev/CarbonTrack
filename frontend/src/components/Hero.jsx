import { motion } from "framer-motion";

function Hero() {
  return (

    <section className="hero">

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >

        <h1>
          Track Your
          <span> Carbon Footprint</span>
        </h1>

        <p>
          Monitor transport, electricity, food and shopping
          activities while contributing to a greener planet.
        </p>

        <div className="hero-buttons">

          <button className="primary-btn">
            Start Tracking
          </button>

          <button className="secondary-btn">
            Learn More
          </button>

        </div>

      </motion.div>

    </section>

  );
}

export default Hero;