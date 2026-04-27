import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ReportIssue({ setPage }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "", description: "", type: "Illegal Dumping",
    severity: "Medium", location: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("reporter", user.name);
    if (image) fd.append("image", image);

    const res = await fetch("/api/issues", { method: "POST", body: fd });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setPage("issues"), 2000);
    }
    setLoading(false);
  };

  if (success) return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
      <h2 style={{ fontFamily: "Syne, sans-serif", color: "var(--green-dark)", marginBottom: "8px" }}>Issue Reported!</h2>
      <p style={{ color: "var(--text-muted)" }}>You earned +10 Green Points! Redirecting...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: "680px" }}>
      <h1 className="page-title">Report an Issue</h1>
      <p className="page-subtitle" style={{ marginBottom: "1.5rem" }}>Help your community by reporting environmental problems.</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Title *</label>
            <input className="form-input" placeholder="e.g. Illegal dumping near railway track"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Illegal Dumping</option>
                <option>Water Pollution</option>
                <option>Air Pollution</option>
                <option>Waste Management</option>
                <option>Deforestation</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Severity *</label>
              <select className="form-select" value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input className="form-input" placeholder="e.g. Anna Nagar, Chennai"
              value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" placeholder="Describe what you see in detail..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label className="form-label">Photo (optional)</label>
            <label className="file-upload">
              <input type="file" accept="image/*" onChange={handleImage} />
              {preview ? (
                <img src={preview} alt="preview" style={{ maxHeight: "200px", borderRadius: "8px", maxWidth: "100%" }} />
              ) : (
                <div>
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📸</div>
                  <p>Click to upload a photo</p>
                  <p style={{ fontSize: "0.8rem", marginTop: "4px" }}>JPG, PNG up to 5MB</p>
                </div>
              )}
            </label>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "🌿 Submit Report"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setPage("dashboard")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
