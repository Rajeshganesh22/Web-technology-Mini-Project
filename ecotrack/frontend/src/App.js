import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import IssueList from "./pages/IssueList";
import Leaderboard from "./pages/Leaderboard";
import AdminPanel from "./pages/AdminPanel";
import "./App.css";

function Nav({ page, setPage }) {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage("dashboard")}>
        <span className="brand-icon">🌿</span>
        <span className="brand-name">EcoTrack</span>
      </div>
      <div className="nav-links">
        <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>Dashboard</button>
        <button className={page === "issues" ? "active" : ""} onClick={() => setPage("issues")}>Issues</button>
        {user?.role === "citizen" && (
          <button className={page === "report" ? "active" : ""} onClick={() => setPage("report")}>+ Report</button>
        )}
        <button className={page === "leaderboard" ? "active" : ""} onClick={() => setPage("leaderboard")}>Leaderboard</button>
        {user?.role === "authority" && (
          <button className={page === "admin" ? "active" : ""} onClick={() => setPage("admin")}>Admin</button>
        )}
      </div>
      <div className="nav-user">
        <span className="user-badge">{user?.role === "authority" ? "🏛️" : "🌱"} {user?.name}</span>
        {user?.role === "citizen" && <span className="points-badge">⭐ {user?.points ?? 0} pts</span>}
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

function AppInner() {
  const { user } = useAuth();
  const [page, setPage] = useState("dashboard");

  if (!user) return <Login />;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard setPage={setPage} />;
      case "issues": return <IssueList />;
      case "report": return <ReportIssue setPage={setPage} />;
      case "leaderboard": return <Leaderboard />;
      case "admin": return <AdminPanel />;
      default: return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      <Nav page={page} setPage={setPage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
