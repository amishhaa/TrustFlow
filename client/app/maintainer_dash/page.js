"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MaintainerDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role-name mapping
  const roleNames = {
    0: "Maintainer",
    1: "Manufacturer",
    2: "Retailer",
    3: "Consumer",
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    // ❌ If not maintainer, block access
    if (role !== "0") {
      alert("Unauthorized: Only Maintainers can access this page.");
      router.push("/dashboard");
      return;
    }

    fetchAllUsers();
  }, []);

  async function fetchAllUsers() {
    try {
      const res = await fetch("/api/getAllUsers");
      const data = await res.json();

      if (res.ok) {
        setUsers(data.users);
      } else {
        alert("Failed to load data");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f8f8",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#ff4d4d",
          padding: "20px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#fff",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>
          Maintainer Dashboard
        </h1>

        <button
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "#fff",
            color: "#ff4d4d",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: "600" }}>
          All Users Overview
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#ffe5e5" }}>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
                <th style={th}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{roleNames[u.status]}</td>
                  <td style={td}>₹ {u.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const th = {
  padding: "12px",
  fontWeight: "600",
  fontSize: "0.9rem",
};

const td = {
  padding: "12px",
  fontSize: "0.9rem",
};
