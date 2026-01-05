"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Manufacturer");
  const [status, setStatus] = useState("");

  async function submitForm(e) {
    e.preventDefault();

    const roleStatusMap = {
      Manufacturer: 1,
      Retailer: 2,
      Consumer: 3,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        status: roleStatusMap[role],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("email", email);
      localStorage.setItem("role", roleStatusMap[role]);
      router.push("/dashboard");
    } else {
      setStatus(data.message);
    }
  }

  return (
    <div style={containerStyle}>
      <div style={registerCardStyle}>
        <div style={logoStyle}>Acid<span>Trace</span></div>
        <h1 style={titleStyle}>Initialize Account</h1>
        <p style={subtitleStyle}>Select your role within the supply chain</p>

        <form onSubmit={submitForm} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={modernInputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Access Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={modernInputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Operational Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={modernSelectStyle}
            >
              <option value="Manufacturer">Manufacturer</option>
              <option value="Retailer">Retailer</option>
              <option value="Consumer">Consumer</option>
            </select>
          </div>

          <button
            type="submit"
            style={registerButtonStyle}
            onMouseEnter={e => {
              e.target.style.filter = "brightness(1.1)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.target.style.filter = "brightness(1)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Create System Identity
          </button>
        </form>

        {status && (
          <div style={statusBadgeStyle}>
            {status}
          </div>
        )}

        <div style={footerStyle}>
          Already have an account? <span onClick={() => router.push("/")} style={linkStyle}>Sign In</span>
        </div>
      </div>
    </div>
  );
}

// --- High-Visibility Styles ---

const containerStyle = {
  display: "flex",
  minHeight: "100vh",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#0a0a0b",
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  padding: "20px",
};

const registerCardStyle = {
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
  marginBottom: "30px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroupStyle = {
  textAlign: "left",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  color: "#888", // High visibility grey
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
  color: "#fff", // White text for visibility
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};

const modernSelectStyle = {
  ...modernInputStyle,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Length19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  backgroundSize: "16px",
};

const registerButtonStyle = {
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

const statusBadgeStyle = {
  marginTop: "20px",
  padding: "12px",
  backgroundColor: "rgba(255, 77, 77, 0.1)",
  color: "#ff4d4d",
  borderRadius: "8px",
  fontSize: "14px",
  border: "1px solid rgba(255, 77, 77, 0.2)",
};

const footerStyle = {
  marginTop: "30px",
  fontSize: "14px",
  color: "#666",
};

const linkStyle = {
  color: "#00ff88",
  cursor: "pointer",
  fontWeight: "600",
  marginLeft: "5px",
};