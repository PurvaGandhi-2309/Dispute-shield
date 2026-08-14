// 
// jsx
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import React, { useEffect, useState } from "react";

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
    return (
        <div className="dashboard">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="brand">
                    <div className="brand-mark">D</div>
                    <span>DisputeShield</span>
                </div>

                <nav className="sidebar-nav">

                    <p className="nav-item active">
                        <span className="nav-icon">▦</span>
                        Overview
                    </p>
                    {/* 
                    <p className="nav-item">
                        <span className="nav-icon">◈</span>
                        Disputes
                    </p> */}
                    <Link to="/disputes" className="nav-item">
                        <span className="nav-icon">◇</span>
                        Disputes
                    </Link>

                    <Link to="/evidence" className="nav-item">
                        <span className="nav-icon">◇</span>
                        Evidence
                    </Link>

                    <Link to="/rebuttals" className="nav-item">
                        <span className="nav-icon">✦</span>
                        Rebuttals
                    </Link>

                    <p className="nav-item">
                        <span className="nav-icon">◌</span>
                        Analytics
                    </p>

                </nav>

                <div className="sidebar-bottom">
                    <p className="nav-item">
                        <span className="nav-icon">⚙</span>
                        Settings
                    </p>
                </div>

            </aside>


            {/* Main Content */}
            <main className="main-content">

                {/* Top Bar */}
                <div className="top-bar">

                    <div className="search-box">
                        <span>⌕</span>
                        <input placeholder="Search disputes..." />
                    </div>

                    <div className="top-actions">

                        <button className="notification-btn">
                            ♢
                        </button>

                        <div className="profile">
                            <div className="profile-avatar">M</div>

                            <div className="profile-info">
                                <strong>Merchant</strong>
                                <small>Admin</small>
                            </div>
                        </div>

                    </div>

                </div>


                {/* Dashboard Header */}
                <div className="dashboard-header">

                    <div>
                        <p className="eyebrow">OVERVIEW</p>

                        <h1>
                            Good morning, Merchant
                            <span> 👋</span>
                        </h1>

                        <p className="header-description">
                            Here's what's happening with your disputes today.
                        </p>
                    </div>

                    <button className="new-dispute-btn">
                        <span>+</span>
                        New Dispute
                    </button>

                </div>


                {/* Metrics */}
                <div className="metrics-grid">

                    <div className="metric-card primary">

                        <div className="metric-top">
                            {/* <span>Active Disputes</span> */}
                            <span>TEST ACTIVE DISPUTES</span>
                            <span className="metric-icon">◈</span>
                        </div>

                        <div className="metric-value">
                            {disputes.length}
                        </div>

                        <div className="metric-change positive">
                            ↑ 12.5%
                            <span>vs last month</span>
                        </div>

                    </div>


                    <div className="metric-card">

                        <div className="metric-top">
                            <span>Amount at Risk</span>
                            <span className="metric-icon">₹</span>
                        </div>

                        <div className="metric-value">
                            ₹{disputes.reduce((total, dispute) => total + (dispute.amount || 0), 0).toLocaleString("en-IN")}
                        </div>
                        <div className="metric-change negative">
                            ↑ 4.8%
                            <span>vs last month</span>
                        </div>

                    </div>


                    <div className="metric-card">

                        <div className="metric-top">
                            <span>Recovery Rate</span>
                            <span className="metric-icon">↗</span>
                        </div>

                        <div className="metric-value">
                            {disputes.length
                                ? Math.round(
                                    disputes.reduce(
                                        (total, dispute) => total + (dispute.winProbabilityScore || 0),
                                        0
                                    ) / disputes.length
                                )
                                : 0}%
                        </div>
                        <div className="metric-change positive">
                            ↑ 8.2%
                            <span>vs last month</span>
                        </div>

                    </div>


                    <div className="metric-card">

                        <div className="metric-top">
                            <span>Resolved</span>
                            <span className="metric-icon">✓</span>
                        </div>

                        <div className="metric-value">
                            {disputes.filter(
                                (dispute) =>
                                    dispute.status === "WON" ||
                                    dispute.status === "LOST"
                            ).length}
                        </div>
                        <div className="metric-change neutral">
                            18 this month
                        </div>

                    </div>

                </div>


                {/* Analytics Row */}
                <div className="analytics-grid">

                    {/* Activity */}
                    <section className="panel activity-panel">

                        <div className="panel-header">

                            <div>
                                <h2>Dispute Activity</h2>
                                <p>Disputes over the last 30 days</p>
                            </div>

                            <button className="period-btn">
                                Last 30 days ▾
                            </button>

                        </div>


                        <div className="chart">

                            <div className="chart-labels">
                                <span>30</span>
                                <span>20</span>
                                <span>10</span>
                                <span>0</span>
                            </div>

                            <div className="chart-area">

                                <div className="chart-grid-line"></div>
                                <div className="chart-grid-line"></div>
                                <div className="chart-grid-line"></div>
                                <div className="chart-grid-line"></div>

                                <div className="chart-line">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                            </div>

                            <div className="chart-days">
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


                    {/* Risk */}
                    <section className="panel risk-panel">

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

                                <div>
                                    <span className="risk-dot low"></span>
                                    Low Risk
                                    <strong>18</strong>
                                </div>

                                <div>
                                    <span className="risk-dot medium"></span>
                                    Medium Risk
                                    <strong>4</strong>
                                </div>

                                <div>
                                    <span className="risk-dot high"></span>
                                    High Risk
                                    <strong>2</strong>
                                </div>

                            </div>

                        </div>

                    </section>

                </div>


                {/* Recent Disputes */}
                <section className="panel disputes-panel">

                    <div className="panel-header">

                        <div>
                            <h2>Recent Disputes</h2>
                            <p>Latest activity across your disputes</p>
                        </div>

                        <button className="view-all-btn">
                            View all →
                        </button>

                    </div>


                    <div className="dispute-table">

                        <div className="table-header">
                            <span>Customer</span>
                            <span>Amount</span>
                            <span>Reason</span>
                            <span>Status</span>
                            <span>Date</span>
                        </div>

                        {/*  */}







                    </div>
                    {disputes.map((dispute) => (
                        <div className="table-row" key={dispute._id}>

                            <div className="customer">
                                <div className="customer-avatar">
                                    {dispute.chargebackId?.slice(-2) || "DS"}
                                </div>

                                <div>
                                    <strong>{dispute.chargebackId}</strong>
                                    {/* <small>#{dispute._id.slice(-6)}</small> */}
                                    <small>#{dispute._id?.slice(-6)}</small>
                                </div>
                            </div>

                            <span>
                                ₹{(dispute.amount || 0).toLocaleString("en-IN")}
                            </span>

                            <span>
                                {dispute.reasonCode?.replaceAll("_", " ") || "N/A"}
                            </span>

                            <span className={`status ${dispute.status?.toLowerCase()}`}>
                                {dispute.status || "Pending"}
                            </span>

                            <span>
                                {dispute.createdAt
                                    ? new Date(dispute.createdAt).toLocaleDateString("en-IN")
                                    : "N/A"}
                            </span>

                        </div>
                    ))}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;
// ```
