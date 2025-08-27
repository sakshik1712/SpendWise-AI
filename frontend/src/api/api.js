import axios from "axios";

// Base URL: localhost for dev, Render URL for production
const BASE_URL = process.env.REACT_APP_API_URL || "https://spendwise-ai-78vp.onrender.com/api";

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Helper: safely call API and log errors
const safeCall = async (fn) => {
  try {
    const res = await fn();
    return res.data; // return only data
  } catch (err) {
    console.error(
      "API Error:",
      err.config?.url,
      err.response?.data || err.message || err
    );
    throw err;
  }
};

// ======================= EXPENSES =======================
export const expenses = {
  get: (params) => safeCall(() => API.get("/expenses", { params })),
  create: (data) => {
    if (!data.title || !data.category || data.amount == null) {
      return Promise.reject(new Error("Invalid expense data"));
    }
    return safeCall(() => API.post("/expenses", data));
  },
  update: (id, data) => safeCall(() => API.put(`/expenses/${id}`, data)),
  remove: (id) => safeCall(() => API.delete(`/expenses/${id}`)),
};

// ======================= REVENUES =======================
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

// ======================= USERS =======================
export const users = {
  get: () => safeCall(() => API.get("/users")),
  update: (data) => safeCall(() => API.put("/users", data)),
};
