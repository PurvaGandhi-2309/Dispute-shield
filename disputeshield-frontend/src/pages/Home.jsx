import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../assets/logo.png';
import rebuttalIcon from '../assets/rebuttal-icon-transparent.png';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Menu,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  Inbox
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="home-brand">
          <img src={logo} alt="DisputeShield" className="home-logo-img" />
        </div>
        
        <div className="home-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
          <a href="#about">About</a>
        </div>

        <div className="home-nav-actions">
          <button className="home-btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
          <button className="home-btn-login" onClick={() => navigate('/login')}>Log In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-glow"></div>
        <div className="home-hero-content">
          <div className="home-hero-eyebrow">
            AI-POWERED CHARGEBACK PROTECTION
          </div>
          <h1>Win more disputes.<br/>Protect your revenue.</h1>
          <p>
            DisputeShield automates every step of the chargeback management process — from evidence collection to rebuttal generation — so you can focus on growth.
          </p>
          

          
          <div className="home-hero-benefits">
            <span><CheckCircle2 size={16} className="home-icon-green" style={{background: 'transparent'}}/> Reduce losses</span>
            <span><CheckCircle2 size={16} className="home-icon-green" style={{background: 'transparent'}}/> Save hours</span>
            <span><CheckCircle2 size={16} className="home-icon-green" style={{background: 'transparent'}}/> Win more cases</span>
          </div>
        </div>

        <div className="home-hero-mockup">
          <div className="home-mockup-card">
            <div className="home-mockup-label">Win Rate</div>
            <div className="home-mockup-value">72%</div>
            <div className="home-mockup-sub">↑ 18% from last month</div>
          </div>
          <div className="home-mockup-card">
            <div className="home-mockup-label">AI Rebuttal Generated</div>
            <div className="home-mockup-value" style={{fontSize: '1.2rem', marginTop: '1rem'}}>High confidence</div>
            <div className="home-mockup-value" style={{color: '#4ade80'}}>92%</div>
          </div>
          <div className="home-mockup-card home-mockup-large">
            <div className="home-mockup-label">Dispute #DS-1256</div>
            <div className="home-mockup-value">$1,250.00</div>
            <span className="home-tag">NEEDS EVIDENCE</span>
            <div className="home-mockup-label" style={{marginTop: '0.5rem'}}>Due in 2 days</div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="home-trusted">
        <div className="home-trusted-label">TRUSTED BY MERCHANTS WORLDWIDE</div>
        <div className="home-trusted-logos">
          <span>shopify</span>
          <span>stripe</span>
          <span>WOOCOMMERCE</span>
          <span>BIGCOMMERCE</span>
          <span>Magento</span>
        </div>
      </section>

      {/* Problem Section */}
      <section className="home-section" id="problem">
        <div className="home-section-header">
          <div className="home-section-label">THE PROBLEM</div>
          <h2 className="home-section-title">Chargebacks are complex.<br/>Manual processes cost you.</h2>
        </div>
        <div className="home-problem-grid">
          <div className="home-problem-card">
            <div className="home-problem-icon" style={{color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)'}}>
              <TrendingUp size={20} />
            </div>
            <h3>Rising Chargebacks</h3>
            <p>Chargebacks are increasing every year, eating into your revenue and profits.</p>
          </div>
          <div className="home-problem-card">
            <div className="home-problem-icon" style={{color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)'}}>
              <Clock size={20} />
            </div>
            <h3>Time Consuming</h3>
            <p>Manual evidence collection and rebuttals take hours of your valuable time.</p>
          </div>
          <div className="home-problem-card">
            <div className="home-problem-icon" style={{color: '#c084fc', background: 'rgba(192, 132, 252, 0.1)'}}>
              <FileText size={20} />
            </div>
            <h3>Complex Requirements</h3>
            <p>Different reason codes, strict deadlines, and hard to navigate rules.</p>
          </div>
          <div className="home-problem-card">
            <div className="home-problem-icon" style={{color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)'}}>
              <DollarSign size={20} />
            </div>
            <h3>Lost Revenue</h3>
            <p>Poor win rates and missed deadlines lead to lost revenue and higher fees.</p>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="home-section" id="features">
        <div className="home-section-header">
          <div className="home-section-label">THE PRODUCT</div>
          <h2 className="home-section-title">Built to help you win more disputes</h2>
        </div>
        <div className="home-product-grid">
          <div className="home-product-card">
            <div className="home-problem-icon home-icon-green">
              <ShieldCheck size={20} />
            </div>
            <h3>Automated Evidence Collection</h3>
            <p>Automatically gather and organize all the evidence you need to build a strong case.</p>
          </div>
          <div className="home-product-card">
            <div className="home-problem-icon home-icon-purple" style={{ padding: '0' }}>
              <img src={rebuttalIcon} alt="AI Rebuttals" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h3>AI-Powered Rebuttals</h3>
            <p>Generate compelling, data-backed rebuttals in seconds with our advanced AI.</p>
          </div>
          <div className="home-product-card">
            <div className="home-problem-icon home-icon-blue">
              <TrendingUp size={20} />
            </div>
            <h3>Win Rate Analytics</h3>
            <p>Track performance, monitor trends, and identify what's working to increase your win rate.</p>
          </div>
          <div className="home-product-card">
            <div className="home-problem-icon home-icon-yellow">
              <ShieldAlert size={20} />
            </div>
            <h3>Chargeback Protection</h3>
            <p>Prevent disputes before they happen with alerts, insights, and smart rules.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="home-section" id="how-it-works">
        <div className="home-section-header">
          <div className="home-section-label">HOW IT WORKS</div>
          <h2 className="home-section-title">From dispute to win in 4 simple steps</h2>
        </div>
        <div className="home-steps-grid">
          <div className="home-step-card">
            <div className="home-step-number">1</div>
            <div className="home-step-icon home-icon-green" style={{background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Inbox size={32} />
            </div>
            <h3>Dispute Received</h3>
            <p>We capture the dispute details and automatically create a case.</p>
          </div>
          <div className="home-step-card">
            <div className="home-step-number">2</div>
            <div className="home-step-icon home-icon-blue" style={{background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <FileText size={32} />
            </div>
            <h3>Collect Evidence</h3>
            <p>We gather relevant order, transaction, and customer evidence automatically.</p>
          </div>
          <div className="home-step-card">
            <div className="home-step-number">3</div>
            <div className="home-step-icon home-icon-purple" style={{background: 'transparent', padding: '0', height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={rebuttalIcon} alt="AI Rebuttals" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h3>AI Generates Rebuttal</h3>
            <p>Our AI creates a compelling rebuttal letter tailored to the dispute reason.</p>
          </div>
          <div className="home-step-card">
            <div className="home-step-number">4</div>
            <div className="home-step-icon home-icon-yellow" style={{background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ShieldCheck size={32} />
            </div>
            <h3>Submit & Win</h3>
            <p>Submit the case confidently and increase your chances of winning.</p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="home-section" id="results">
        <div className="home-results-grid">
          <div>
            <div className="home-section-label">REAL RESULTS</div>
            <h2 className="home-section-title" style={{marginBottom: '3rem', textAlign: 'left'}}>More wins. Less stress.</h2>
            <div className="home-stats-grid">
              <div className="home-stat-card">
                <div className="home-problem-icon home-icon-blue">
                  <TrendingUp size={20} />
                </div>
                <div className="home-stat-value">45%</div>
                <div className="home-stat-label">Higher Win Rate</div>
                <div className="home-stat-desc">On average for our merchants</div>
              </div>
              <div className="home-stat-card">
                <div className="home-problem-icon home-icon-blue">
                  <Clock size={20} />
                </div>
                <div className="home-stat-value">12+</div>
                <div className="home-stat-label">Hours Saved</div>
                <div className="home-stat-desc">Per week on manual work</div>
              </div>
              <div className="home-stat-card">
                <div className="home-problem-icon home-icon-purple">
                  <DollarSign size={20} />
                </div>
                <div className="home-stat-value">$2.3M+</div>
                <div className="home-stat-label">Recovered Revenue</div>
                <div className="home-stat-desc">For our merchants and growing</div>
              </div>
              <div className="home-stat-card">
                <div className="home-problem-icon home-icon-yellow">
                  <ShieldCheck size={20} />
                </div>
                <div className="home-stat-value">98%</div>
                <div className="home-stat-label">Customer Satisfaction</div>
                <div className="home-stat-desc">From 1000+ reviews</div>
              </div>
            </div>
          </div>
          
          <div className="home-review-card">
            <div className="home-review-label">MERCHANT REVIEW</div>
            <div className="home-review-quote">
              "DisputeShield has been a game-changer for our business. Our win rate increased by 40% in just two months. The AI rebuttals are incredible!"
            </div>
            <div className="home-review-stars">★★★★★</div>
            <div className="home-review-author">
              <div className="home-author-avatar">
                {/* Placeholder for avatar */}
                <div style={{width: '100%', height: '100%', background: '#4f46e5'}}></div>
              </div>
              <div className="home-author-info">
                <strong>Sarah Johnson</strong>
                <span>Head of Payments, TrendyStore</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta-section">
        <div className="home-cta-box">
          <div className="home-cta-content">
            <div className="home-section-label" style={{color: '#000'}}>READY TO PROTECT YOUR REVENUE?</div>
            <h2>Start winning more disputes today</h2>
            <p style={{color: '#000000'}}>Join thousands of merchants who trust DisputeShield to protect their business.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-grid">
          <div className="home-footer-brand">
            <div className="home-brand">
              <img src={logo} alt="DisputeShield" className="home-logo-img" />
            </div>
            <p>AI-powered chargeback protection for forward-thinking merchants.</p>
            <div className="home-footer-socials">
              <a href="#">in</a>
              <a href="#">X</a>
              <a href="#">f</a>
            </div>
          </div>
          
          <div className="home-footer-col">
            <h4>PRODUCT</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Integrations</a></li>
              <li><a href="#">Updates</a></li>
            </ul>
          </div>
          
          <div className="home-footer-col">
            <h4>SOLUTIONS</h4>
            <ul>
              <li><a href="#">E-commerce</a></li>
              <li><a href="#">SaaS</a></li>
              <li><a href="#">Marketplaces</a></li>
              <li><a href="#">High-Risk</a></li>
            </ul>
          </div>
          
          <div className="home-footer-col">
            <h4>RESOURCES</h4>
            <ul>
              <li><a href="#">Docs</a></li>
              <li><a href="#">Guides</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">API</a></li>
            </ul>
          </div>
          
          <div className="home-footer-col">
            <h4>COMPANY</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="home-footer-bottom">
          <div>© 2026 DisputeShield. All rights reserved.</div>
          <div className="home-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;