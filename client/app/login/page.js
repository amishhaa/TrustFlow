"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  async function submitForm(e) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("email", email);
      localStorage.setItem("role", data.status);

      if (data.status === 0) {
        router.push("/maintainer_dash");
      } else {
        router.push("/dashboard");
      }
    } else {
      setStatusMsg(data.message);
    }
  }

  return (
    <div style={containerStyle}>
      <div style={loginCardStyle}>
        <div style={logoStyle}>Acid<span>Trace</span></div>
        <h1 style={titleStyle}>System Access</h1>
        <br></br>
        <form onSubmit={submitForm} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Authorized Email</label>
            <input
              type="email"
              placeholder="operator@acidtrace"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={modernInputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Security Credential</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={modernInputStyle}
            />
          </div>

          <button
            type="submit"
            style={loginButtonStyle}
            onMouseEnter={e => {
              e.target.style.filter = "brightness(1.1)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.target.style.filter = "brightness(1)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Login 
          </button>
        </form>

        {statusMsg && (
          <div style={errorBadgeStyle}>
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Styles ---

const containerStyle = {
  display: "flex",
  minHeight: "100vh",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#0a0a0b", // Deep dark background
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  padding: "20px",
};

const loginCardStyle = {
  maxWidth: "420px",
  width: "100%",
  padding: "50px 40px",
  borderRadius: "24px",
  backgroundColor: "#111114",
  border: "1px solid #1a1a1e",
  textAlign: "center",
};

const logoStyle = {
  fontSize: "28px",
  fontWeight: "800",
  letterSpacing: "-1px",
  marginBottom: "10px",
  color: "#fff",
};

const titleStyle = {
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "8px",
  color: "#fff",
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "40px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const inputGroupStyle = {
  textAlign: "left",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  color: "#888",
  marginBottom: "8px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const modernInputStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#0a0a0b",
  border: "1px solid #1a1a1e",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const loginButtonStyle = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#00ff88", // Acid Green
  color: "#000",
  fontWeight: "700",
  fontSize: "16px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginTop: "10px",
};

const errorBadgeStyle = {
  marginTop: "24px",
  padding: "12px",
  backgroundColor: "rgba(255, 77, 77, 0.1)",
  color: "#ff4d4d",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  border: "1px solid rgba(255, 77, 77, 0.2)",
};