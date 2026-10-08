import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import logo from '../assets/logo.png';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName: formData.storeName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }
      console.log("SIGNUP RESPONSE:", data);
      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-bg-glow"></div>

      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="DisputeShield" className="signup-logo-img" />
          </div>
          <h1>Create an Account</h1>
          <p>Enter your details to get started.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-form-group">
            <label htmlFor="storeName">Store Name</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              className="signup-input"
              placeholder="My Awesome Store"
              value={formData.storeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="signup-input"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="signup-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="signup-input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signup-submit-btn">
            Sign Up
          </button>
        </form>

        <div className="signup-footer">
          Already have an account?
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Log in</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
