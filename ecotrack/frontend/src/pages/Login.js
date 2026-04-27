import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (tab === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const fill = (email, password) => setForm(f => ({ ...f, email, password }));

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="icon">🌿</span>
          <h1>EcoTrack</h1>
          <p>Community Environmental Action Platform</p>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
          <button className={`login-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Register</button>
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handle}>
          {tab === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Please wait..." : tab === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="demo-accounts">
          <p>Quick demo accounts:</p>
          <button className="demo-btn" onClick={() => fill("ravi@eco.com", "pass123")}>🌱 Citizen — ravi@eco.com / pass123</button>
          <button className="demo-btn" onClick={() => fill("admin@eco.com", "admin123")}>🏛️ Authority — admin@eco.com / admin123</button>
        </div>
      </div>
    </div>
  );
}
