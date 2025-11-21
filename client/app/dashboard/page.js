"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); // merchant email
  const [balance, setBalance] = useState(null);

  const [receiverEmail, setReceiverEmail] = useState(""); // FIX 1

  // Load email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
      fetchBalance(savedEmail);
    } else {
      alert("No email found. Please login again.");
    }
  }, []);

  // Fetch user's current balance
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

  // ------- TRANSFER MONEY FUNCTION (FIXED) -------
  async function transferBalance() {
    if (!receiverEmail || !amount) {
      alert("Enter receiver email and amount");
      return;
    }

    const amt = Number(amount);

    // 1. Fetch receiver current balance
    const receiverRes = await fetch(`/api/getBalance?email=${receiverEmail}`);
    const receiverData = await receiverRes.json();

    if (!receiverRes.ok) {
      alert(receiverData.message || "Receiver not found");
      return;
    }

    const receiverBalance = receiverData.balance;

    // 2. Check merchant has enough money
    if (balance < amt) {
      alert("Not enough balance");
      return;
    }

    // 3. Update receiver balance (+ amt)
    const updateReceiver = await fetch("/api/setBalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: receiverEmail,
        balance: receiverBalance + amt
      })
    });

    // 4. Update merchant balance (- amt)
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
      setBalance(balance - amt); // update UI
    } else {
      alert("Transfer failed");
    }
  }

  // ------- SET BALANCE FUNCTION -------
  async function handleSetBalance() {
    
    if (!amount || isNaN(amount)) {
      alert("Enter a valid balance number");
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
  alert("Retailers are not allowed to add balance.");
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
      alert("Error updating balance");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#f7f7f7",
        padding: "20px",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "#ff4d4d",
          color: "#fff",
          borderRadius: "12px",
          marginBottom: "40px",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>AcidTrace Dashboard</h1>
        <nav style={{ display: "flex", gap: "20px" }}>
          <Link href="/">
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                color: "#ff4d4d",
                fontWeight: "600",
                borderRadius: "8px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Home
            </button>
          </Link>

          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#fff",
              color: "#ff4d4d",
              fontWeight: "600",
              borderRadius: "8px",
              cursor: "pointer",
              border: "none",
            }}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Balance Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600" }}>Current Balance</h2>

          <p style={{ fontSize: "1rem", marginTop: "10px" }}>
            {balance === null ? "Loading..." : <b>{balance}</b>}
          </p>

          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "10px" }}>
            Logged in as <b>{email}</b>
          </p>
        </div>

        {/* Add + Transfer Balance Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "10px" }}>
            Balance Actions
          </h2>

          {/* Set Balance */}
          <input
            type="number"
            placeholder="Enter new balance"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "10px",
              fontSize: "1rem",
            }}
          />

          <button
            onClick={handleSetBalance}
            style={{
              marginTop: "15px",
              padding: "10px 16px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {loading ? "Updating..." : "Set Balance"}
          </button>

          {/* Transfer Section */}
          <input
            type="text"
            placeholder="Receiver Email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "20px",
              fontSize: "1rem",
            }}
          />

          <button
            onClick={transferBalance}
            style={{
              marginTop: "15px",
              padding: "10px 16px",
              backgroundColor: "#2196F3",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Transfer
          </button>
        </div>
      </main>
    </div>
  );
}


