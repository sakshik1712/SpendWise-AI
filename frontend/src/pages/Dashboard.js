import React, { useEffect, useState } from "react";
import NavTabs from "../components/NavTabs";
import TotalsCard from "../components/TotalsCard";
import Filters from "../components/Filters";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";
import RevenueForm from "../components/RevenueForm";
import CategoryBar from "../components/Charts/CategoryBar";
import MonthlyLine from "../components/Charts/MonthlyLine";
import BudgetPie from "../components/Charts/BudgetPie";
import BillScanner from "../components/BillScanner"; // AI Bill Scanner
import { expenses as expAPI, revenues as revAPI, users as userAPI } from "../api/api";

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [user, setUser] = useState({ name: "", budget: 0 });
  const [filter, setFilter] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingRevenue, setEditingRevenue] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load all data
  async function loadAll() {
    const e = await expAPI.get();
    const r = await revAPI.get();
    const u = await userAPI.get();
    setExpenses(e.data);
    setRevenues(r.data);
    setUser(u.data);
  }

  useEffect(() => {
    loadAll();
  }, []);

  // Totals
  const totalExpenses = expenses.reduce((s, x) => s + Number(x.amount), 0);
  const totalRevenues = revenues.reduce((s, x) => s + Number(x.amount), 0);
  const balance = totalRevenues - totalExpenses;

  // Categories
  const categories = [...new Set(expenses.map((e) => e.category))];

  // Chart data
  const categoryData = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const monthAgg = Object.entries(
    expenses.reduce((acc, e) => {
      const m = e.date.slice(0, 7);
      acc[m] = (acc[m] || 0) + Number(e.amount);
      return acc;
    }, {})
  ).map(([month, value]) => ({ month, value }));

  // Filters
  const applyFilter = async (f) => {
    setFilter(f);
    const params = {};
    if (f.category) params.category = f.category;
    if (f.month) params.month = f.month;
    const res = await expAPI.get(params);
    setExpenses(res.data);
  };

  // CRUD functions
  const addExpense = async (data) => {
    await expAPI.create(data);
    await loadAll();
    setActive("Expenses");
  };
  const updateExpense = async (id, data) => {
    await expAPI.update(id, data);
    await loadAll();
    setEditingExpense(null);
  };
  const deleteExpense = async (id) => {
    await expAPI.remove(id);
    await loadAll();
  };
  const addRevenue = async (data) => {
    await revAPI.create(data);
    await loadAll();
    setActive("Revenues");
  };
  const updateRevenue = async (id, data) => {
    await revAPI.update(id, data);
    await loadAll();
    setEditingRevenue(null);
  };
  const deleteRevenue = async (id) => {
    await revAPI.remove(id);
    await loadAll();
  };
  const updateUser = async (payload) => {
    await userAPI.update(payload);
    const r = await userAPI.get();
    setUser(r.data);
  };

  const toggleMode = () => setDarkMode(!darkMode);

  return (
    <div className={darkMode ? "container dark-mode" : "container light-mode"}>
      <div className="header">
        <h1>SpendWise AI</h1>
        <div>{user.name} • Budget ₹{user.budget}</div>
      </div>

      <NavTabs active={active} setActive={setActive} />

      {active === "Dashboard" && (
        <>
          <TotalsCard totalExpenses={totalExpenses} totalRevenues={totalRevenues} balance={balance} />

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <div>
              <Filters categories={categories} onFilter={applyFilter} />
              <ExpenseList
                items={expenses}
                onEdit={(e) => {
                  setEditingExpense(e);
                  setActive("Expenses");
                }}
                onDelete={deleteExpense}
              />
            </div>
            <div>
              <h4>Add Expense</h4>
              <ExpenseForm onSubmit={addExpense} initial={editingExpense} />
              <h4 style={{ marginTop: 12 }}>Add Revenue</h4>
              <RevenueForm onSubmit={addRevenue} initial={editingRevenue} />
            </div>
          </div>
        </>
      )}

      {active === "Expenses" && (
        <>
          <Filters categories={categories} onFilter={applyFilter} />
          <ExpenseForm
            onSubmit={async (payload) => {
              if (editingExpense) await updateExpense(editingExpense.id, payload);
              else await addExpense(payload);
            }}
            initial={editingExpense}
          />
          <ExpenseList items={expenses} onEdit={(e) => setEditingExpense(e)} onDelete={deleteExpense} />
        </>
      )}

      {active === "Revenues" && (
        <>
          <RevenueForm
            onSubmit={async (payload) => {
              if (editingRevenue) await updateRevenue(editingRevenue.id, payload);
              else await addRevenue(payload);
            }}
            initial={editingRevenue}
          />
          <div style={{ height: 12 }} />
          <div className="card">
            <h4>Revenues</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {revenues.map((r) => (
                  <tr key={r.id}>
                    <td>{r.title}</td>
                    <td>₹{r.amount.toFixed(2)}</td>
                    <td>{r.date}</td>
                    <td>
                      <button className="btn" onClick={() => setEditingRevenue(r)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => deleteRevenue(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Bill Scanner */}
      {active === "Bill Scanner" && (
        <BillScanner onAddExpense={addExpense} />
      )}

      {active === "Charts" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <CategoryBar data={categoryData} />
            <MonthlyLine data={monthAgg} />
          </div>
          <div style={{ marginTop: 12 }}>
            <BudgetPie budget={user.budget} spent={totalExpenses} />
          </div>
        </>
      )}

      {active === "Budget" && (
        <>
          <div className="card">
            <h3>Update Name / Budget</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = Object.fromEntries(new FormData(e.target));
                updateUser({ name: fd.name, budget: parseFloat(fd.budget) });
              }}
            >
              <div className="form-row">
                <input name="name" defaultValue={user.name} className="input" />
                <input name="budget" defaultValue={user.budget} className="input" type="number" />
                <button className="btn btn-primary" type="submit">Save</button>
              </div>
            </form>
          </div>
        </>
      )}

      {active === "Settings" && (
        <div className="card">
          <h3>Settings</h3>
          <button className="btn btn-toggle" onClick={toggleMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
    </div>
  );
}
