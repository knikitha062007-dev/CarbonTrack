import { useState, useEffect } from "react";
import { FaLeaf } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: "18px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "92%",
        maxWidth: "1200px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 28px",
        borderRadius: "20px",
        background: scrolled
          ? "rgba(8, 12, 28, 0.88)"
          : "rgba(255,255,255,0.06)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: scrolled
          ? "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(51,255,199,0.08)"
          : "0 4px 24px rgba(0,0,0,0.2)",
        zIndex: 9999,
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg,#33FFC7 0%,#10b981 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(51,255,199,0.4)",
            flexShrink: 0,
          }}
        >
          <FaLeaf style={{ color: "#050816", fontSize: "16px" }} />
        </div>
        <span
          style={{
            fontSize: "19px",
            fontWeight: "800",
            background: "linear-gradient(135deg,#ffffff 0%,#33FFC7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.3px",
          }}
        >
          CarbonTracker
        </span>
      </div>

      {/* Nav Links */}
      <ul
        style={{
          display: "flex",
          gap: "6px",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {["Home", "Features", "About", "Contact"].map((item, idx) => {
          const keys = ["nav.home","nav.features","nav.about","nav.contact"];
          return (
          <li
            key={item}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.75)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.2px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#33FFC7";
              e.currentTarget.style.background = "rgba(51,255,199,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.75)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            {t(keys[idx])}
          </li>
          );
        })}
      </ul>

      {/* CTA Buttons */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Link to="/login">
          <button
            style={{
              padding: "9px 22px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.85)",
              fontSize: "13.5px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.25s ease",
              letterSpacing: "0.2px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(51,255,199,0.5)";
              e.currentTarget.style.color = "#33FFC7";
              e.currentTarget.style.background = "rgba(51,255,199,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              e.currentTarget.style.color = "rgba(255,255,255,0.85)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            {t("nav.signIn")}
          </button>
        </Link>

        <Link to="/register">
          <button
            style={{
              padding: "9px 22px",
              background: "linear-gradient(135deg,#33FFC7 0%,#10b981 100%)",
              border: "none",
              borderRadius: "12px",
              color: "#050816",
              fontSize: "13.5px",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(51,255,199,0.4)",
              transition: "all 0.25s ease",
              letterSpacing: "0.2px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(51,255,199,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 18px rgba(51,255,199,0.4)";
            }}
          >
            {t("nav.getStarted")}
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
