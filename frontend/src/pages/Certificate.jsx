import "../styles/Certificate.css";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaDownload, FaAward, FaFire, FaStar } from "react-icons/fa";
import api from "../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Certificate() {
  const certificateRef = useRef(null);
  const [loading, setLoading]           = useState(true);
  const [certificate, setCertificate]   = useState(null);

  useEffect(() => {
    api.get("/certificate")
      .then(r => setCertificate(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const downloadPDF = async () => {
    const canvas = await html2canvas(certificateRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("CarbonTracker_Certificate.pdf");
  };

  if (loading) return (
    <div className="cert-loading">
      <div className="cert-loading-spinner" />
      <span>Loading Certificate…</span>
    </div>
  );

  if (!certificate) return (
    <div className="cert-page"><div className="cert-error">Unable to load certificate. Please try again.</div></div>
  );

  if (!certificate.eligible) return (
    <div className="cert-page">
      <motion.div
        className="cert-locked-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="cert-locked-icon">🔒</div>
        <h1 className="cert-locked-title">Certificate Locked</h1>
        <p className="cert-locked-desc">
          Complete a <strong>7-day eco logging streak</strong> to unlock your
          personalized sustainability certificate.
        </p>
        <div className="cert-streak-progress">
          <div className="cert-streak-label">
            <span>Progress</span>
            <span className="cert-streak-count">{certificate.currentStreak} / 7 days</span>
          </div>
          <div className="cert-streak-track">
            <motion.div
              className="cert-streak-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(certificate.currentStreak / 7) * 100}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="cert-streak-dots">
            {[1,2,3,4,5,6,7].map(d => (
              <div key={d} className={`cert-dot ${d <= certificate.currentStreak ? "done" : ""}`}>
                {d <= certificate.currentStreak ? "✓" : d}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const stats = [
    { label: "Total Activities", value: certificate.totalActivities, icon: <FaStar /> },
    { label: "Total Emission",   value: `${certificate.totalEmission} kg`, icon: <FaLeaf /> },
    { label: "Streak",           value: `${certificate.currentStreak} Days`, icon: <FaFire /> },
    { label: "Eco Points",       value: certificate.ecoPoints, icon: <FaAward /> },
  ];

  return (
    <div className="cert-page">
      <motion.div
        className="cert-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* ── The certificate itself (captured by html2canvas) ── */}
        <div className="certificate" ref={certificateRef}>

          {/* Corner ornaments */}
          <div className="cert-corner cert-corner-tl" />
          <div className="cert-corner cert-corner-tr" />
          <div className="cert-corner cert-corner-bl" />
          <div className="cert-corner cert-corner-br" />

          {/* Header */}
          <div className="certificate-header">
            <div className="cert-logo-row">
              <div className="cert-logo-icon"><FaLeaf /></div>
              <span className="cert-brand">CARBONTRACKER</span>
            </div>
            <div className="cert-divider-ornament">
              <span className="cert-ornament-line" />
              <span className="cert-ornament-diamond">◆</span>
              <span className="cert-ornament-line" />
            </div>
            <h2 className="cert-doc-title">Certificate of Eco Commitment</h2>
          </div>

          {/* Body */}
          <div className="certificate-body">
            <p className="cert-presented">This certificate is proudly presented to</p>
            <h1 className="cert-name">{certificate.fullName}</h1>

            <p className="cert-description">
              For demonstrating outstanding dedication towards reducing carbon emissions
              and adopting a sustainable lifestyle through consistent daily tracking
              and community leadership.
            </p>

            {/* Stats grid */}
            <div className="certificate-grid">
              {stats.map((s) => (
                <div className="cert-stat-card" key={s.label}>
                  <div className="cert-stat-icon">{s.icon}</div>
                  <p className="cert-stat-value">{s.value}</p>
                  <h3 className="cert-stat-label">{s.label}</h3>
                </div>
              ))}
            </div>

            {/* Community rank + date */}
            <div className="cert-meta-row">
              <div className="cert-meta-item">
                <span className="cert-meta-label">Community Rank</span>
                <span className="cert-meta-value">#{certificate.communityRank}</span>
              </div>
              <div className="cert-meta-sep" />
              <div className="cert-meta-item">
                <span className="cert-meta-label">Issue Date</span>
                <span className="cert-meta-value">{certificate.issueDate}</span>
              </div>
            </div>

            {/* Badges */}
            {certificate.badges?.length > 0 && (
              <div className="badges">
                <h3 className="cert-badges-title">Earned Badges</h3>
                <div className="cert-badges-row">
                  {certificate.badges.map((badge, i) => (
                    <span key={i} className="badge">{badge}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Gold seal */}
            <div className="cert-seal">
              <div className="cert-seal-ring">
                <div className="cert-seal-inner">🌿</div>
              </div>
              <span className="cert-seal-label">Verified Eco Commitment</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Download button (outside captured area) */}
      <motion.div
        className="download-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button className="download-btn" onClick={downloadPDF}>
          <FaDownload style={{ marginRight: 9 }} />
          Download Certificate PDF
        </button>
      </motion.div>
    </div>
  );
}

export default Certificate;
