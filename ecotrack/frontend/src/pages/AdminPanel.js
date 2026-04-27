import React, { useEffect, useState } from "react";

const STATUSES = ["Reported", "In Progress", "Resolved"];

export default function AdminPanel() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchAll = async () => {
    const [i, s] = await Promise.all([
      fetch("/api/issues").then(r => r.json()),
      fetch("/api/stats").then(r => r.json()),
    ]);
    setIssues(i);
    setStats(s);
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/issues/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAll();
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Delete this issue?")) return;
    await fetch(`/api/issues/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const sevClass = (s) => s === "High" ? "badge-high" : s === "Medium" ? "badge-medium" : "badge-low";

  return (
    <div>
      <h1 className="page-title">🏛️ Authority Panel</h1>
      <p className="page-subtitle" style={{ marginBottom: "1.5rem" }}>Manage and resolve community-reported environmental issues.</p>

      {stats && (
        <div className="card-grid card-grid-4" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <div className="stat-icon green">📋</div>
            <div><div className="stat-number">{stats.total}</div><div className="stat-label">Total</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">🔴</div>
            <div><div className="stat-number">{stats.reported}</div><div className="stat-label">Pending</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">🔧</div>
            <div><div className="stat-number">{stats.inProgress}</div><div className="stat-label">Active</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div><div className="stat-number">{stats.resolved}</div><div className="stat-label">Resolved</div></div>
          </div>
        </div>
      )}

      <div className="card" style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Location</th>
              <th>Reporter</th>
              <th>Votes</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id}>
                <td style={{ maxWidth: "200px" }}>
                  <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{issue.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td><span className="badge badge-type">{issue.type}</span></td>
                <td><span className={`badge ${sevClass(issue.severity)}`}>{issue.severity}</span></td>
                <td style={{ fontSize: "0.85rem" }}>📍 {issue.location}</td>
                <td style={{ fontSize: "0.85rem" }}>{issue.reporter}</td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>▲ {issue.votes}</td>
                <td>
                  <select className="status-select" value={issue.status}
                    onChange={e => updateStatus(issue.id, e.target.value)}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteIssue(issue.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
