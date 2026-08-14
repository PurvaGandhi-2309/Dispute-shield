// 
import { apiRequest } from "../services/api";
import React, { useEffect, useState } from "react";
import "./Disputes.css";

function Disputes() {
    const [disputes, setDisputes] = useState([]);

    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                const data = await apiRequest("/disputes");
                setDisputes(data);
            } catch (error) {
                console.error("Failed to fetch disputes:", error);
            }
        };

        fetchDisputes();
    }, []);
    return (
        <div className="disputes-page">

            {/* Page Header */}
            <div className="disputes-header">
                <div>
                    <p className="eyebrow">DISPUTE MANAGEMENT</p>
                    <h1>Disputes</h1>
                    <p className="page-description">
                        Review, manage, and track all your customer disputes.
                    </p>
                </div>

                <button className="new-dispute-btn">
                    <span>+</span>
                    New Dispute
                </button>
            </div>


            {/* Summary */}
            <div className="dispute-summary">

                <div className="summary-item active">
                    <span>All Disputes</span>
                    <strong>24</strong>
                </div>

                <div className="summary-item">
                    <span>Needs Evidence</span>
                    <strong>8</strong>
                </div>

                <div className="summary-item">
                    <span>Generating</span>
                    <strong>4</strong>
                </div>

                <div className="summary-item">
                    <span>Submitted</span>
                    <strong>6</strong>
                </div>

                <div className="summary-item">
                    <span>Won</span>
                    <strong>6</strong>
                </div>

            </div>


            {/* Filters */}
            <div className="dispute-controls">

                <div className="dispute-search">
                    <span>⌕</span>
                    <input
                        type="text"
                        placeholder="Search by customer or dispute ID..."
                    />
                </div>

                <div className="control-buttons">
                    <button>
                        Filter
                        <span>⌄</span>
                    </button>

                    <button>
                        Sort
                        <span>⌄</span>
                    </button>
                </div>

            </div>


            {/* Disputes Table */}
            <div className="disputes-card">

                <div className="disputes-table">

                    <div className="disputes-table-header">
                        <span>Dispute</span>
                        <span>Customer</span>
                        <span>Amount</span>
                        <span>Reason</span>
                        <span>Status</span>
                        <span>Deadline</span>
                    </div>


                    {/* Row 1 */}
                    {/* <div className="disputes-table-row"> */}
                    {disputes.map((dispute) => (
                        <div className="disputes-table-row" key={dispute._id}>

                            <div className="dispute-id">
                                <strong>#{dispute.chargebackId}</strong>

                                <small>
                                    {dispute.createdAt
                                        ? new Date(dispute.createdAt).toLocaleDateString("en-IN")
                                        : "N/A"}
                                </small>
                            </div>

                            <div className="customer-cell">
                                <div className="customer-avatar">
                                    {dispute.chargebackId?.slice(-2) || "DS"}
                                </div>

                                <div>
                                    <strong>{dispute.chargebackId}</strong>
                                    <small>Merchant dispute</small>
                                </div>
                            </div>

                            <strong>
                                ₹{(dispute.amount || 0).toLocaleString("en-IN")}
                            </strong>

                            <span>
                                {dispute.reasonCode?.replaceAll("_", " ") || "N/A"}
                            </span>

                            <span className={`status ${dispute.status?.toLowerCase()}`}>
                                {dispute.status || "Pending"}
                            </span>

                            <span className="deadline">
                                {dispute.deadline
                                    ? new Date(dispute.deadline).toLocaleDateString("en-IN")
                                    : "No deadline"}
                            </span>

                        </div>
                    ))}


                </div>

            </div>

        </div>

        // </div>
    );
}

export default Disputes;