const User = require("../models/User");

exports.getUser = async (req, res) => {
  // For simplicity single user with id=1
  let user = await User.findByPk(1);
  if (!user) {
    user = await User.create({ id: 1, name: "You", budget: 20000 });
  }
  res.json(user);
};

exports.updateUser = async (req, res) => {
  await User.update(req.body, { where: { id: 1 } });
  const user = await User.findByPk(1);
  res.json(user);
};