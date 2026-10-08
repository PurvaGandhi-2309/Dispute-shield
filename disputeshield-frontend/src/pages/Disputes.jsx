import { apiRequest } from "../services/api";
import React, { useEffect, useState } from "react";
import "./Disputes.css";
import { ShieldAlert } from 'lucide-react';

function Disputes() {
    const [disputes, setDisputes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [activeStatus, setActiveStatus] = useState("ALL");
    const [showFilters, setShowFilters] = useState(false);
    const [formData, setFormData] = useState({
        chargebackId: "",
        amount: "",
        reasonCode: "",
        shippingAddress: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
        }
    });

    const [creating, setCreating] = useState(false);
    const [actionMenuOpen, setActionMenuOpen] = useState(null);

    const handleDeleteDispute = async (id) => {
        if (!window.confirm("Are you sure you want to delete this dispute?")) return;
        try {
            await apiRequest(`/disputes/${id}`, { method: "DELETE" });
            setDisputes(prev => prev.filter(d => d._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete dispute");
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await apiRequest(`/disputes/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus })
            });
            setDisputes(prev => prev.map(d => d._id === id ? { ...d, status: newStatus } : d));
            setActionMenuOpen(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

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

    const handleCreateDispute = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);

            const newDispute = await apiRequest("/disputes", {
                method: "POST",
                body: JSON.stringify({
                    chargebackId: formData.chargebackId,
                    amount: Number(formData.amount),
                    reasonCode: formData.reasonCode,
                    shippingAddress: formData.shippingAddress
                })
            });

            setDisputes((prev) => [newDispute, ...prev]);

            setFormData({
                chargebackId: "",
                amount: "",
                reasonCode: "",
                shippingAddress: {
                    street: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: ""
                }
            });

            setShowForm(false);

            alert("Dispute created successfully!");

        } catch (error) {
            console.error("Create dispute error:", error);
            alert(error.message || "Failed to create dispute");
        } finally {
            setCreating(false);
        }
    };

    // const filteredDisputes = disputes.filter((d) => {
    //     const q = searchQuery.toLowerCase();
    //     return (
    //         d.chargebackId?.toLowerCase().includes(q) ||
    //         d.reasonCode?.toLowerCase().includes(q) ||
    //         d.status?.toLowerCase().includes(q)
    //     );
    // });
    const filteredDisputes = disputes.filter((d) => {
        const q = searchQuery.toLowerCase();

        const matchesSearch =
            d.chargebackId?.toLowerCase().includes(q) ||
            d.reasonCode?.toLowerCase().includes(q) ||
            d.status?.toLowerCase().includes(q);

        const matchesStatus =
            activeStatus === "ALL" ||
            d.status === activeStatus;

        return matchesSearch && matchesStatus;
    });

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

                <button
                    className="new-dispute-btn"
                    onClick={() => setShowForm(true)}
                >
                    <span>+</span>
                    New Dispute
                </button>
            </div>
            {/* {showForm && (
                <div>
                    <h2>New Dispute</h2>

                    <button onClick={() => setShowForm(false)}>
                        Close
                    </button>

                    <p>Form will go here.</p>
                </div>
            )} */}
            {/* {showForm && (
                <div className="new-dispute-form">

                    <h2>New Dispute</h2>

                    <form onSubmit={handleCreateDispute}>

                        <input
                            type="text"
                            placeholder="Chargeback ID"
                            value={formData.chargebackId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    chargebackId: e.target.value
                                })
                            }
                            required
                        />

                        <input
                            type="number"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value
                                })
                            }
                            required
                        />

                        <input
                            type="text"
                            placeholder="Reason Code"
                            value={formData.reasonCode}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    reasonCode: e.target.value
                                })
                            }
                            required
                        />

                        <input
                            type="text"
                            placeholder="Street"
                            value={formData.shippingAddress.street}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    shippingAddress: {
                                        ...formData.shippingAddress,
                                        street: e.target.value
                                    }
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="City"
                            value={formData.shippingAddress.city}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    shippingAddress: {
                                        ...formData.shippingAddress,
                                        city: e.target.value
                                    }
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="State"
                            value={formData.shippingAddress.state}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    shippingAddress: {
                                        ...formData.shippingAddress,
                                        state: e.target.value
                                    }
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Zip Code"
                            value={formData.shippingAddress.zipCode}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    shippingAddress: {
                                        ...formData.shippingAddress,
                                        zipCode: e.target.value
                                    }
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Country"
                            value={formData.shippingAddress.country}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    shippingAddress: {
                                        ...formData.shippingAddress,
                                        country: e.target.value
                                    }
                                })
                            }
                        />

                        <button type="submit" disabled={creating}>
                            {creating ? "Creating..." : "Create Dispute"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                        >
                            Close
                        </button>

                    </form>
                </div>
            )} */}
            {showForm && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowForm(false)}
                >
                    <div
                        className="new-dispute-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Modal Header */}
                        <div className="modal-header">
                            <div>
                                <p className="modal-eyebrow">DISPUTE MANAGEMENT</p>
                                <h2>New Dispute</h2>
                                <p className="modal-description">
                                    Create a new customer dispute and add the relevant details.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreateDispute}>

                            <div className="form-section">
                                <h3>Dispute Details</h3>

                                <div className="form-grid">

                                    <div className="form-field">
                                        <label>Chargeback ID</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. CB-1024"
                                            value={formData.chargebackId}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    chargebackId: e.target.value
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Amount</label>
                                        <div className="input-with-prefix">
                                            <span>₹</span>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.amount}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        amount: e.target.value
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field full-width">
                                        <label>Reason Code</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. PRODUCT_NOT_RECEIVED"
                                            value={formData.reasonCode}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    reasonCode: e.target.value
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="form-section">
                                <h3>Shipping Address</h3>

                                <div className="form-grid">

                                    <div className="form-field full-width">
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            placeholder="Enter street address"
                                            value={formData.shippingAddress.street}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    shippingAddress: {
                                                        ...formData.shippingAddress,
                                                        street: e.target.value
                                                    }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            placeholder="City"
                                            value={formData.shippingAddress.city}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    shippingAddress: {
                                                        ...formData.shippingAddress,
                                                        city: e.target.value
                                                    }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            placeholder="State"
                                            value={formData.shippingAddress.state}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    shippingAddress: {
                                                        ...formData.shippingAddress,
                                                        state: e.target.value
                                                    }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>ZIP Code</label>
                                        <input
                                            type="text"
                                            placeholder="ZIP code"
                                            value={formData.shippingAddress.zipCode}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    shippingAddress: {
                                                        ...formData.shippingAddress,
                                                        zipCode: e.target.value
                                                    }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            value={formData.shippingAddress.country}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    shippingAddress: {
                                                        ...formData.shippingAddress,
                                                        country: e.target.value
                                                    }
                                                })
                                            }
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Footer */}
                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="create-dispute-btn"
                                    disabled={creating}
                                >
                                    {creating ? "Creating..." : "Create Dispute"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}


            {/* Summary */}
            {/* Summary */}
            <div className="dispute-summary">

                <div
                    className={`summary-item ${activeStatus === "ALL" ? "active" : ""}`}
                    onClick={() => setActiveStatus("ALL")}
                >
                    <span>All Disputes</span>
                    <strong>{disputes.length}</strong>
                </div>

                <div
                    className={`summary-item ${activeStatus === "NEEDS_EVIDENCE" ? "active" : ""}`}
                    onClick={() => setActiveStatus("NEEDS_EVIDENCE")}
                >
                    <span>Needs Evidence</span>
                    <strong>
                        {disputes.filter((d) => d.status === "NEEDS_EVIDENCE").length}
                    </strong>
                </div>

                <div
                    className={`summary-item ${activeStatus === "GENERATING" ? "active" : ""}`}
                    onClick={() => setActiveStatus("GENERATING")}
                >
                    <span>Generating</span>
                    <strong>
                        {disputes.filter((d) => d.status === "GENERATING").length}
                    </strong>
                </div>

                <div
                    className={`summary-item ${activeStatus === "SUBMITTED" ? "active" : ""}`}
                    onClick={() => setActiveStatus("SUBMITTED")}
                >
                    <span>Submitted</span>
                    <strong>
                        {disputes.filter((d) => d.status === "SUBMITTED").length}
                    </strong>
                </div>

                <div
                    className={`summary-item ${activeStatus === "WON" ? "active" : ""}`}
                    onClick={() => setActiveStatus("WON")}
                >
                    <span>Won</span>
                    <strong>
                        {disputes.filter((d) => d.status === "WON").length}
                    </strong>
                </div>

            </div>
            {/* Filters */}
            <div className="dispute-controls">

                <div className="dispute-search">
                    <span>⌕</span>
                    <input
                        type="text"
                        placeholder="Search by customer or dispute ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="control-buttons">
                    <button onClick={() => setShowFilters(!showFilters)}>
                        Filter
                        <span>⌄</span>
                    </button>

                    <button>
                        Sort
                        <span>⌄</span>
                    </button>
                </div>

            </div>
            {showFilters && (
                <div className="filter-menu">

                    <button onClick={() => {
                        setActiveStatus("ALL");
                        setShowFilters(false);
                    }}>
                        All Disputes
                    </button>

                    <button onClick={() => {
                        setActiveStatus("NEEDS_EVIDENCE");
                        setShowFilters(false);
                    }}>
                        Needs Evidence
                    </button>

                    <button onClick={() => {
                        setActiveStatus("GENERATING");
                        setShowFilters(false);
                    }}>
                        Generating
                    </button>

                    <button onClick={() => {
                        setActiveStatus("SUBMITTED");
                        setShowFilters(false);
                    }}>
                        Submitted
                    </button>

                    <button onClick={() => {
                        setActiveStatus("WON");
                        setShowFilters(false);
                    }}>
                        Won
                    </button>

                </div>
            )}


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
                        <span></span>
                    </div>

                    {filteredDisputes.length > 0 ? (
                        filteredDisputes.map((dispute) => (
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

                                <div style={{ position: 'relative' }}>
                                    <button 
                                        onClick={() => setActionMenuOpen(actionMenuOpen === dispute._id ? null : dispute._id)}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.2rem', padding: '5px' }}
                                    >
                                        ⋮
                                    </button>
                                    
                                    {actionMenuOpen === dispute._id && (
                                        <div style={{ position: 'absolute', right: '0', top: '30px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', width: '150px' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', paddingLeft: '8px' }}>CHANGE STATUS</div>
                                            <button onClick={() => handleUpdateStatus(dispute._id, "NEEDS_EVIDENCE")} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>Needs Evidence</button>
                                            <button onClick={() => handleUpdateStatus(dispute._id, "UNDER_REVIEW")} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>Under Review</button>
                                            <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }}></div>
                                            <button onClick={() => handleDeleteDispute(dispute._id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.85rem' }}>Delete Dispute</button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="disputes-empty">
                            <div className="empty-icon"><ShieldAlert size={48} style={{ opacity: 0.5 }} /></div>
                            <p>No disputes found.</p>
                            <small>Try adjusting your search or filters.</small>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Disputes;