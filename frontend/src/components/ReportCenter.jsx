import React, { useState } from "react";
import api from "../services/api";

function ReportCenter() {
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

        </div>
    );
}

export default ReportCenter;