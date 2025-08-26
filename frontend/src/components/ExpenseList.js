import React from "react";

export default function ExpenseList({ items, onEdit, onDelete }) {
  return (
    <div className="card">
      <table className="table">
        <thead><tr><th>Title</th><th>Category</th><th>Amount</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(i=>(
            <tr key={i.id}>
              <td>{i.title}</td>
              <td>{i.category}</td>
              <td>₹{i.amount.toFixed(2)}</td>
              <td>{i.date}</td>
              <td>
                <button className="btn" onClick={()=>onEdit(i)}>Edit</button>
                <button className="btn btn-danger" onClick={()=>onDelete(i.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
