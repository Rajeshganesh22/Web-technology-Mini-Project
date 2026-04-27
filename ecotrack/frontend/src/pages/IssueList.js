import React, { useEffect, useState } from "react";

const STATUSES = ["All", "Reported", "In Progress", "Resolved"];
const TYPES = ["All", "Illegal Dumping", "Water Pollution", "Air Pollution", "Waste Management"];

export default function IssueList() {
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");

  const fetchIssues = async () => {
    const params = new URLSearchParams();
    if (status !== "All") params.append("status", status);
    if (type !== "All") params.append("type", type);
    const res = await fetch(`/api/issues?${params}`);
    setIssues(await res.json());
  };

  useEffect(() => { fetchIssues(); }, [status, type]);

  const handleVote = async (id) => {
    await fetch(`/api/issues/${id}/vote`, { method: "PATCH" });
    fetchIssues();
  };

  const statusClass = (s) => s === "Resolved" ? "badge-resolved" : s === "In Progress" ? "badge-progress" : "badge-reported";
  const sevClass = (s) => s === "High" ? "badge-high" : s === "Medium" ? "badge-medium" : "badge-low";

  return (
    <div>
      <h1 className="page-title">All Issues</h1>

      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 500 }}>Filter by Status</p>
        <div className="filters">
          {STATUSES.map(s => (
            <button key={s} className={`filter-btn ${status === s ? "active" : ""}`} onClick={() => setStatus(s)}>{s}</button>
          ))}
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 500 }}>Filter by Type</p>
        <div className="filters">
          {TYPES.map(t => (
            <button key={t} className={`filter-btn ${type === t ? "active" : ""}`} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="empty-state">
          <span className="icon">🌿</span>
          <h3>No issues found</h3>
          <p>Try changing the filters or be the first to report!</p>
        </div>
      ) : (
        <div className="card-grid card-grid-2">
          {issues.map(issue => (
            <div key={issue.id} className="issue-card">
              {issue.image && <img src={`http://localhost:5000${issue.image}`} alt="issue" className="issue-image" />}
              <div className="issue-header">
                <span className="issue-title">{issue.title}</span>
              </div>
              <div className="issue-meta">
                <span className={`badge ${statusClass(issue.status)}`}>{issue.status}</span>
                <span className={`badge ${sevClass(issue.severity)}`}>{issue.severity}</span>
                <span className="badge badge-type">{issue.type}</span>
              </div>
              <p className="issue-desc">{issue.description}</p>
              <div className="issue-footer">
                <div>
                  <div className="issue-info">📍 {issue.location}</div>
                  <div className="issue-info">👤 {issue.reporter} · 🕐 {new Date(issue.createdAt).toLocaleDateString()}</div>
                </div>
                <button className="vote-btn" onClick={() => handleVote(issue.id)}>▲ {issue.votes}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
