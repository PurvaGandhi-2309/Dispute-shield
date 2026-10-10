import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Rebuttals.css";
import "./Dashboard.css";
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';
import rebuttalIcon from '../assets/rebuttal-icon-transparent.png';
import { 
    LayoutDashboard, 
    ShieldAlert, 
    FileText, 
    Sparkles, 
    BarChart2, 
    Settings,
    Search,
    Bell,
    Scale,
    TrendingUp
} from 'lucide-react';

function Rebuttals() {
    const [disputes, setDisputes] = useState([]);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [disputeEvidence, setDisputeEvidence] = useState([]);
    const navigate = useNavigate();


    const handleGenerate = async () => {
        if (!selectedDispute) {
            alert("Please select a dispute first from the left panel to generate a rebuttal.");
            return;
        }
        try {
            const generated = await apiRequest(
                `/disputes/${selectedDispute._id}/generate`,
                {
                    method: "POST",
                }
            );

            setSelectedDispute(generated);

            const data = await apiRequest("/disputes");
            setDisputes(data);

        } catch (error) {
            console.error("Failed to generate rebuttal:", error);
        }
    };


    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                const data = await apiRequest("/disputes");
                setDisputes(data);
                if (data && data.length > 0) {
                    setSelectedDispute(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch disputes:", error);
            }
        };

        fetchDisputes();
    }, []);

    // Fetch evidence for selected dispute
    useEffect(() => {
        const fetchEvidence = async () => {
            if (!selectedDispute) return;
            try {
                const data = await apiRequest(`/disputes/${selectedDispute._id}/evidence`);
                setDisputeEvidence(data || []);
            } catch (error) {
                console.error("Failed to fetch evidence:", error);
                setDisputeEvidence([]);
            }
        };

        fetchEvidence();
    }, [selectedDispute]);

    // Evidence Analyzer Logic
    const analyzeEvidence = () => {
        const scoreBreakdown = {
            Invoice: { score: 20, present: false, label: "Invoice" },
            Tracking: { score: 20, present: false, label: "Tracking" },
            DeliveryProof: { score: 20, present: false, label: "Delivery Proof" },
            CustomerIP: { score: 15, present: false, label: "Customer IP" },
            Communication: { score: 15, present: false, label: "Communication" },
            OrderDetails: { score: 10, present: false, label: "Order Details" }
        };

        disputeEvidence.forEach(item => {
            const name = (item.fileName || "").toLowerCase();
            const type = (item.fileType || "").toLowerCase();
            const content = name + " " + type;

            if (content.includes("invoice") || content.includes("receipt")) scoreBreakdown.Invoice.present = true;
            if (content.includes("track") || content.includes("ship")) scoreBreakdown.Tracking.present = true;
            if (content.includes("deliver") || content.includes("proof") || content.includes("signature")) scoreBreakdown.DeliveryProof.present = true;
            if (content.includes("ip") || content.includes("network")) scoreBreakdown.CustomerIP.present = true;
            if (content.includes("email") || content.includes("chat") || content.includes("message") || content.includes("communication")) scoreBreakdown.Communication.present = true;
            if (content.includes("order") || content.includes("detail")) scoreBreakdown.OrderDetails.present = true;
        });

        let totalScore = 0;
        const items = [];
        
        Object.keys(scoreBreakdown).forEach(key => {
            const criteria = scoreBreakdown[key];
            if (criteria.present) {
                totalScore += criteria.score;
            }
            items.push(criteria);
        });

        let level = "Weak";
        if (totalScore >= 80) level = "Strong";
        else if (totalScore >= 50) level = "Moderate";

        const missingItem = items.find(i => !i.present);
        const recommendation = missingItem 
            ? `Add ${missingItem.label.toLowerCase()} to strengthen this dispute.` 
            : "Evidence is very strong. Ready to generate rebuttal.";

        return { score: totalScore, level, items, recommendation };
    };

    const evidenceAnalysis = analyzeEvidence();

    // 


    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="dashboard-main" style={{ overflowY: 'auto' }}>
                <div className="reb-page-container">
            {/* ── Top Navbar ── */}
            <nav className="reb-navbar">
                <div className="reb-nav-left">
                    <img src={logo} alt="DisputeShield" className="reb-logo-img" />
                    <a onClick={() => navigate('/dashboard')}>Dashboard</a>
                    <a href="#">Documents</a>
                    <a href="#" className="active">Rebuttals</a>
                </div>
                <div className="reb-nav-right">
                    <button className="reb-top-generate-btn" onClick={handleGenerate}>
                        Generate Rebuttal
                    </button>
                </div>
            </nav>

            <div className="reb-main-content">
                {/* ── Header ── */}
                <header className="reb-header">
                    <h1>Rebuttals</h1>
                    <p>
                        Case #{selectedDispute ? selectedDispute.chargebackId.slice(-6) : "4981"} -{" "}
                        {selectedDispute ? selectedDispute.status : "Pending Review"}
                    </p>
                </header>

                {/* ── Summary Cards ── */}
                <div className="reb-summary-grid">
                    <div className="reb-stat-card">
                        <div className="reb-stat-icon purple-glow"><Scale size={20} /></div>
                        <div className="reb-stat-info">
                            <span>Active Rebuttals</span>
                            <div className="reb-stat-value">
                                <strong>14</strong>
                            </div>
                        </div>
                    </div>

                    <div className="reb-stat-card">
                        <div className="reb-stat-icon teal-glow"><FileText size={20} /></div>
                        <div className="reb-stat-info">
                            <span>Documents Analyzed</span>
                            <div className="reb-stat-value">
                                <strong>129</strong>
                            </div>
                        </div>
                    </div>

                    <div className="reb-stat-card">
                        <div className="reb-stat-icon purple-glow"><TrendingUp size={20} /></div>
                        <div className="reb-stat-info">
                            <span>Submission Score</span>
                            <div className="reb-stat-value">
                                <strong>8.2</strong>
                            </div>
                        </div>
                    </div>

                    <div className="reb-stat-card">
                        <div className="reb-stat-icon teal-glow" style={{ padding: '4px' }}>
                            <img src={rebuttalIcon} alt="AI Rebuttals" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div className="reb-stat-info">
                            <span>AI-Generated Points</span>
                            <div className="reb-stat-value">
                                <strong>67</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Split Layout ── */}
                <div className="reb-split-layout">
                    {/* Left: Rebuttals List */}
                    <div className="reb-list-section">
                        <h2>Rebuttals List</h2>
                        <div className="reb-list-container">
                            {disputes.map((dispute) => (
                                <div
                                    key={dispute._id}
                                    className={`reb-list-card ${selectedDispute?._id === dispute._id ? 'active' : ''}`}
                                    onClick={() => setSelectedDispute(dispute)}
                                >
                                    <div className="reb-card-status">
                                        ID: <strong>{dispute.chargebackId}</strong>
                                        <br />
                                        Status: <span className="reb-badge">{dispute.status}</span>
                                    </div>
                                    <div className="reb-card-claim">
                                        Claim: '{dispute.reasonCode || "Dispute Claim"}'
                                    </div>
                                    <div className="reb-card-footer">
                                        <span>Author: System AI</span>
                                        <span>
                                            {dispute.updatedAt
                                                ? new Date(dispute.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                                : "Oct 26, 2023"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {disputes.length === 0 && (
                                <div className="reb-empty-list">No rebuttals found.</div>
                            )}
                        </div>
                    </div>

                    {/* Right: Document Preview */}
                    <div className="reb-preview-section">
                        <h2>Document Preview</h2>
                        <div className="reb-document-paper">
                            {selectedDispute ? (
                                <>
                                    <h3 className="reb-doc-title">
                                        REBUTTAL CONCERNING CLAIM #{selectedDispute.chargebackId.slice(-6).toUpperCase()}
                                    </h3>
                                    <div className="reb-doc-meta">
                                        <strong>Date:</strong> {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}<br />
                                        <strong>Case Number:</strong> {selectedDispute.chargebackId}
                                    </div>

                                    <div className="evidence-analyzer-container">
                                        <div className="evidence-analyzer-header">
                                            <h3 style={{ margin: 0 }}>Evidence Strength</h3>
                                            <div className={`evidence-score-badge level-${evidenceAnalysis.level.toLowerCase()}`}>
                                                {evidenceAnalysis.score} / 100
                                            </div>
                                        </div>
                                        
                                        <div className="evidence-breakdown">
                                            {evidenceAnalysis.items.map((item, idx) => (
                                                <div className="evidence-breakdown-item" key={idx}>
                                                    <div className="evidence-item-label">
                                                        <span className={item.present ? "status-icon present" : "status-icon missing"}>
                                                            {item.present ? "✓" : "⚠"}
                                                        </span>
                                                        {item.label}
                                                    </div>
                                                    <div className={item.present ? "evidence-status present" : "evidence-status missing"}>
                                                        {item.present ? "Strong" : "Missing"}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="evidence-recommendation">
                                            <strong>Recommendation:</strong> {evidenceAnalysis.recommendation}
                                        </div>
                                    </div>

                                    {selectedDispute.rebuttalLetterText ? (
                                        <div className="reb-doc-body">
                                            {selectedDispute.rebuttalLetterText.split('\n').map((para, idx) => (
                                                <p key={idx}>{para}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="reb-doc-body">
                                            <p><strong>I. INTRODUCTION...</strong></p>
                                            <p>This is a placeholder for the generated rebuttal. Click "Generate Rebuttal" below to draft an AI response based on the dispute details and attached evidence.</p>
                                            <p><strong>II. EVIDENCE ANALYSIS...</strong></p>
                                            <p>The AI will analyze prior evidence and formulate a comprehensive defense.</p>
                                            <p><strong>Conclusion...</strong></p>
                                            <p>... submitted with utmost formality.</p>
                                        </div>
                                    )}

                                    <div className="reb-doc-actions">
                                        <button className="reb-btn-secondary" onClick={handleGenerate}>
                                            ✦ Generate Rebuttal
                                        </button>
                                        <div className="reb-actions-right">
                                            <button className="reb-btn-outline"
                                                onClick={async () => {
                                                    if (!selectedDispute?.pdfUrl) {
                                                        alert("PDF is not available. Generate the rebuttal first.");
                                                        return;
                                                    }

                                                    const token = localStorage.getItem("token");

                                                    const response = await fetch(
                                                        `http://localhost:5000/api/disputes/${selectedDispute._id}/download-pdf`,
                                                        {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        }
                                                    );

                                                    if (!response.ok) {
                                                        alert("Failed to download PDF.");
                                                        return;
                                                    }

                                                    const blob = await response.blob();
                                                    const url = window.URL.createObjectURL(blob);

                                                    const link = document.createElement("a");
                                                    link.href = url;
                                                    link.download = "rebuttal.pdf";
                                                    link.click();

                                                    window.URL.revokeObjectURL(url);
                                                }}
                                            >
                                                ↓ Download PDF
                                            </button>

                                            {/* // window.open(
                                                    //     `http://localhost:5000${selectedDispute.pdfUrl}`,
                                            //     "_blank"
                                            // ); */}

                                            <button
                                                className="reb-btn-primary"
                                                onClick={async () => {
                                                    if (!selectedDispute) {
                                                        alert("Please select a dispute.");
                                                        return;
                                                    }

                                                    if (!selectedDispute.rebuttalLetterText) {
                                                        alert("Please generate the rebuttal first.");
                                                        return;
                                                    }

                                                    try {
                                                        const token = localStorage.getItem("token");

                                                        const response = await fetch(
                                                            `http://localhost:5000/api/disputes/${selectedDispute._id}/finalize`,
                                                            {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type": "application/json",
                                                                    Authorization: `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({
                                                                    decision: "SUBMITTED",
                                                                    reason: "Rebuttal submitted"
                                                                })
                                                            }
                                                        );

                                                        const data = await response.json();

                                                        if (!response.ok) {
                                                            throw new Error(data.message || "Failed to submit rebuttal");
                                                        }

                                                        alert("Rebuttal submitted successfully.");

                                                        setSelectedDispute((prev) => ({
                                                            ...prev,
                                                            finalDecision: data.finalDecision
                                                        }));

                                                    } catch (error) {
                                                        console.error("Submit rebuttal failed:", error);
                                                        alert(`Submit failed: ${error.message}`);
                                                    }
                                                }}
                                            >
                                                Submit Rebuttal
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="reb-doc-empty">
                                    Select a dispute from the list to view the document.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
                </div>
            </main>
        </div >
    );
}

export default Rebuttals;