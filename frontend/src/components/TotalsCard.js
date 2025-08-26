import React from "react";

export default function TotalsCard({ totalExpenses, totalRevenues, balance }) {
  return (
    <div className="card flex" style={{justifyContent:"space-between"}}>
      <div>
        <h3>Total Expenses</h3>
        <div>₹{totalExpenses.toFixed(2)}</div>
      </div>
      <div>
        <h3>Total Revenues</h3>
        <div>₹{totalRevenues.toFixed(2)}</div>
      </div>
      <div>
        <h3>Balance</h3>
        <div>₹{balance.toFixed(2)}</div>
      </div>
    </div>
  );
}
