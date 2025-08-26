import React from "react";

export default function NavTabs({ active, setActive }) {
  const tabs = ["Dashboard","Expenses","Revenues","Bill Scanner","Charts","Budget","Settings"];
  return (
    <div className="tabs">
      {tabs.map(t=>(
        <div key={t} className={`tab ${active===t?"active":""}`} onClick={()=>setActive(t)}>
          {t}
        </div>
      ))}
    </div>
  );
}
