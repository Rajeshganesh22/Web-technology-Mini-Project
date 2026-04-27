import React, { createContext, useContext, useState } from "react";
import { sendWelcomeEmail } from "../utils/email";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ecotrack_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    setUser(data.user);
    localStorage.setItem("ecotrack_user", JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    setUser(data.user);
    localStorage.setItem("ecotrack_user", JSON.stringify(data.user));
    // Send welcome email via EmailJS (works on any network)
    await sendWelcomeEmail(email, name);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecotrack_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
