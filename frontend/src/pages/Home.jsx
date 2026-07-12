import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Earth from "../components/Earth";
import FloatingLeaves from "../components/FloatingLeaves";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="home">

      <Earth />
      <FloatingLeaves />

      <Navbar />

      <section className="hero-section">

        <div className="left">

          <Hero />

        </div>

        <div className="right">

        </div>

      </section>

      <Features />

      <Footer />

    </div>
  );
}

export default Home;