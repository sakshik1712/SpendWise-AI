import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to safely call API and log errors
const safeCall = async (fn) => {
  try {
    const res = await fn();
    return res;
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    throw err;
  }
};

export const expenses = {
  get: (params) => safeCall(() => API.get("/expenses", { params })),
  create: (data) => {
    // Optional: validate required fields
    if (!data.title || !data.category || data.amount == null) {
      return Promise.reject(new Error("Invalid expense data"));
    }
    return safeCall(() => API.post("/expenses", data));
  },
  update: (id, data) => safeCall(() => API.put(`/expenses/${id}`, data)),
  remove: (id) => safeCall(() => API.delete(`/expenses/${id}`)),
};

export const revenues = {
  get: (params) => safeCall(() => API.get("/revenues", { params })),
  create: (data) => {
    if (!data.title || data.amount == null) {
      return Promise.reject(new Error("Invalid revenue data"));
    }
    return safeCall(() => API.post("/revenues", data));
  },
  update: (id, data) => safeCall(() => API.put(`/revenues/${id}`, data)),
  remove: (id) => safeCall(() => API.delete(`/revenues/${id}`)),
};

export const users = {
  get: () => safeCall(() => API.get("/users")),
  update: (data) => safeCall(() => API.put("/users", data)),
};
