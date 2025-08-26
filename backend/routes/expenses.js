const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/expenseController");

// Simple validation middleware
function validateExpense(req, res, next) {
  const { title, category, amount, date } = req.body;
  if (!title || !category || !amount || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  next();
}

router.get("/", ctrl.getAll);
router.post("/", validateExpense, ctrl.create);
router.put("/:id", validateExpense, ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;