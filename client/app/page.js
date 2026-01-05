"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div style={containerStyle}>
      {/* Background Decor */}
      <div style={glowStyle} />

      <h1 style={logoStyle}>
        Acid<span>Trace</span>
      </h1>
      
      <p style={taglineStyle}>
        Secure Blockchain-Backed Acid Supply Chain Monitoring
      </p>

      <div style={buttonGroupStyle}>
        <Link href="/register">
          <button
            style={primaryButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.filter = "brightness(1.1)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.filter = "brightness(1)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Get Started
          </button>
        </Link>

        <Link href="/login">
          <button
            style={secondaryButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1a1a1e";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            System Login
          </button>
        </Link>
      </div>

      <footer style={footerStyle}>
        v2.4.0 Secure Protocol Active
      </footer>
    </div>
  );
}

// --- Styles ---

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#0a0a0b", // Pure dark background
  fontFamily: "'Inter', sans-serif",
  textAlign: "center",
  padding: "0 20px",
  position: "relative",
  overflow: "hidden",
};

const glowStyle = {
  position: "absolute",
  width: "40vw",
  height: "40vw",
  backgroundColor: "rgba(0, 255, 136, 0.03)", // Very subtle green glow
  filter: "blur(100px)",
  borderRadius: "50%",
  zIndex: 0,
};

const logoStyle = {
  fontSize: "5rem",
  fontWeight: "800",
  color: "#fff",
  marginBottom: "10px",
  letterSpacing: "-2px",
  zIndex: 1,
};

const taglineStyle = {
  fontSize: "1.2rem",
  color: "#666",
  marginBottom: "50px",
  maxWidth: "500px",
  lineHeight: "1.6",
  zIndex: 1,
};

const buttonGroupStyle = {
  display: "flex",
  gap: "20px",
  zIndex: 1,
};

const primaryButtonStyle = {
  padding: "16px 40px",
  backgroundColor: "#00ff88", // Acid Green
  color: "#000",
  fontWeight: "700",
  fontSize: "1rem",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const secondaryButtonStyle = {
  padding: "16px 40px",
  backgroundColor: "transparent",
  color: "#fff",
  fontWeight: "600",
  fontSize: "1rem",
  borderRadius: "12px",
  border: "1px solid #222",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const footerStyle = {
  position: "absolute",
  bottom: "40px",
  fontSize: "12px",
  color: "#333",
  letterSpacing: "1px",
  textTransform: "uppercase",
};