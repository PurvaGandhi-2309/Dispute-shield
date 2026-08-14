import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./Review.css";


function Review() {
    const [disputes, setDisputes] = useState([]);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewResult, setReviewResult] = useState(null);
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

    const handleReview = async () => {
        if (!selectedDispute) return;

        try {
            const result = await apiRequest(
                `/disputes/${selectedDispute._id}/review`,
                {
                    method: "POST",
                }
            );

            setReviewResult(result);

        } catch (error) {
            console.error("Failed to review dispute:", error);
        }
    };
    if (loading) {
        return (
            <div className="review-page">
                Loading review...
            </div>
        );
    }
    return (
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
                    <strong>4 days left</strong>
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
                                        <strong>{item.fileName}</strong>

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

                                <p>
                                    The available evidence supports the merchant's position
                                    regarding this dispute. The order was processed and shipped
                                    using the information associated with the transaction.
                                </p>

                                <p>
                                    Tracking information confirms the shipment details, while
                                    the supporting transaction and customer records provide
                                    additional evidence relevant to this case.
                                </p>

                                <p>
                                    Based on the evidence provided, the merchant requests that
                                    the dispute be reviewed with the attached documentation
                                    taken into consideration.
                                </p>

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

                            <div className="activity-row">
                                <span className="activity-line"></span>

                                <div>
                                    <strong>AI review completed</strong>
                                    <span>Recommendation generated</span>
                                </div>

                                <time>Today</time>
                            </div>

                            <div className="activity-row">
                                <span className="activity-line"></span>

                                <div>
                                    <strong>Conflict detection completed</strong>
                                    <span>No conflicts detected</span>
                                </div>

                                <time>Today</time>
                            </div>

                            <div className="activity-row">
                                <span className="activity-line"></span>

                                <div>
                                    <strong>Evidence uploaded</strong>
                                    <span>4 supporting items added</span>
                                </div>

                                <time>Yesterday</time>
                            </div>

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
                                <strong>REVIEW</strong>
                            </div>
                        </div>

                        <p>
                            The case has useful supporting evidence, but a human should
                            review the complete response before proceeding.
                        </p>

                    </section>


                    {/* Probability */}
                    <section className="side-section">

                        <div className="side-heading">
                            <span>WIN PROBABILITY</span>
                            <strong>82%</strong>
                        </div>

                        <div className="probability-bar">
                            <div></div>
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

                        <button className="approve-button">
                            Approve & Continue
                        </button>

                        <button className="changes-button">
                            Request Changes
                        </button>

                    </section>

                </aside>

            </main>

        </div>
    );
}

export default Review;