import React, { useState } from "react";
import api from "../services/api";

function ReportCenter({ leaderboard }) {
    const userId = localStorage.getItem("id");



    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const downloadPdf = async () => {
        try {
            const response = await api.get(
                `/reports/pdf/${userId}?from=${from}&to=${to}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "CarbonTrack_Report.pdf");

            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error(error);
            alert("Failed to download PDF");
        }
    };
    const downloadExcel = async () => {
        try {
            const response = await api.get(
                `/reports/excel/${userId}?from=${from}&to=${to}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "CarbonTrack_Report.xlsx");

            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error(error);
            alert("Failed to download Excel");
        }
    };
    const sendEmail = async () => {
        try {
            const email = localStorage.getItem("email");

            await api.post(
                `/reports/email/${userId}?email=${email}&from=${from}&to=${to}`
            );

            alert("Report sent successfully to " + email);

        } catch (error) {
            console.error(error);
            alert("Failed to send email");
        }
    };
    return (
        <div style={{ padding: "30px", color: "white" }}>

            <h1>📊 Report Center</h1>

            <p>
                Generate and download your Carbon Emission Reports.
            </p>
            <div style={{ marginBottom: "20px" }}>

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <label>From Date</label><br />
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            style={{
                                padding: "10px",
                                borderRadius: "6px"
                            }}

                        />
                    </div>

                    <div>
                        <label>To Date</label><br />
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            style={{
                                padding: "10px",
                                borderRadius: "6px"
                            }}
                        />
                    </div>
                </div>

            </div>

            <div
                style={{
                    marginTop: "30px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        background: "#1f2937",
                        padding: "20px",
                        borderRadius: "12px",
                    }}
                >
                    <h3>📄 PDF Report</h3>
                    <button
                        onClick={downloadPdf}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#16a34a",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginTop: "10px"
                        }}
                    >
                        📄 Download PDF
                    </button>
                </div>

                <div
                    style={{
                        background: "#1f2937",
                        padding: "20px",
                        borderRadius: "12px",
                    }}
                >
                    <h3>📊 Excel Report</h3>
                    <button
                        onClick={downloadExcel}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginTop: "10px"
                        }}
                    >
                        📊 Download Excel
                    </button>
                </div>

                <div
                    style={{
                        background: "#1f2937",
                        padding: "20px",
                        borderRadius: "12px",
                    }}
                >
                    <h3>📧 Email Report</h3>
                    <button
                        onClick={sendEmail}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#f59e0b",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginTop: "10px"
                        }}
                    >
                        📧 Send Report
                    </button>
                </div>
            </div>


            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>🏆 Top 50 Contributors</span>
            </h3>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                    <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)", fontSize: "13px" }}>
                        <th style={{ padding: "12px 16px", fontWeight: "600" }}>Rank</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600" }}>User</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", textAlign: "center" }}>Badge</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600" }}>Eco Rank</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", textAlign: "right" }}>Total CO₂</th>
                    </tr>
                    </thead>

                    <tbody>
                    {leaderboard
                        .slice(0, 50)
                        .map((item, index) => {

                            const rank = index + 1;

                            let badge = "🌱";
                            if (rank === 1) badge = "🥇";
                            else if (rank === 2) badge = "🥈";
                            else if (rank === 3) badge = "🥉";

                            let ecoRank = "Beginner";
                            if (rank === 1) ecoRank = "Eco Champion";
                            else if (rank <= 3) ecoRank = "Eco Leader";
                            else if (rank <= 10) ecoRank = "Eco Warrior";

                            const isMe = false;

                            const displayName = item.name;

                            return (
                                <tr
                                    key={item.id || item.name}
                                    style={{
                                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                                        background:
                                            rank === 1
                                                ? "rgba(255,215,0,0.10)"
                                                : rank === 2
                                                    ? "rgba(192,192,192,0.10)"
                                                    : rank === 3
                                                        ? "rgba(205,127,50,0.10)"
                                                        : isMe
                                                            ? "rgba(51,255,199,0.05)"
                                                            : "transparent",

                                        borderLeft:
                                            rank === 1
                                                ? "4px solid gold"
                                                : rank === 2
                                                    ? "4px solid silver"
                                                    : rank === 3
                                                        ? "4px solid #CD7F32"
                                                        : isMe
                                                            ? "3px solid var(--primary-glow)"
                                                            : "3px solid transparent",

                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <td style={{ padding: "16px", fontWeight: "700", fontSize: "16px" }}>
                                        {rank}
                                    </td>

                                    <td style={{ padding: "16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                                            <div
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "50%",
                                                    background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",

                                                    color: "#fff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {displayName.charAt(0).toUpperCase()}
                                            </div>

                                            <span
                                                style={{
                                                    fontWeight: "500",
                                                    color: isMe
                                                        ? "var(--primary-glow)"
                                                        : "var(--text-primary)"
                                                }}
                                            >
                                    {displayName}

                                </span>

                                        </div>
                                    </td>

                                    <td style={{ padding: "16px", textAlign: "center" }}>
                                        {badge}
                                    </td>

                                    <td style={{ padding: "16px" }}>
                                        {ecoRank}
                                    </td>

                                    <td style={{ padding: "16px", textAlign: "right", fontWeight: "700" }}>
                                        {item.totalEmission ? item.totalEmission.toFixed(1) : "0.0"} kg
                                    </td>

                                </tr>
                            );
                        })}

                    {leaderboard.length === 0 && (
                        <tr>
                            <td
                                colSpan="5"
                                style={{
                                    padding: "30px",
                                    textAlign: "center",
                                    color: "var(--text-muted)"
                                }}
                            >
                                No users found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

        </div>

);
}

export default ReportCenter;