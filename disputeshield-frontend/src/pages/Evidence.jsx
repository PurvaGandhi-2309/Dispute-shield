import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./Evidence.css";

function Evidence() {
    const [disputes, setDisputes] = useState([]);
    const [selectedDispute, setSelectedDispute] = useState("");
    const [evidence, setEvidence] = useState([]);

    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                const data = await apiRequest("/disputes");
                setDisputes(data);

                if (data.length > 0) {
                    setSelectedDispute(data[0]._id);
                }
            } catch (error) {
                console.error("Failed to fetch disputes:", error);
            }
        };

        fetchDisputes();
    }, []);

    useEffect(() => {
        if (!selectedDispute) return;

        const fetchEvidence = async () => {
            try {
                const data = await apiRequest(
                    `/disputes/${selectedDispute}/evidence`
                );

                setEvidence(data);
            } catch (error) {
                console.error("Failed to fetch evidence:", error);
            }
        };

        fetchEvidence();
    }, [selectedDispute]);
    return (
        <div className="evidence-page">

            {/* Header */}
            <div className="evidence-header">
                <div>
                    <p className="eyebrow">EVIDENCE MANAGEMENT</p>
                    <h1>Evidence</h1>
                    <p className="page-description">
                        Organize and review evidence attached to your disputes.
                    </p>
                    <select
                        value={selectedDispute}
                        onChange={(e) => setSelectedDispute(e.target.value)}
                    >
                        <option value="">Select dispute</option>

                        {disputes.map((dispute) => (
                            <option key={dispute._id} value={dispute._id}>
                                {dispute.chargebackId}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="upload-evidence-btn">
                    <span>+</span>
                    Upload Evidence
                </button>
            </div>


            {/* Summary Cards */}
            <div className="evidence-summary">

                <div className="evidence-stat">
                    <span>Total Evidence</span>
                    <strong>18</strong>
                    <small>Across all disputes</small>
                </div>

                <div className="evidence-stat">
                    <span>Files Uploaded</span>
                    <strong>15</strong>
                    <small>Documents and images</small>
                </div>

                <div className="evidence-stat">
                    <span>Text Extracted</span>
                    <strong>12</strong>
                    <small>Ready for review</small>
                </div>

                <div className="evidence-stat">
                    <span>Missing Evidence</span>
                    <strong>3</strong>
                    <small>Needs attention</small>
                </div>

            </div>


            {/* Controls */}
            <div className="evidence-controls">

                <div className="evidence-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search files or dispute ID..."
                    />
                </div>

                <div className="evidence-filter-buttons">
                    <button>
                        All Types
                        <span>⌄</span>
                    </button>

                    <button>
                        Filter
                        <span>⌄</span>
                    </button>
                </div>

            </div>


            {/* Evidence Table */}
            <div className="evidence-card">

                <div className="evidence-table">

                    <div className="evidence-table-header">
                        <span>Evidence</span>
                        <span>Dispute</span>
                        <span>Amount</span>
                        <span>Details</span>
                        <span>Status</span>
                        <span>Uploaded</span>
                    </div>

                    {evidence.map((item) => (
                        <div className="evidence-table-row" key={item._id}>

                            <div className="file-cell">
                                <div className="file-icon pdf">
                                    {item.fileType?.toUpperCase() || "FILE"}
                                </div>

                                <div>
                                    <strong>{item.fileName}</strong>
                                    <small>
                                        {item.fileType || "Document"}
                                    </small>
                                </div>
                            </div>

                            <div className="dispute-reference">
                                <strong>#{selectedDispute?.slice(-6)}</strong>
                                <small>Selected dispute</small>
                            </div>

                            <strong>
                                ₹{(item.amount || 0).toLocaleString("en-IN")}
                            </strong>

                            <div className="evidence-details">
                                <span>
                                    Tracking: {item.trackingNumber || "N/A"}
                                </span>

                                <span>
                                    IP: {item.customerIp || "N/A"}
                                </span>
                            </div>

                            <span className="evidence-status extracted">
                                Extracted
                            </span>

                            <span className="uploaded-date">
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString("en-IN")
                                    : "N/A"}
                            </span>

                        </div>
                    ))}


                    {/* Evidence Row 1
                    <div className="evidence-table-row">

                        <div className="file-cell">
                            <div className="file-icon pdf">PDF</div>

                            <div>
                                <strong>order-receipt.pdf</strong>
                                <small>PDF document</small>
                            </div>
                        </div>

                        <div className="dispute-reference">
                            <strong>#DS-1024</strong>
                            <small>Rahul Sharma</small>
                        </div>

                        <strong>₹4,500</strong>

                        <div className="evidence-details">
                            <span>Tracking: TRK928374</span>
                            <span>IP: 103.21.xx.xx</span>
                        </div>

                        <span className="evidence-status extracted">
                            Extracted
                        </span>

                        <span className="uploaded-date">
                            10 Aug 2026
                        </span>

                    </div>


              


                    {/* Evidence Row 3
                    <div className="evidence-table-row">

                        <div className="file-cell">
                            <div className="file-icon image">IMG</div>

                            <div>
                                <strong>product-damage.jpg</strong>
                                <small>Image</small>
                            </div>
                        </div>

                        <div className="dispute-reference">
                            <strong>#DS-1022</strong>
                            <small>Amit Shah</small>
                        </div>

                        <strong>₹7,200</strong>

                        <div className="evidence-details">
                            <span>Shipping address</span>
                            <span>Customer IP available</span>
                        </div>

                        <span className="evidence-status uploaded">
                            Uploaded
                        </span>

                        <span className="uploaded-date">
                            8 Aug 2026
                        </span>

                    </div> */}

                    {/*  */}
                </div>
            </div>


            {/* Bottom Information */}
            <div className="evidence-note">
                <div className="note-icon">i</div>

                <div>
                    <strong>Evidence strengthens your dispute</strong>
                    <p>
                        Upload receipts, delivery confirmations, tracking information,
                        customer details, and other supporting documents.
                    </p>
                </div>
            </div>

        </div>
    );
}

export default Evidence;