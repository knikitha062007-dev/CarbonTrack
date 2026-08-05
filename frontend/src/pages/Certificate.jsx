import "../styles/Certificate.css";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Certificate() {

    const certificateRef = useRef(null);

    const [loading, setLoading] = useState(true);

    const [certificate, setCertificate] = useState(null);

    useEffect(() => {

        const loadCertificate = async () => {

            try {

                const response = await api.get("/certificate");

                setCertificate(response.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        loadCertificate();

    }, []);
    const downloadPDF = async () => {

        const canvas = await html2canvas(certificateRef.current, {
            scale: 2
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("landscape", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();

        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            pdfWidth,
            pdfHeight
        );

        pdf.save("CarbonTracker_Certificate.pdf");

    };

    if (loading) {

        return <h2>Loading Certificate...</h2>;

    }

    if (!certificate) {

        return <h2>Unable to load certificate.</h2>;

    }

    if (!certificate.eligible) {

        return (

            <div className="locked-container">

                <h1>🔒 Certificate Locked</h1>

                <p>
                    Complete a 7-day eco streak to unlock your certificate.
                </p>

                <p>
                    Current Streak :
                    <strong> {certificate.currentStreak}</strong>
                </p>

            </div>

        );

    }
    return (
        <div className="certificate-page">

            <div className="certificate" ref={certificateRef}>

                <div className="certificate-header">

                    <h1>🌿 CARBON TRACKER 🌿</h1>

                    <h2>Certificate of Eco Commitment</h2>

                </div>

                <div className="certificate-body">

                    <p className="presented">
                        This certificate is proudly presented to
                    </p>

                    <h1 className="username">
                        {certificate.fullName}
                    </h1>

                    <p className="description">

                        For demonstrating dedication towards reducing
                        carbon emissions and adopting a sustainable lifestyle.

                    </p>

                    <div className="certificate-grid">

                        <div className="card">
                            <h3>Total Activities</h3>
                            <p>{certificate.totalActivities}</p>
                        </div>

                        <div className="card">
                            <h3>Total Emission</h3>
                            <p>{certificate.totalEmission} kg CO₂</p>
                        </div>

                        <div className="card">
                            <h3>Current Streak</h3>
                            <p>{certificate.currentStreak} Days</p>
                        </div>

                        <div className="card">
                            <h3>Eco Points</h3>
                            <p>{certificate.ecoPoints}</p>
                        </div>

                    </div>
                    <div className="certificate-grid">

                        <div className="card">
                            <h3>Community Rank</h3>
                            <p>#{certificate.communityRank}</p>
                        </div>

                        <div className="card">
                            <h3>Issue Date</h3>
                            <p>{certificate.issueDate}</p>
                        </div>

                    </div>

                    <div className="badges">

                        <h3>Earned Badges</h3>

                        {certificate.badges.map((badge, index) => (

                            <span key={index} className="badge">

                            {badge}

                        </span>

                        ))}

                    </div>

                </div>

            </div>

            <div className="download-section">

                <button
                    className="download-btn"
                    onClick={downloadPDF}
                >
                    📥 Download Certificate
                </button>

            </div>

        </div>
    );

}

export default Certificate;