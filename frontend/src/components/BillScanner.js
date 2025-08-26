import React, { useState } from "react";

export default function BillScanner({ onAddExpense }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const scanBill = async () => {
    if (!file) return alert("Please select a bill image");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/bill/scan", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      const expensePayload = {
        title: data.shopName || "Unknown Shop",
        category: data.category || "Other",
        amount: isNaN(parseFloat(data.total)) ? 0 : parseFloat(data.total),
        date: new Date().toISOString().slice(0, 10),
      };

      // Auto-add expense
      await onAddExpense(expensePayload);
      alert("Expense added automatically!");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to scan bill");
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3>Bill Scanner</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button className="btn" onClick={scanBill} disabled={loading}>
        {loading ? "Scanning..." : "Scan & Save Expense"}
      </button>
    </div>
  );
}
