import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Leaderboard() {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);

  useEffect(() => {
    fetch("/api/leaderboard").then(r => r.json()).then(setBoard);
  }, []);

  const medals = ["🥇", "🥈", "🥉"];
  const rankClass = (i) => i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 className="page-title">🏆 Green Leaderboard</h1>
      <p className="page-subtitle" style={{ marginBottom: "1.5rem" }}>Top contributors making a difference in the community.</p>

      <div className="card" style={{ marginBottom: "1.5rem", background: "linear-gradient(135deg, #0f4d2e, #1a7a4a)", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: "1.8rem", fontFamily: "Syne, sans-serif", fontWeight: 800 }}>10</div>
            <div style={{ opacity: 0.8, fontSize: "0.85rem" }}>pts per report</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8rem", fontFamily: "Syne, sans-serif", fontWeight: 800 }}>5</div>
            <div style={{ opacity: 0.8, fontSize: "0.85rem" }}>pts per vote</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8rem", fontFamily: "Syne, sans-serif", fontWeight: 800 }}>20</div>
            <div style={{ opacity: 0.8, fontSize: "0.85rem" }}>pts if resolved</div>
          </div>
        </div>
      </div>

      {board.map((u, i) => (
        <div key={u.id} className="lb-row" style={u.name === user?.name ? { border: "2px solid var(--green)", background: "var(--green-pale)" } : {}}>
          <span className={`lb-rank ${rankClass(i)}`}>{i < 3 ? medals[i] : `#${i + 1}`}</span>
          <div style={{ flex: 1 }}>
            <div className="lb-name">{u.name} {u.name === user?.name && <span style={{ fontSize: "0.75rem", color: "var(--green)" }}>(You)</span>}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{u.email}</div>
          </div>
          <div className="lb-points">⭐ {u.points} pts</div>
        </div>
      ))}
    </div>
  );
}
