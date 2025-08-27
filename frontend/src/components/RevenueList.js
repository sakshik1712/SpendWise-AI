import React, { useState, useEffect } from "react";
import axios from "axios";

const Revenue = () => {
  const [revenues, setRevenues] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch revenues from backend
  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://spendwise-ai-78vp.onrender.com/api/revenues");
      setRevenues(res.data);
    } catch (err) {
      console.error("Error fetching revenues:", err);
    } finally {
      setLoading(false);
    }
  };

  const addRevenue = async (e) => {
    e.preventDefault();
    if (!amount || !description || !date) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post("https://spendwise-ai-78vp.onrender.com/api/revenues", {
        amount,
        description,
        date,
      });
      setRevenues([...revenues, res.data]);
      setAmount("");
      setDescription("");
      setDate("");
    } catch (err) {
      console.error("Error adding revenue:", err);
    }
  };

  const deleteRevenue = async (id) => {
    try {
      await axios.delete(`https://spendwise-ai-78vp.onrender.com/revenues/${id}`);
      setRevenues(revenues.filter((rev) => rev.id !== id));
    } catch (err) {
      console.error("Error deleting revenue:", err);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Revenue Tracker</h2>

      {/* Add Revenue Form */}
      <form onSubmit={addRevenue} className="mb-6 space-y-3">
        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Revenue
        </button>
      </form>

      {/* Revenue List */}
      {loading ? (
        <p>Loading revenues...</p>
      ) : (
        <ul className="space-y-2">
          {revenues.map((rev) => (
            <li
              key={rev.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>
                ₹{rev.amount} - {rev.description} ({rev.date})
              </span>
              <button
                onClick={() => deleteRevenue(rev.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Revenue;
