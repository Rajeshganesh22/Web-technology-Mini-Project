import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function IssueCard({ issue, onVote }) {
  const statusClass = issue.status === "Resolved" ? "badge-resolved" : issue.status === "In Progress" ? "badge-progress" : "badge-reported";
  const sevClass = issue.severity === "High" ? "badge-high" : issue.severity === "Medium" ? "badge-medium" : "badge-low";
  return (
    <div className="issue-card">
      {issue.image && <img src={`http://localhost:5000${issue.image}`} alt="issue" className="issue-image" />}
      <div className="issue-header">
        <span className="issue-title">{issue.title}</span>
      </div>
      <div className="issue-meta">
        <span className={`badge ${statusClass}`}>{issue.status}</span>
        <span className={`badge ${sevClass}`}>{issue.severity}</span>
        <span className="badge badge-type">{issue.type}</span>
      </div>
      <p className="issue-desc">{issue.description}</p>
      <div className="issue-footer">
        <span className="issue-info">📍 {issue.location} · 👤 {issue.reporter}</span>
        <button className="vote-btn" onClick={() => onVote(issue.id)}>▲ {issue.votes}</button>
      </div>
    </div>
  );
}

export default function Dashboard({ setPage }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  const fetchData = async () => {
    const [s, i] = await Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/issues").then(r => r.json()),
    ]);
    setStats(s);
    setRecent(i.slice(0, 4));
  };

  useEffect(() => { fetchData(); }, []);

  const handleVote = async (id) => {
    await fetch(`/api/issues/${id}/vote`, { method: "PATCH" });
    fetchData();
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">Welcome back, {user?.name} 👋</h1>
        <p className="page-subtitle">Here's what's happening in your community today.</p>
      </div>

      {stats && (
        <div className="card-grid card-grid-4" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <div className="stat-icon green">📋</div>
            <div><div className="stat-number">{stats.total}</div><div className="stat-label">Total Issues</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">🔴</div>
            <div><div className="stat-number">{stats.reported}</div><div className="stat-label">Reported</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">🔧</div>
            <div><div className="stat-number">{stats.inProgress}</div><div className="stat-label">In Progress</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div><div className="stat-number">{stats.resolved}</div><div className="stat-label">Resolved</div></div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "var(--green-dark)" }}>Recent Issues</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => setPage("issues")}>View All →</button>
      </div>

      <div className="card-grid card-grid-2">
        {recent.map(issue => <IssueCard key={issue.id} issue={issue} onVote={handleVote} />)}
      </div>

      {user?.role === "citizen" && (
        <div className="card" style={{ marginTop: "2rem", background: "linear-gradient(135deg, #0f4d2e, #1a7a4a)", color: "white", textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌍</div>
          <h3 style={{ fontFamily: "Syne, sans-serif", marginBottom: "8px", fontSize: "1.2rem" }}>See an environmental issue?</h3>
          <p style={{ opacity: 0.8, marginBottom: "1.2rem", fontSize: "0.9rem" }}>Report it and earn Green Points for your community contribution!</p>
          <button className="btn" style={{ background: "white", color: "var(--green-dark)", fontWeight: 600 }} onClick={() => setPage("report")}>
            + Report an Issue
          </button>
        </div>
      )}
    </div>
  );
}
