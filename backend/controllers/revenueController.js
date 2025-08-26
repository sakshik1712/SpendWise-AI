const Revenue = require("../models/Revenue");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  const { month } = req.query;
  const where = {};
  if (month) where.date = { [Op.between]: [`${month}-01`, `${month}-31`] };
  const list = await Revenue.findAll({ where, order: [["date", "DESC"]] });
  res.json(list);
};

exports.create = async (req, res) => {
  const { title, amount, date } = req.body;
  if (!title || !amount || !date) return res.status(400).json({ error: "Missing fields" });
  const r = await Revenue.create({ title, amount, date });
  res.json(r);
};

exports.update = async (req, res) => {
  await Revenue.update(req.body, { where: { id: req.params.id } });
  const updated = await Revenue.findByPk(req.params.id);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await Revenue.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};