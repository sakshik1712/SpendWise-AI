import React, { useState } from "react";

export default function Filters({ categories, onFilter }) {
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");

  function apply() {
    onFilter({ category: category || undefined, month: month || undefined });
  }

  function reset() { setCategory(""); setMonth(""); onFilter({}); }

  return (
    <div className="card">
      <div className="form-row">
        <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="input" type="month" value={month} onChange={(e)=>setMonth(e.target.value)} />
        <button className="btn btn-primary" onClick={apply}>Apply</button>
        <button className="btn" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
