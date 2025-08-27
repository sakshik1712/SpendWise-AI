require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const morgan = require("morgan");

const expenses = require("./routes/expenses");
const revenues = require("./routes/revenues");
const users = require("./routes/users");
const billRoute = require("./routes/bill");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/expenses", expenses);
app.use("/api/revenues", revenues);
app.use("/api/users", users);
app.use("/api/bill", billRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server Error" });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
sequelize.authenticate()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection failed:", err));

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
