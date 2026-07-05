import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Earth from "../components/Earth";
import FloatingLeaves from "../components/FloatingLeaves";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Earth />
      <FloatingLeaves />

      <Navbar />

      <Hero />

      <Features />

      <Footer />
    </>
  );
}

export default Home;