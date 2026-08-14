import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Login.css";
import { apiRequest } from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            // const response = await fetch("http://localhost:5000/api/auth/login", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         email,
            //         password,
            //     }),
            // });

            // const data = await response.json();
            const data = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            // if (!response.ok) {
            //     alert(data.message || "Login failed");
            //     return;
            // }

            // localStorage.setItem("token", data.token);

            // alert("Login successful!");
            // console.log("Logged in user:", data);
            localStorage.setItem("token", data.token);

            alert("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            alert(error.message);
        }
    };  //This connects your frontend to the backend route you showed POST /auth/login

    return (
        <div className="login-page">

            {/* LEFT SIDE */}
            <section className="login-left">

                {/* Logo */}
                <div className="brand">
                    <div className="brand-icon">D</div>
                    <span>DisputeShield</span>
                </div>

                {/* Main content */}
                <div className="left-content">

                    <p className="eyebrow">
                        MERCHANT PORTAL — DISPUTE MANAGEMENT
                    </p>

                    <div className="amount">
                        $2.4<span>M</span>
                    </div>

                    <p className="tagline">
                        Recovered for merchants like you,<br />
                        disputed dollars reclaimed.
                    </p>

                    {/* Stats */}
                    <div className="stats">

                        <div className="stat">
                            <div className="stat-number">92%</div>
                            <div className="stat-label">WIN RATE</div>
                        </div>

                        <div className="stat">
                            <div className="stat-number">11,400</div>
                            <div className="stat-label">CASES FILED</div>
                        </div>

                        <div className="stat">
                            <div className="stat-number">3.1 days</div>
                            <div className="stat-label">AVG. RESPONSE</div>
                        </div>

                    </div>

                    {/* Testimonial */}
                    <div className="testimonial">
                        <p>
                            "We stopped losing revenue to deadlines we didn't know
                            existed. DisputeShield just tells us what's due, and when."
                        </p>

                        <span>
                            — Head of Payments, mid-market retailer
                        </span>
                    </div>

                </div>

            </section>


            {/* RIGHT SIDE */}
            <section className="login-right">

                <div className="login-box">

                    <h1>Sign in</h1>

                    <p className="signup-text">
                        New to DisputeShield?
                        <a href="#">Request access</a>
                    </p>


                    {/* Email */}
                    <div className="form-group">
                        <label>Work email</label>

                        {/* <input
                            type="email"
                            placeholder="you@company.com"
                        /> */}
                        <input
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>


                    {/* Password */}
                    <div className="form-group password-group">
                        <label>Password</label>

                        <div className="password-wrapper">
                            {/* <input
                                type={showPassword ? "text" : "password"}
                                defaultValue="password123456"
                                placeholder="Password"
                            /> */}
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />

                            <button
                                type="button"
                                className="show-button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>
                    </div>


                    {/* Remember / Forgot */}
                    <div className="login-options">

                        <label className="remember">
                            <input type="checkbox" />
                            <span>Keep me signed in</span>
                        </label>

                        <a href="#" className="forgot">
                            Forgot password?
                        </a>

                    </div>


                    {/* Sign in */}
                    {/* <button className="signin-button">
                        Sign in
                    </button> */}
                    <button className="signin-button" onClick={handleLogin}>
                        Sign in
                    </button>


                    {/* OR */}
                    <div className="divider">
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>


                    {/* SSO */}
                    <button className="sso-button">
                        <span className="email-icon">✉</span>
                        Continue with company SSO
                    </button>


                    {/* Security */}
                    <div className="security">
                        <span className="shield-icon">♢</span>
                        <span>PCI DSS Level 1 · SOC 2 Type II</span>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Login;