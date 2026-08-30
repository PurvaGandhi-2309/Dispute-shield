import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
    const [disputes, setDisputes] = useState([]);

    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                const data = await apiRequest("/disputes");
                setDisputes(data);
                console.log("Disputes:", data);
            } catch (error) {
                console.error("Failed to fetch disputes:", error);
            }
        };

        fetchDisputes();
    }, []);

    // Derived Metrics
    const activeDisputesCount = disputes.length;
    const amountAtRisk = disputes.reduce((total, dispute) => total + (dispute.amount || 0), 0);
    const recoveryRate = disputes.length
        ? Math.round(disputes.reduce((total, dispute) => total + (dispute.winProbabilityScore || 0), 0) / disputes.length)
        : 0;
    const resolvedCount = disputes.filter(d => d.status === "WON" || d.status === "LOST").length;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">D</div>
                    <span className="brand-text">DisputeShield</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-item active">
                        <span className="nav-icon">⊞</span>
                        Overview
                    </div>
                    <Link to="/disputes" className="nav-item">
                        <span className="nav-icon">◈</span>
                        Disputes
                    </Link>
                    <Link to="/evidence" className="nav-item">
                        <span className="nav-icon">📄</span>
                        Evidence
                    </Link>
                    <Link to="/rebuttals" className="nav-item">
                        <span className="nav-icon">✨</span>
                        Rebuttals
                    </Link>
                    <div className="nav-item">
                        <span className="nav-icon">📊</span>
                        Analytics
                    </div>
                </nav>

                <div className="sidebar-bottom">
                    <div className="nav-item">
                        <span className="nav-icon">⚙️</span>
                        Settings
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Topbar */}
                <header className="dashboard-topnav">
                    <div className="search-container">
                        <span>🔍</span>
                        <input type="text" placeholder="Search disputes..." />
                    </div>
                    <div className="topnav-actions">
                        <button className="btn-icon">🔔</button>
                        <div className="user-profile">
                            <div className="user-avatar">M</div>
                            <div className="user-info">
                                <strong>Merchant</strong>
                                <small>Admin</small>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="dashboard-content-scroll">
                    {/* Header */}
                    <div className="dashboard-header">
                        <div className="header-left">
                            <p className="eyebrow">OVERVIEW</p>
                            <h1>Good morning, Merchant 👋</h1>
                            <p>Here's what's happening with your disputes today.</p>
                        </div>
                        <button className="btn-primary">
                            <span>+</span> New Dispute
                        </button>
                    </div>

                    {/* Metrics */}
                    <div className="metrics-grid">
                        <div className="metric-card primary">
                            <div className="metric-top">
                                <span>Active Disputes</span>
                                <span className="metric-icon">◈</span>
                            </div>
                            <div className="metric-value">{activeDisputesCount}</div>
                            <div className="metric-change positive">
                                ↑ 12.5% <span>vs last month</span>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-top">
                                <span>Amount at Risk</span>
                                <span className="metric-icon">₹</span>
                            </div>
                            <div className="metric-value">₹{amountAtRisk.toLocaleString("en-IN")}</div>
                            <div className="metric-change negative">
                                ↑ 4.8% <span>vs last month</span>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-top">
                                <span>Recovery Rate</span>
                                <span className="metric-icon">↗</span>
                            </div>
                            <div className="metric-value">{recoveryRate}%</div>
                            <div className="metric-change positive">
                                ↑ 8.2% <span>vs last month</span>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-top">
                                <span>Resolved</span>
                                <span className="metric-icon">✓</span>
                            </div>
                            <div className="metric-value">{resolvedCount}</div>
                            <div className="metric-change neutral">
                                18 this month
                            </div>
                        </div>
                    </div>

                    {/* Analytics Row */}
                    <div className="analytics-grid">
                        {/* Activity Chart */}
                        <section className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2>Dispute Activity</h2>
                                    <p>Disputes over the last 30 days</p>
                                </div>
                                <button className="btn-secondary">Last 30 days ▾</button>
                            </div>
                            <div className="chart-container">
                                <div className="chart-y-axis">
                                    <span>30</span>
                                    <span>20</span>
                                    <span>10</span>
                                    <span>0</span>
                                </div>
                                <div className="chart-bars">
                                    <div className="bar" style={{height: "30%"}}></div>
                                    <div className="bar" style={{height: "50%"}}></div>
                                    <div className="bar" style={{height: "40%"}}></div>
                                    <div className="bar" style={{height: "80%"}}></div>
                                    <div className="bar" style={{height: "60%"}}></div>
                                    <div className="bar" style={{height: "90%"}}></div>
                                    <div className="bar" style={{height: "50%"}}></div>
                                </div>
                                <div className="chart-x-axis">
                                    <span>Jul 12</span>
                                    <span>Jul 17</span>
                                    <span>Jul 22</span>
                                    <span>Jul 27</span>
                                    <span>Aug 1</span>
                                    <span>Aug 6</span>
                                    <span>Aug 10</span>
                                </div>
                            </div>
                        </section>

                        {/* Risk Overview */}
                        <section className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2>Risk Overview</h2>
                                    <p>Current dispute risk level</p>
                                </div>
                            </div>
                            <div className="risk-content">
                                <div className="risk-circle">
                                    <div>
                                        <strong>72%</strong>
                                        <span>Low Risk</span>
                                    </div>
                                </div>
                                <div className="risk-details">
                                    <div className="risk-item">
                                        <div className="risk-item-label">
                                            <span className="dot low"></span> Low Risk
                                        </div>
                                        <strong>18</strong>
                                    </div>
                                    <div className="risk-item">
                                        <div className="risk-item-label">
                                            <span className="dot med"></span> Medium Risk
                                        </div>
                                        <strong>4</strong>
                                    </div>
                                    <div className="risk-item">
                                        <div className="risk-item-label">
                                            <span className="dot high"></span> High Risk
                                        </div>
                                        <strong>2</strong>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Recent Disputes Table */}
                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <h2>Recent Disputes</h2>
                                <p>Latest activity across your disputes</p>
                            </div>
                            <button className="btn-secondary">View all →</button>
                        </div>
                        <div className="dispute-table-container">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {disputes.length > 0 ? (
                                        disputes.map((dispute) => (
                                            <tr key={dispute._id}>
                                                <td>
                                                    <div className="table-customer">
                                                        <div className="customer-avatar">
                                                            {dispute.chargebackId?.slice(-2) || "DS"}
                                                        </div>
                                                        <div className="customer-info">
                                                            <strong>{dispute.chargebackId || "Unknown"}</strong>
                                                            <small>#{dispute._id?.slice(-6)}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>₹{(dispute.amount || 0).toLocaleString("en-IN")}</td>
                                                <td>{dispute.reasonCode?.replaceAll("_", " ") || "N/A"}</td>
                                                <td>
                                                    <span className={`status-badge ${dispute.status?.toLowerCase() || 'pending'}`}>
                                                        {dispute.status || "Pending"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {dispute.createdAt
                                                        ? new Date(dispute.createdAt).toLocaleDateString("en-IN")
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{textAlign: "center", color: "var(--text-secondary)"}}>
                                                No disputes found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
