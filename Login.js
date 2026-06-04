import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/login", form);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: "demo@flashdeals.com", password: "password123" });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>⚡</span> FlashDeals
        </div>
        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-sub">Sign in to access exclusive flash deals</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <button className="demo-btn" onClick={fillDemo}>
          🎭 Use Demo Account
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </div>

      <div className="auth-promo">
        <div className="promo-content">
          <h2>Today's Flash Sales</h2>
          <div className="promo-deals">
            <div className="promo-deal">⚡ Up to 70% OFF Electronics</div>
            <div className="promo-deal">🔥 Flash Sales Every Hour</div>
            <div className="promo-deal">🎁 Free Delivery on ₹499+</div>
            <div className="promo-deal">💎 Members-Only Deals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
