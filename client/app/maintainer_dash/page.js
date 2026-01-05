"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MaintainerDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const roleNames = {
    0: "Maintainer",
    1: "Manufacturer",
    2: "Retailer",
    3: "Consumer",
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
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

  function isAnomaly(user) {
    return (user.status === 1 || user.status === 2) && user.balance !== 0;
  }

  return (
    <div style={containerStyle}>
      {/* Sidebar Navigation */}
      <aside style={sidebarStyle}>
        <div style={logoStyle}>Acid<span>Trace</span></div>
        <nav style={navLinksStyle}>
          <div style={linkItemActiveStyle}>System Audit</div>
        </nav>
        <button 
          onClick={() => { localStorage.clear(); router.push("/"); }}
          style={logoutButtonStyle}
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <header style={topHeaderStyle}>
          <div>
            <h2 style={{ margin: 0, fontWeight: "700" }}>Maintainer Dashboard</h2>
            <p style={{ color: "#888", fontSize: "14px", marginTop: "4px" }}>System-wide User & Inventory Audit</p>
          </div>
          <div style={statusBadgeStyle}>Admin Mode</div>
        </header>

        <section style={tableContainerStyle}>
          <div style={tableHeaderArea}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>All Users Overview</h3>
            <p style={{ color: "#666", fontSize: "12px", margin: "5px 0 0 0" }}>
              Highlighting anomalies where Manufacturers/Retailers hold unauthorized stock.
            </p>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>Syncing Database...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Identity (Email)</th>
                    <th style={thStyle}>Access Level</th>
                    <th style={thStyle}>Current Volume</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => {
                    const anomaly = isAnomaly(u);
                    return (
                      <tr key={idx} style={anomaly ? anomalyRowStyle : rowStyle}>
                        <td style={tdStyle}>{u.email}</td>
                        <td style={tdStyle}>
                           <span style={roleBadgeStyle}>{roleNames[u.status]}</span>
                        </td>
                        <td style={tdStyle}>{u.balance.toLocaleString()} L</td>
                        <td style={tdStyle}>
                          {anomaly ? (
                            <span style={anomalyTextStyle}>⚠️ ANOMALY DETECTED</span>
                          ) : (
                            <span style={normalTextStyle}>NOMINAL</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// --- Styles ---
const containerStyle = { display: "flex", minHeight: "100vh", backgroundColor: "#0a0a0b", color: "#fff", fontFamily: "'Inter', sans-serif", padding: 0 };
const sidebarStyle = { width: "260px", backgroundColor: "#111114", padding: "40px 20px", display: "flex", flexDirection: "column", borderRight: "1px solid #1a1a1e" };
const logoStyle = { fontSize: "24px", fontWeight: "800", letterSpacing: "-1px", marginBottom: "50px", color: "#fff", textAlign: "center" };
const navLinksStyle = { display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1 };
const linkItemStyle = { padding: "12px 16px", borderRadius: "8px", color: "#888", textDecoration: "none", cursor: "pointer", fontSize: "14px" };
const linkItemActiveStyle = { ...linkItemStyle, backgroundColor: "#1a1a1e", color: "#00ff88", fontWeight: "600" };
const logoutButtonStyle = { padding: "12px", backgroundColor: "transparent", border: "1px solid #1a1a1e", color: "#ff4d4d", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };

const mainContentStyle = { flexGrow: 1, padding: "40px", overflowY: "auto" };
const topHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" };
const statusBadgeStyle = { padding: "6px 12px", backgroundColor: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", border: "1px solid rgba(255, 77, 77, 0.2)", textTransform: "uppercase" };

const tableContainerStyle = { backgroundColor: "#111114", borderRadius: "24px", border: "1px solid #1a1a1e", overflow: "hidden" };
const tableHeaderArea = { padding: "24px 30px", borderBottom: "1px solid #1a1a1e" };

const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "left" };
const thStyle = { padding: "16px 30px", color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #1a1a1e" };
const tdStyle = { padding: "16px 30px", color:"#ffffff", fontSize: "14px", borderBottom: "1px solid #1a1a1e" };

const rowStyle = { transition: "background 0.2s" };
const anomalyRowStyle = { backgroundColor: "rgba(255, 77, 77, 0.05)", transition: "background 0.2s" };

const roleBadgeStyle = { backgroundColor: "#1a1a1e", padding: "4px 8px", borderRadius: "6px", color: "#aaa", fontSize: "12px" };
const anomalyTextStyle = { color: "#ff4d4d", fontWeight: "bold", fontSize: "11px", letterSpacing: "0.5px" };
const normalTextStyle = { color: "#00ff88", fontWeight: "bold", fontSize: "11px", letterSpacing: "0.5px", opacity: 0.8 };