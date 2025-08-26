import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export default function BudgetPie({ budget, spent }) {
  const data = [{ name: "Spent", value: spent }, { name: "Remaining", value: Math.max(0, budget - spent) }];
  return (
    <div className="card" style={{height:300}}>
      <h4>Monthly Budget</h4>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie dataKey="value" data={data} outerRadius={80} label />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
