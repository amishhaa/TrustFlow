import React, { useEffect, useState } from "react";

const Explorer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/get-chain")
      .then((res) => res.json())
      .then((chainData) => {
        setData(chainData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chain:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!data) return <p style={{ textAlign: "center" }}>No data available</p>;

  const { structure, balances, blocks } = data;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>AcidFlow Explorer</h1>

      <h2 style={{ marginTop: "30px" }}>Node Balances</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#0984e3", color: "#fff" }}>
            <th style={{ padding: "10px" }}>Code</th>
            <th>Balance</th>
            <th>Latest Hash</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(balances).map((code) => (
            <tr key={code}>
              <td style={{ padding: "10px", textAlign: "center" }}>{code}</td>
              <td style={{ textAlign: "center" }}>{balances[code]}</td>
              <td style={{ textAlign: "center", wordBreak: "break-all" }}>
                {blocks[code]?.hash || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "40px" }}>Acid Flow Structure</h2>
      {Object.keys(structure).map((from) => (
        <div key={from} style={{ marginBottom: "10px" }}>
          <b>{from}</b> → {structure[from].length > 0 ? structure[from].join(", ") : "No outgoing flow"}
        </div>
      ))}
    </div>
  );
};

export default Explorer;

//(Add the below to App.jsx)
//import Explorer from "./Explorer";
//<Route path="/explorer" element={<Explorer />} />