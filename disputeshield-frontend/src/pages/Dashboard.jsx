import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Dashboard.css";
import logo from '../assets/logo.png';
import Sidebar from '../components/Sidebar';
import { 
    LayoutDashboard, 
    ShieldAlert, 
    FileText, 
    Sparkles, 
    BarChart2, 
    Settings,
    IndianRupee,
    TrendingUp,
    CheckCircle,
    Search,
    Bell
} from 'lucide-react';

function Dashboard() {
    const [disputes, setDisputes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const filteredDisputes = disputes.filter(d => 
        (d.chargebackId && d.chargebackId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.reason && d.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d._id && d._id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
    // Real Dashboard Metrics
    const activeDisputes = disputes.filter(
        d => {
            const s = (d.status || "").toLowerCase();
            return !s.includes("won") && !s.includes("lost");
        }
    );

    const activeDisputesCount = activeDisputes.length;

    const amountAtRisk = activeDisputes.reduce(
        (total, dispute) => total + (Number(dispute.amount) || 0),
        0
    );

    const wonAmount = disputes
        .filter(d => (d.status || "").toLowerCase().includes("won"))
        .reduce((total, dispute) => total + (Number(dispute.amount) || 0), 0);

    const lostAmount = disputes
        .filter(d => (d.status || "").toLowerCase().includes("lost"))
        .reduce((total, dispute) => total + (Number(dispute.amount) || 0), 0);

    const recoveryRate =
        wonAmount + lostAmount > 0
            ? Math.round((wonAmount / (wonAmount + lostAmount)) * 100)
            : 0;

    const resolvedCount = disputes.filter(
        d => {
            const s = (d.status || "").toLowerCase();
            return s.includes("won") || s.includes("lost");
        }
    ).length;

    // Activity Chart Data (Last 30 days, 7 intervals of 5 days)
    const generateChartData = () => {
        const data = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const end = new Date(today);
            end.setDate(today.getDate() - (i * 5));
            const start = new Date(today);
            start.setDate(today.getDate() - (i * 5) - 5); // 5 days prior to 'end'
            
            const label = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const count = disputes.filter(d => {
                const dDate = new Date(d.createdAt);
                return dDate > start && dDate <= end;
            }).length;
            
            data.push({ label, count });
        }
        return data;
    };
    
    const chartData = generateChartData();
    const maxCount = Math.max(...chartData.map(d => d.count));
    // Set a sensible max axis value (at least 30, rounded up to nearest 10)
    const chartMax = Math.max(30, Math.ceil(maxCount / 10) * 10); 
    const yAxisLabels = [chartMax, Math.round(chartMax * 0.66), Math.round(chartMax * 0.33), 0];

    // Risk Overview Data (Risk based on amount)
    const riskCounts = { low: 0, medium: 0, high: 0 };
    disputes.forEach(d => {
        const amt = Number(d.amount) || 0;
        if (amt >= 1000) riskCounts.high++;
        else if (amt >= 200) riskCounts.medium++;
        else riskCounts.low++;
    });
    
    const totalDisputesForRisk = disputes.length || 1;
    const dominantRiskValue = Math.max(riskCounts.low, riskCounts.medium, riskCounts.high);
    const dominantRiskPercent = Math.round((dominantRiskValue / totalDisputesForRisk) * 100);
    
    let dominantRiskLabel = "Low Risk";
    let dominantRiskClass = "low";
    if (riskCounts.high === dominantRiskValue) {
        dominantRiskLabel = "High Risk";
        dominantRiskClass = "high";
    }
    else if (riskCounts.medium === dominantRiskValue) {
        dominantRiskLabel = "Medium Risk";
        dominantRiskClass = "med";
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Topbar */}
                <header className="dashboard-topnav">
                    <div className="search-container">
                        <span><Search size={18} /></span>
                        <input 
                            type="text" 
                            placeholder="Search disputes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="topnav-actions">
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
                        <button className="btn-primary" onClick={() => navigate('/disputes', { state: { openForm: true } })}>
                            <span>+</span> New Dispute
                        </button>
                    </div>

                    {/* Metrics */}
                    <div className="metrics-grid">
                        <div className="metric-card primary">
                            <div className="metric-top">
                                <span>Active Disputes</span>
                                <span className="metric-icon"><ShieldAlert size={18} /></span>
                            </div>
                            <div className="metric-value">{activeDisputesCount}</div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-top">
                                <span>Amount at Risk</span>
                                <span className="metric-icon"><IndianRupee size={18} /></span>
                            </div>
                            <div className="metric-value">₹{amountAtRisk.toLocaleString("en-IN")}</div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-top">
                                <span>Recovery Rate</span>
                                <span className="metric-icon"><TrendingUp size={18} /></span>
                            </div>
                            <div className="metric-value">{recoveryRate}%</div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-top">
                                <span>Resolved</span>
                                <span className="metric-icon"><CheckCircle size={18} /></span>
                            </div>
                            <div className="metric-value">{resolvedCount}</div>
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
                                    {yAxisLabels.map((val, idx) => (
                                        <span key={idx}>{val}</span>
                                    ))}
                                </div>
                                <div className="chart-bars">
                                    {chartData.map((d, idx) => {
                                        const heightPercent = chartMax > 0 ? (d.count / chartMax) * 100 : 0;
                                        return (
                                            <div 
                                                key={idx} 
                                                className="bar" 
                                                style={{ height: `${heightPercent}%` }} 
                                                title={`${d.count} disputes`}
                                            ></div>
                                        );
                                    })}
                                </div>
                                <div className="chart-x-axis">
                                    {chartData.map((d, idx) => (
                                        <span key={idx}>{d.label}</span>
                                    ))}
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
                                <div className={`risk-circle ${dominantRiskClass}`}>
                                    <div>
                                        <strong>{disputes.length > 0 ? dominantRiskPercent : 0}%</strong>
                                        <span>{dominantRiskLabel}</span>
                                    </div>
                                </div>
                                <div className="risk-details">
                                    <div className="risk-item">
                                        <div className="risk-item-label">
                                            <span className="dot low"></span> Low Risk
                                        </div>
                                        <strong>{riskCounts.low}</strong>
                                    </div>
                                    <div className="risk-item">
                                        <div className="risk-item-label">
                                            <span className="dot med"></span> Medium Risk
                                        </div>
                                        <strong>{riskCounts.medium}</strong>
                                    </div>
                                    <div className="risk-item">
                                        <div className="risk-item-label">
                                            <span className="dot high"></span> High Risk
                                        </div>
                                        <strong>{riskCounts.high}</strong>
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
                                    {filteredDisputes.length > 0 ? (
                                        filteredDisputes.map((dispute) => (
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
                                            <td colSpan="5" style={{ textAlign: "center", color: "var(--text-secondary)" }}>
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
