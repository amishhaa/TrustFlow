"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); 
  const [balance, setBalance] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState(""); 

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
      fetchBalance(savedEmail);
    } else {
      alert("No email found. Please login again.");
    }
  }, []);

  async function fetchBalance(email) {
    try {
      const res = await fetch(`/api/getBalance?email=${email}`);
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
      } else {
        setBalance("Error");
      }
    } catch (err) {
      console.error(err);
      setBalance("Error");
    }
  }

  async function transferBalance() {
    if (!receiverEmail || !amount) {
      alert("Enter receiver email and amount in litres");
      return;
    }
    const amt = Number(amount);
    const receiverRes = await fetch(`/api/getBalance?email=${receiverEmail}`);
    const receiverData = await receiverRes.json();

    if (!receiverRes.ok) {
      alert(receiverData.message || "Receiver not found");
      return;
    }

    const receiverBalance = receiverData.balance;

    if (balance < amt) {
      alert("Insufficient stock for this transfer");
      return;
    }

    const updateReceiver = await fetch("/api/setBalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: receiverEmail,
        balance: receiverBalance + amt
      })
    });

    const updateMerchant = await fetch("/api/setBalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        balance: balance - amt
      })
    });

    if (updateMerchant.ok && updateReceiver.ok) {
      alert("Transfer successful");
      setBalance(balance - amt); 
    } else {
      alert("Transfer failed");
    }
  }

  async function handleSetBalance() {
    if (!amount || isNaN(amount)) {
      alert("Enter a valid number of litres");
      return;
    }
    if (!email) {
      alert("Email missing. Login again.");
      return;
    }
    setLoading(true);
    try {
      const role = localStorage.getItem("role");
      if (role === "2") {  
        alert("Retailers are not allowed to update inventory.");
        throw new Error("Not allowed");
      }
      const res = await fetch("/api/setBalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          balance: Number(amount),
        }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating inventory");
    }
    setLoading(false);
  }

  return (
    <div style={containerStyle}>
      {/* Sidebar Navigation */}
      <aside style={sidebarStyle}>
        <div style={logoStyle}>Acid<span>Trace</span></div>
        <nav style={navLinksStyle}>
          {/* Dashboard and Settings removed as requested */}
          <div style={linkItemActiveStyle}>Transactions</div>
        </nav>
        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/"; }}
          style={logoutButtonStyle}
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <header style={topHeaderStyle}>
          <div>
            <h2 style={{ margin: 0 }}>Inventory Management</h2>
            <p style={{ color: "#888", fontSize: "14px" }}>Logged in as: <b>{email}</b></p>
          </div>
          <div style={statusBadgeStyle}>System Online</div>
        </header>

        <section style={statsGridStyle}>
          {/* Volume Card */}
          <div style={balanceCardStyle}>
            <p style={cardLabelStyle}>Current Stock Level</p>
            <h1 style={balanceValueStyle}>
              {balance === null ? "..." : `${balance.toLocaleString()} L`}
            </h1>
            <div style={cardFooterStyle}>Verified Volume</div>
          </div>

          {/* Transfer Control Card */}
          <div style={actionCardStyle}>
            <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Logistics Control</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Volume (Litres)</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={modernInputStyle}
              />
            </div>

            <div style={buttonRowStyle}>
              <button onClick={handleSetBalance} style={setBalanceButtonStyle}>
                {loading ? "Syncing..." : "Update Stock"}
              </button>
            </div>

            <hr style={dividerStyle} />

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Recipient Identifier (Email)</label>
              <input
                type="text"
                placeholder="retailer@acidtrace.io"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                style={modernInputStyle}
              />
            </div>

            <button onClick={transferBalance} style={transferButtonStyle}>
              Execute Transfer
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Styles ---
const containerStyle = { display: "flex", minHeight: "100vh", backgroundColor: "#0a0a0b", color: "#fff", fontFamily: "'Inter', sans-serif" };
const sidebarStyle = { width: "260px", backgroundColor: "#111114", padding: "40px 20px", display: "flex", flexDirection: "column", borderRight: "1px solid #222" };
const logoStyle = { fontSize: "24px", fontWeight: "800", letterSpacing: "-1px", marginBottom: "50px", color: "#fff", textAlign: "center" };
const navLinksStyle = { display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1 };
const linkItemStyle = { padding: "12px 16px", borderRadius: "8px", color: "#666", textDecoration: "none", cursor: "pointer", transition: "0.2s" };
const linkItemActiveStyle = { ...linkItemStyle, backgroundColor: "#1a1a1e", color: "#00ff88" };
const logoutButtonStyle = { padding: "12px", backgroundColor: "transparent", border: "1px solid #333", color: "#ff4d4d", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const mainContentStyle = { flexGrow: 1, padding: "40px", overflowY: "auto" };
const topHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" };
const statusBadgeStyle = { padding: "6px 12px", backgroundColor: "rgba(0, 255, 136, 0.1)", color: "#00ff88", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", border: "1px solid rgba(0, 255, 136, 0.2)" };
const statsGridStyle = { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px" };
const balanceCardStyle = { background: "linear-gradient(135deg, #1a1a1e 0%, #0a0a0b 100%)", padding: "40px", borderRadius: "24px", border: "1px solid #222", display: "flex", flexDirection: "column", justifyContent: "center", height: "fit-content" };
const cardLabelStyle = { color: "#888", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 };
const balanceValueStyle = { fontSize: "48px", fontWeight: "800", margin: "15px 0", color: "#fff" };
const cardFooterStyle = { fontSize: "12px", color: "#00ff88", fontWeight: "bold" };
const actionCardStyle = { backgroundColor: "#111114", padding: "30px", borderRadius: "24px", border: "1px solid #222" };
const inputGroupStyle = { marginBottom: "20px" };
const labelStyle = { display: "block", fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "600" };
const modernInputStyle = { width: "100%", padding: "14px", backgroundColor: "#1a1a1e", border: "1px solid #333", borderRadius: "12px", color: "#fff", fontSize: "16px", outline: "none", boxSizing: "border-box" };
const setBalanceButtonStyle = { width: "100%", padding: "14px", backgroundColor: "#fff", color: "#000", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" };
const transferButtonStyle = { width: "100%", padding: "14px", backgroundColor: "#00ff88", color: "#000", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" };
const dividerStyle = { border: "0", borderTop: "1px solid #222", margin: "30px 0" };
const buttonRowStyle = { display: "flex", gap: "10px" };