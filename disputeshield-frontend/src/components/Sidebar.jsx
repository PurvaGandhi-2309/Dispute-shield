import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, FileText, Sparkles, CheckCircle } from 'lucide-react';
import logo from '../assets/logo.png';

function Sidebar() {
    const location = useLocation();
    
    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-brand">
                <img src={logo} alt="DisputeShield" className="dashboard-logo-img" />
            </div>
            <nav className="sidebar-nav">
                <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <span className="nav-icon"><LayoutDashboard size={20} /></span>
                    Overview
                </Link>
                <Link to="/disputes" className={`nav-item ${location.pathname.startsWith('/disputes') ? 'active' : ''}`}>
                    <span className="nav-icon"><ShieldAlert size={20} /></span>
                    Disputes
                </Link>
                <Link to="/evidence" className={`nav-item ${location.pathname.startsWith('/evidence') ? 'active' : ''}`}>
                    <span className="nav-icon"><FileText size={20} /></span>
                    Evidence
                </Link>
                <Link to="/rebuttals" className={`nav-item ${location.pathname.startsWith('/rebuttals') ? 'active' : ''}`}>
                    <span className="nav-icon"><Sparkles size={20} /></span>
                    Rebuttals
                </Link>
                <Link to="/review" className={`nav-item ${location.pathname.startsWith('/review') ? 'active' : ''}`}>
                    <span className="nav-icon"><CheckCircle size={20} /></span>
                    Review
                </Link>
            </nav>
        </aside>
    );
}

export default Sidebar;
