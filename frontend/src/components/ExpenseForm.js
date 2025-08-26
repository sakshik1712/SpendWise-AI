import React, { useState, useEffect } from "react";
import { format } from "date-fns";

export default function ExpenseForm({ onSubmit, initial }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(()=>{
    if (initial) {
      setTitle(initial.title||"");
      setAmount(initial.amount||"");
      setCategory(initial.category||"");
      setDate(initial.date||format(new Date(), "yyyy-MM-dd"));
    }
  },[initial]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ title, amount: parseFloat(amount), category, date });
    setTitle(""); setAmount(""); setCategory("");
  };

  return (
    <form className="card" onSubmit={submit}>
      <div className="form-row">
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} type="number" required />
      </div>
      <div className="form-row">
        <input className="input" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} required />
        <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} required />
        <button className="btn btn-primary" type="submit">Save</button>
      </div>
    </form>
  );
}
