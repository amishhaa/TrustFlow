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

    // Map role to status
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
      // Registration successful → redirect to dashboard
      localStorage.setItem("email", email);
      localStorage.setItem("role", roleStatusMap[role]);
      router.push("/dashboard");
    } else {
      setStatus(data.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        fontFamily: "'Inter', sans-serif",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#ff4d4d", marginBottom: "30px" }}>
          Create Account
        </h1>

        <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: "12px 15px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.target.style.borderColor = "#ff4d4d")}
            onBlur={e => (e.target.style.borderColor = "#ccc")}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: "12px 15px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.target.style.borderColor = "#ff4d4d")}
            onBlur={e => (e.target.style.borderColor = "#ccc")}
          />

          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              padding: "12px 15px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              cursor: "pointer",
              transition: "border-color 0.2s",
              backgroundColor: "#fff",
            }}
            onFocus={e => (e.target.style.borderColor = "#ff4d4d")}
            onBlur={e => (e.target.style.borderColor = "#ccc")}
          >
            <option>Manufacturer</option>
            <option>Retailer</option>
            <option>Consumer</option>
          </select>

          <button
            type="submit"
            style={{
              padding: "12px 0",
              backgroundColor: "#ff4d4d",
              color: "#fff",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = "#e04343";
              e.target.style.transform = "scale(1.03)";
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = "#ff4d4d";
              e.target.style.transform = "scale(1)";
            }}
          >
            Register
          </button>
        </form>

        {status && (
          <p style={{ marginTop: "20px", color: "#333", fontWeight: "500" }}>{status}</p>
        )}
      </div>
    </div>
  );
}
