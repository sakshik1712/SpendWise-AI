import React, { useState, useEffect } from "react";
import { format } from "date-fns";

export default function RevenueForm({ onSubmit, initial }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(()=>{ if (initial) { setTitle(initial.title||""); setAmount(initial.amount||""); setDate(initial.date||format(new Date(),"yyyy-MM-dd")); } },[initial]);

  const submit = e => { e.preventDefault(); onSubmit({ title, amount: parseFloat(amount), date }); setTitle(""); setAmount(""); };

  return (
    <form className="card" onSubmit={submit}>
      <div className="form-row">
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} type="number" required />
        <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} required />
        <button className="btn btn-primary" type="submit">Save</button>
      </div>
    </form>
  );
}
