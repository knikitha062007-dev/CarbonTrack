import "../styles/Certificate.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState, useEffect } from "react";

function Certificate() {
    const [progress, setProgress] = useState(0);
    const certificateRef = useRef(null);
    const required = 7;
    const eligibility = progress >= required;
    const status = eligibility ? "✅ Eligible" : "❌ Not Eligible";

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const userId = localStorage.getItem("id");

                setProgress(7);
            } catch (error) {
                console.error(error);
            }
        };

        loadProgress();
    }, []);

    if (!eligibility) {
        return (
            <div style={{ padding: "30px", color: "white" }}>
                <h1>🏆 Certificate Center</h1>

                <h2>🔒 Certificate Locked</h2>

                <p>Eligibility Status: ❌ Not Eligible</p>

                <p>Progress: {progress}/{required} Days Completed</p>

                <progress
                    value={progress}
                    max={required}
                    style={{ width: "300px", height: "18px" }}
                />

                <p style={{ marginTop: "20px" }}>
                    Complete a 7-day eco activity streak to unlock your certificate.
                </p>
            </div>
        );
    }

    const downloadPDF = async () => {
        if (!certificateRef.current) return;

        const input = certificateRef.current;

        const canvas = await html2canvas(input, {
            scale: 2
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("landscape", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        pdf.save("CarbonTracker_Certificate.pdf");
    };
    return (
        <div className="certificate-page">
            <div
                style={{
                    background: "#f5f5f5",
                    padding: "15px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    textAlign: "center",
                }}
            >
                <h3>Certificate Status</h3>

                <p><strong>Eligibility:</strong> {status}</p>

                <p><strong>Progress:</strong> {progress}/{required} Days Completed</p>

                {!eligibility && (
                    <p style={{ color: "red" }}>
                        Complete {required - progress} more day(s) to unlock your certificate.
                    </p>
                )}
            </div>

            {eligibility && (
                <>
                    <div className="certificate" ref={certificateRef}>

                        <div className="top-border"></div>

                        <div className="badge">
                            <div className="badge-title">ECO</div>
                            <div className="badge-title">COMMITMENT</div>
                            <div className="badge-title">CHAMPION</div>
                        </div>

                        <div className="earth">🌎</div>

                        <div className="left-panel">
                            <div className="item">🍃 <span>7 Days Streak</span></div>
                            <div className="item">🌱 <span>25 Eco Activities</span></div>
                            <div className="item">🌍 <span>18.6 kg CO₂ Reduced</span></div>
                            <div className="item">⭐ <span>420 Eco Points</span></div>
                            <div className="item">🏆 <span>Eco Rank : Level 2</span></div>
                        </div>

                        <h1 className="logo">CARBON TRACKER</h1>

                        <p className="tagline">Track Today. Transform Tomorrow.</p>

                        <h2 className="title">CERTIFICATE</h2>

                        <h3 className="subtitle">OF ECO COMMITMENT</h3>

                        <p className="presented">Proudly Presented To</p>

                        <h1 className="username">Priyanka Teli</h1>

                    </div>

                    <div style={{ textAlign: "center", marginTop: "30px" }}>
                        <button onClick={downloadPDF}>
                            📥 Download Certificate
                        </button>
                    </div>
                </>
            )}

</div>
);
}

export default Certificate;