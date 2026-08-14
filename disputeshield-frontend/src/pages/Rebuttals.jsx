import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./Rebuttals.css";

function Rebuttals() {

    const [disputes, setDisputes] = useState([]);

    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                // const data = await apiRequest("/disputes");
                // setDisputes(data);
                const data = await apiRequest("/disputes");

                console.log("Rebuttals disputes:", data);

                setDisputes(data);
            } catch (error) {
                console.error("Failed to fetch disputes:", error);
            }
        };

        fetchDisputes();
    }, []);
    return (
        <div className="rebuttals-page">

            {/* Header */}
            <div className="rebuttals-header">
                <div>
                    <p className="eyebrow">AI DISPUTE RESPONSE</p>
                    <h1>Rebuttals</h1>
                    <p className="page-description">
                        Generate, review, and manage responses for your disputes.
                    </p>
                </div>

                <button className="generate-btn">
                    <span>✦</span>
                    Generate Rebuttal
                </button>
            </div>


            {/* Overview */}
            <div className="rebuttal-summary">

                <div className="rebuttal-stat">
                    <span>Total Rebuttals</span>
                    <strong>14</strong>
                    <small>Across active disputes</small>
                </div>

                <div className="rebuttal-stat">
                    <span>Needs Review</span>
                    <strong>4</strong>
                    <small>Waiting for human review</small>
                </div>

                <div className="rebuttal-stat">
                    <span>Submitted</span>
                    <strong>7</strong>
                    <small>Responses submitted</small>
                </div>

                <div className="rebuttal-stat">
                    <span>Avg. Win Probability</span>
                    <strong>78%</strong>
                    <small>Based on available evidence</small>
                </div>

            </div>


            {/* Filters */}
            <div className="rebuttal-controls">

                <div className="rebuttal-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search by dispute ID or customer..."
                    />
                </div>

                <div className="rebuttal-filters">

                    <button>
                        All Status
                        <span>⌄</span>
                    </button>

                    <button>
                        Sort
                        <span>⌄</span>
                    </button>

                </div>

            </div>


            {/* Rebuttal Cards */}
            <div className="rebuttal-list">
                {disputes.map((dispute) => (
                    <div className="rebuttal-card" key={dispute._id}>

                        <div className="rebuttal-card-header">

                            <div className="rebuttal-identity">

                                <div className="rebuttal-icon">✦</div>

                                <div>
                                    <strong>
                                        Dispute #{dispute.chargebackId}
                                    </strong>

                                    <small>
                                        ₹{dispute.amount}
                                    </small>
                                </div>

                            </div>

                            <span className="review-status review">
                                {dispute.status}
                            </span>

                        </div>


                        <div className="rebuttal-content">

                            <div className="rebuttal-info">

                                <div className="info-item">
                                    <span>Reason</span>

                                    <strong>
                                        {dispute.reasonCode || "Not specified"}
                                    </strong>
                                </div>

                                <div className="info-item">
                                    <span>Evidence</span>

                                    <strong>
                                        Available
                                    </strong>
                                </div>

                                <div className="info-item">
                                    <span>Updated</span>

                                    <strong>
                                        {dispute.updatedAt
                                            ? new Date(dispute.updatedAt).toLocaleDateString()
                                            : "—"}
                                    </strong>
                                </div>

                            </div>


                            <div className="probability">

                                <div className="probability-top">
                                    <span>Win Probability</span>

                                    <strong>
                                        {dispute.winProbabilityScore || 0}%
                                    </strong>
                                </div>

                                <div className="probability-bar">

                                    <div
                                        className="probability-fill"
                                        style={{
                                            width: `${dispute.winProbabilityScore || 0}%`
                                        }}
                                    ></div>

                                </div>

                                <small>
                                    Based on available evidence
                                </small>

                            </div>

                        </div>


                        <div className="rebuttal-preview">

                            <div className="preview-header">

                                <span>
                                    AI-generated rebuttal
                                </span>

                                <span className="ai-badge">
                                    AI
                                </span>

                            </div>

                            <p>
                                {dispute.rebuttalLetterText ||
                                    "No rebuttal generated yet."}
                            </p>

                        </div>


                        <div className="rebuttal-actions">

                            <button className="secondary-btn">
                                Edit
                            </button>


                            <button
                                className="primary-btn"
                                onClick={async () => {
                                    try {
                                        await apiRequest(
                                            `/disputes/${dispute._id}/generate`,
                                            {
                                                method: "POST",
                                            }
                                        );

                                        const data = await apiRequest("/disputes");
                                        setDisputes(data);

                                    } catch (error) {
                                        console.error("Failed to generate rebuttal:", error);
                                    }
                                }}
                            >
                                Generate Rebuttal
                            </button>

                        </div>

                    </div>
                ))}


                {/* Rebuttal 1
                <div className="rebuttal-card">

                    <div className="rebuttal-card-header">

                        <div className="rebuttal-identity">
                            <div className="rebuttal-icon">✦</div>

                            <div>
                                <strong>Dispute #DS-1024</strong>
                                <small>Rahul Sharma · ₹4,500</small>
                            </div>
                        </div>

                        <span className="review-status review">
                            Needs Review
                        </span>

                    </div>


                    <div className="rebuttal-content">

                        <div className="rebuttal-info">

                            <div className="info-item">
                                <span>Reason</span>
                                <strong>Fraudulent transaction</strong>
                            </div>

                            <div className="info-item">
                                <span>Evidence</span>
                                <strong>4 files attached</strong>
                            </div> */}
                {/* 
                            <div className="info-item">
                                <span>Generated</span>
                                <strong>10 Aug 2026</strong>
                            </div>

                        </div>


                        <div className="probability">

                            <div className="probability-top">
                                <span>Win Probability</span>
                                <strong>82%</strong>
                            </div>

                            <div className="probability-bar">
                                <div
                                    className="probability-fill"
                                    style={{ width: "82%" }}
                                ></div>
                            </div>

                            <small>Strong evidence available</small>

                        </div>

                    </div> */}
                {/* 

                    <div className="rebuttal-preview">

                        <div className="preview-header">
                            <span>AI-generated rebuttal</span>
                            <span className="ai-badge">AI</span>
                        </div>

                        <p>
                            The transaction was successfully completed and the available
                            evidence supports the legitimacy of the purchase. Order,
                            delivery, and customer information are available for review.
                        </p>

                    </div>


                    <div className="rebuttal-actions">

                        <button className="secondary-btn">
                            Edit
                        </button>

                        <button className="primary-btn">
                            Review Rebuttal
                        </button>

                    </div>

                // </div> */}
                {/* <p>
                            The merchant has provided supporting documentation regarding
                            the order, delivery process, and product condition. The
                            submitted evidence supports the merchant's position.
                        </p> */}



            </div>

        </div>
    );
}

export default Rebuttals;