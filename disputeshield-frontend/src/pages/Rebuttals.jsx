import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Rebuttals.css";

function Rebuttals() {
    const [disputes, setDisputes] = useState([]);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const navigate = useNavigate();

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

    const handleGenerate = async () => {
        if (!selectedDispute) return;
        try {
            await apiRequest(`/disputes/${selectedDispute._id}/generate`, {
                method: "POST",
            });
            const data = await apiRequest("/disputes");
            setDisputes(data);
            
            // Update selected dispute to the newly generated one
            const updated = data.find(d => d._id === selectedDispute._id);
            if (updated) setSelectedDispute(updated);

        } catch (error) {
            console.error("Failed to generate rebuttal:", error);
        }
    };

    return (
        <div className="reb-page-container">
            {/* ── Top Navbar ── */}
            <nav className="reb-navbar">
                <div className="reb-nav-left">
                    <div className="reb-logo-circle"></div>
                    <a onClick={() => navigate('/dashboard')}>Dashboard</a>
                    <a href="#">Documents</a>
                    <a href="#" className="active">Rebuttals</a>
                </div>
                <div className="reb-nav-right">
                    <button className="reb-top-generate-btn" onClick={handleGenerate}>
                        Generate Rebuttal
                    </button>
                    <button className="reb-ai-btn">AI <span>⌄</span></button>
                    <button className="reb-icon-btn">⌕</button>
                    <div className="reb-avatar"></div>
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
                        <div className="reb-stat-icon purple-glow">⚖</div>
                        <div className="reb-stat-info">
                            <span>Active Rebuttals</span>
                            <div className="reb-stat-value">
                                <strong>14</strong>
                            </div>
                        </div>
                    </div>

                    <div className="reb-stat-card">
                        <div className="reb-stat-icon teal-glow">❖</div>
                        <div className="reb-stat-info">
                            <span>Documents Analyzed</span>
                            <div className="reb-stat-value">
                                <strong>129</strong>
                            </div>
                        </div>
                    </div>

                    <div className="reb-stat-card">
                        <div className="reb-stat-icon purple-glow">📈</div>
                        <div className="reb-stat-info">
                            <span>Submission Score</span>
                            <div className="reb-stat-value">
                                <strong>8.2</strong>
                            </div>
                        </div>
                    </div>

                    <div className="reb-stat-card">
                        <div className="reb-stat-icon teal-glow">✨</div>
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
                                        <strong>Date:</strong> {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}<br/>
                                        <strong>Case Number:</strong> {selectedDispute.chargebackId}
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
                                            <button className="reb-btn-outline">↓ Download PDF</button>
                                            <button className="reb-btn-primary">Submit Rebuttal</button>
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
    );
}

export default Rebuttals;