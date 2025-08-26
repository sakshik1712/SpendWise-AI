const Expense = require("../models/Expense");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  const { category, month } = req.query;
  const where = {};
  if (category) where.category = category;
  if (month) {
    // month in format YYYY-MM
    where.date = {
      [Op.between]: [`${month}-01`, `${month}-31`]
    };
  }
  const expenses = await Expense.findAll({ where, order: [["date", "DESC"]] });
  res.json(expenses);
};

exports.create = async (req, res) => {
  const { title, amount, category, date } = req.body;
  if (!title || !amount || !category || !date) return res.status(400).json({ error: "Missing fields" });
  const e = await Expense.create({ title, amount, category, date });
  res.json(e);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await Expense.update(req.body, { where: { id } });
  const updated = await Expense.findByPk(id);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await Expense.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};