import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./Review.css";
import "./Dashboard.css";
import Sidebar from '../components/Sidebar';


function Review() {
    const [disputes, setDisputes] = useState([]);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewResult, setReviewResult] = useState(null);
    const [evidence, setEvidence] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [isEditingDeadline, setIsEditingDeadline] = useState(false);
    const [newDeadline, setNewDeadline] = useState("");
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [finalizeDecision, setFinalizeDecision] = useState("MERCHANT_WON");
    const [finalizeReason, setFinalizeReason] = useState("");
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                const data = await apiRequest("/disputes");

                setDisputes(data);

                if (data.length > 0) {
                    setSelectedDispute(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch disputes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDisputes();
    }, []);

    useEffect(() => {
        if (!selectedDispute) return;
        const fetchEvidenceAndTimeline = async () => {
            try {
                const evData = await apiRequest(`/disputes/${selectedDispute._id}/evidence`);
                setEvidence(evData);
                const tlData = await apiRequest(`/disputes/${selectedDispute._id}/timeline`);
                setTimeline(tlData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchEvidenceAndTimeline();
    }, [selectedDispute]);

    const handleDeadlineUpdate = async () => {
        if (!newDeadline) return setIsEditingDeadline(false);
        try {
            await apiRequest(`/disputes/${selectedDispute._id}/deadline`, {
                method: "PUT",
                body: JSON.stringify({ deadline: newDeadline })
            });
            const updatedDispute = await apiRequest(`/disputes/${selectedDispute._id}`);
            setSelectedDispute(updatedDispute);
            setIsEditingDeadline(false);
            showToast("Deadline updated successfully!");
        } catch (error) {
            console.error("Error setting deadline:", error);
            showToast("Error setting deadline", "error");
        }
    };

    const handleFinalize = async () => {
        try {
            await apiRequest(`/disputes/${selectedDispute._id}/finalize`, {
                method: "POST",
                body: JSON.stringify({ decision: finalizeDecision, reason: finalizeReason })
            });
            showToast("Dispute finalized successfully!");
            setShowFinalizeModal(false);
            const updatedDispute = await apiRequest(`/disputes/${selectedDispute._id}`);
            setSelectedDispute(updatedDispute);
        } catch (error) {
            console.error("Failed to finalize:", error);
            showToast("Error finalizing dispute", "error");
        }
    };

    const handleAiReview = async () => {
        if (!selectedDispute) return;
        try {
            await apiRequest(`/disputes/${selectedDispute._id}/ai-review`, { method: "POST" });
            const updatedDispute = await apiRequest(`/disputes/${selectedDispute._id}`);
            setSelectedDispute(updatedDispute);
            showToast("AI analysis completed!");
        } catch (error) {
            console.error("Failed to run AI review:", error);
            showToast("Error running AI analysis", "error");
        }
    };

    const handleHumanReview = async (decision) => {
        if (!selectedDispute) return;

        try {
            const result = await apiRequest(
                `/disputes/${selectedDispute._id}/human-review`,
                {
                    method: "POST",
                    body: JSON.stringify({ decision })
                }
            );

            setReviewResult(result);
            showToast(`Review submitted successfully! Decision: ${decision}`);
        } catch (error) {
            console.error("Failed to review dispute:", error);
            showToast("Error submitting review", "error");
        }
    };
    if (loading) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <main className="dashboard-main" style={{ overflowY: 'auto' }}>
                    <div className="review-page">
                        Loading review...
                    </div>
                </main>
            </div>
        );
    }
    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="dashboard-main" style={{ overflowY: 'auto' }}>
                <div className="review-page">

            {/* Header */}
            <header className="review-top">
                <div>
                    <button className="review-back">← Back to disputes</button>

                    <div className="review-title-row">
                        <div>
                            <span className="review-eyebrow">CASE REVIEW</span>
                            <h1>Review dispute
                                {/* <span>#DS-1024</span> */}
                                Dispute #{selectedDispute?.chargebackId || "—"}
                            </h1>
                            <p>Review the evidence and AI analysis before taking action.</p>
                        </div>

                        <div className="review-status">
                            <span className="status-dot"></span>
                            Needs review
                        </div>
                    </div>
                </div>
            </header>


            {/* Case overview */}
            <section className="case-overview">

                <div className="case-overview-item">
                    <span>DISPUTE AMOUNT</span>
                    {/* <strong>$249.00</strong> */}
                    <strong>
                        ₹{selectedDispute?.amount || 0}
                    </strong>
                </div>

                {/* <div className="case-overview-item">
                    <span>REASON</span>
                    <strong>Product not received</strong>
                </div> */}
                <div className="case-overview-item">
                    <span>REASON</span>
                    <strong>
                        {selectedDispute?.reasonCode || "Not specified"}
                    </strong>
                </div>

                <div className="case-overview-item">
                    <span>PRIORITY</span>
                    {/* <strong className="priority-high">High</strong> */}
                    <strong className="priority-high">
                        {selectedDispute?.priority || "Normal"}
                    </strong>
                </div>

                <div className="case-overview-item">
                    <span>DEADLINE</span>
                    {isEditingDeadline ? (
                        <div style={{ display: 'flex', gap: '5px', marginTop: '2px' }}>
                            <input 
                                type="date" 
                                value={newDeadline} 
                                onChange={(e) => setNewDeadline(e.target.value)}
                                style={{ padding: '2px 5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                            />
                            <button onClick={handleDeadlineUpdate} style={{ padding: '2px 8px', borderRadius: '4px', background: 'var(--accent-purple)', color: '#fff', border: 'none', cursor: 'pointer' }}>✓</button>
                        </div>
                    ) : (
                        <strong 
                            onClick={() => setIsEditingDeadline(true)} 
                            style={{ cursor: 'pointer', borderBottom: '1px dotted var(--text-secondary)' }}
                            title="Click to set deadline"
                        >
                            {selectedDispute?.deadline ? new Date(selectedDispute.deadline).toLocaleDateString() : "Set deadline"}
                        </strong>
                    )}
                </div>

            </section>


            {/* Main workspace */}
            <main className="review-workspace">

                {/* LEFT */}
                <div className="review-main-column">

                    {/* Evidence */}
                    <section className="review-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">01 / EVIDENCE</span>
                                <h2>Supporting evidence</h2>
                            </div>

                            {/* <span className="section-count">4 items</span> */}
                            <span className="section-count">
                                {evidence.length} items
                            </span>
                        </div>

                        <div className="evidence-list">

                            {evidence.map((item) => (
                                <div className="evidence-row" key={item._id}>
                                    <div className="evidence-symbol">
                                        {item.fileType === "application/pdf" ? "PDF" : "FILE"}
                                    </div>
                                    <div className="evidence-info">
                                        <strong>{item.fileName || "Document"}</strong>
                                        <span>
                                            {item.trackingNumber
                                                ? `Tracking: ${item.trackingNumber}`
                                                : "Supporting evidence"}
                                        </span>
                                    </div>
                                    <span className="verified">
                                        Verified
                                    </span>
                                </div>
                            ))}
                            {evidence.length === 0 && (
                                <p style={{ color: 'var(--text-muted)' }}>No evidence uploaded yet.</p>
                            )}






                        </div>

                    </section>


                    {/* Consistency */}
                    <section className="review-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">02 / CONSISTENCY</span>
                                <h2>Evidence check</h2>
                            </div>

                            <span className="clear-label">✓ No conflicts</span>
                        </div>

                        <div className="consistency-box">

                            <div className="consistency-icon">✓</div>

                            <div>
                                <strong>Everything looks consistent</strong>

                                <p>
                                    The available evidence currently matches the dispute
                                    information. No conflicting details were detected.
                                </p>
                            </div>

                        </div>

                    </section>


                    {/* Rebuttal */}
                    <section className="review-section rebuttal-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">03 / RESPONSE</span>
                                <h2>Generated rebuttal</h2>
                            </div>

                            <span className="ai-label">AI ASSISTED</span>
                        </div>

                        <div className="rebuttal-document">

                            <div className="document-header">
                                <span>DISPUTE RESPONSE</span>
                                <span>Draft</span>
                            </div>

                            <div className="document-body">
                                {selectedDispute?.rebuttalLetterText ? (
                                    selectedDispute.rebuttalLetterText.split('\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-muted)' }}>No rebuttal generated yet. Head over to the Rebuttals tab to generate one.</p>
                                )}
                            </div>

                            <button className="document-action">
                                View full rebuttal →
                            </button>

                        </div>

                    </section>


                    {/* Activity */}
                    <section className="review-section activity-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">04 / HISTORY</span>
                                <h2>Recent activity</h2>
                            </div>
                        </div>

                        <div className="activity-list">
                            {timeline.length > 0 ? timeline.map((event) => (
                                <div className="activity-row" key={event._id}>
                                    <span className="activity-line"></span>
                                    <div>
                                        <strong>{event.action.replace(/_/g, ' ')}</strong>
                                        <span>{event.description}</span>
                                    </div>
                                    <time style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                                        {new Date(event.createdAt).toLocaleDateString()}
                                    </time>
                                </div>
                            )) : (
                                <p style={{ color: 'var(--text-muted)' }}>No timeline activity recorded yet.</p>
                            )}
                        </div>

                    </section>

                </div>


                {/* RIGHT */}
                <aside className="review-sidebar">

                    {/* AI insight */}
                    <section className="insight-panel">
                        <span className="panel-eyebrow">AI ANALYSIS</span>
                        <div className="insight-heading">
                            <div className="ai-icon">AI</div>
                            <div>
                                <span>Recommendation</span>
                                <strong>{selectedDispute?.aiRecommendation || "PENDING"}</strong>
                            </div>
                        </div>
                        <p>
                            {selectedDispute?.aiRecommendation
                                ? `The AI has reviewed the evidence and recommends to ${selectedDispute.aiRecommendation}.`
                                : "Click below to run AI analysis on this dispute."}
                        </p>
                        {!selectedDispute?.aiRecommendation && (
                            <button 
                                className="approve-button" 
                                style={{ marginTop: '1rem', width: '100%' }}
                                onClick={handleAiReview}
                            >
                                Run AI Analysis
                            </button>
                        )}
                    </section>


                    {/* Probability */}
                    <section className="side-section">
                        <div className="side-heading">
                            <span>WIN PROBABILITY</span>
                            <strong>{selectedDispute?.winProbabilityScore || 0}%</strong>
                        </div>
                        <div className="probability-bar">
                            <div style={{ width: `${selectedDispute?.winProbabilityScore || 0}%` }}></div>
                        </div>
                        <span className="side-note">Strong evidence foundation</span>
                    </section>


                    {/* Checklist */}
                    <section className="side-section">

                        <span className="panel-eyebrow">REVIEW CHECKLIST</span>

                        <div className="review-checklist">

                            <div className="check-row">
                                <span className="check-icon">✓</span>

                                <div>
                                    <strong>Dispute information</strong>
                                    <small>Checked</small>
                                </div>
                            </div>

                            <div className="check-row">
                                <span className="check-icon">✓</span>

                                <div>
                                    <strong>Evidence</strong>
                                    <small>Checked</small>
                                </div>
                            </div>

                            <div className="check-row">
                                <span className="check-icon">✓</span>

                                <div>
                                    <strong>Conflict detection</strong>
                                    <small>Completed</small>
                                </div>
                            </div>

                            <div className="check-row pending">
                                <span className="check-icon">○</span>

                                <div>
                                    <strong>Human decision</strong>
                                    <small>Waiting for review</small>
                                </div>
                            </div>

                        </div>

                    </section>


                    {/* Decision */}
                    <section className="decision-panel">

                        <span className="panel-eyebrow">YOUR DECISION</span>

                        <h3>Ready to review?</h3>

                        <p>
                            Choose what should happen with this dispute next.
                        </p>

                        <button className="approve-button" onClick={() => setShowFinalizeModal(true)}>
                            Finalize Dispute
                        </button>

                        <button className="changes-button" onClick={() => handleHumanReview("REJECT")}>
                            Request Changes
                        </button>

                    </section>

                </aside>

            </main>

            {/* Finalize Modal */}
            {showFinalizeModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="finalize-modal" style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '16px', width: '450px', border: '1px solid #e5e7eb', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: '#111827', fontSize: '1.5rem', fontWeight: '700' }}>Finalize Dispute</h2>
                        
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Final Outcome</label>
                            <select 
                                value={finalizeDecision} 
                                onChange={(e) => setFinalizeDecision(e.target.value)}
                                style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '0.95rem', outline: 'none' }}
                            >
                                <option value="MERCHANT_WON">Merchant Won</option>
                                <option value="MERCHANT_LOST">Merchant Lost</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Closing Notes</label>
                            <textarea 
                                value={finalizeReason} 
                                onChange={(e) => setFinalizeReason(e.target.value)}
                                placeholder="Add any final notes or reasons for this decision..."
                                style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', minHeight: '100px', resize: 'vertical', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowFinalizeModal(false)} style={{ padding: '0.65rem 1.25rem', background: '#f3f4f6', border: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: 600, borderRadius: '8px', transition: 'background 0.2s' }}>Cancel</button>
                            <button onClick={handleFinalize} style={{ padding: '0.65rem 1.25rem', background: '#655dd2', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'opacity 0.2s', boxShadow: '0 4px 12px rgba(101, 93, 210, 0.3)' }}>Submit Decision</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 9999,
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    animation: 'slideUp 0.3s ease-out forwards'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>{toast.type === 'success' ? '✓' : '⚠'}</span>
                    <span>{toast.message}</span>
                </div>
            )}

                </div>
            </main>
        </div>
    );
}

export default Review;