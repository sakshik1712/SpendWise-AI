require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const expenses = require("./routes/expenses");
const revenues = require("./routes/revenues");
const users = require("./routes/users");
const billRoute = require("./routes/bill"); 


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Optional: simple logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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

sequelize.sync({ alter: true }) // auto-update tables
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });