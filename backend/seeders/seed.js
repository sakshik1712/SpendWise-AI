const sequelize = require("../config/db");
const Expense = require("../models/Expense");
const Revenue = require("../models/Revenue");
const User = require("../models/User");

async function seed() {
  await sequelize.sync({ force: true });
  await User.create({ id: 1, name: "Sakshi", budget: 30000 });

  await Revenue.bulkCreate([
    { title: "Salary July", amount: 50000, date: "2025-07-01" },
    { title: "Freelance", amount: 8000, date: "2025-07-15" }
  ]);

  await Expense.bulkCreate([
    { title: "Rent", amount: 12000, category: "Housing", date: "2025-07-05" },
    { title: "Groceries", amount: 4000, category: "Food", date: "2025-07-07" },
    { title: "Netflix", amount: 499, category: "Entertainment", date: "2025-07-03" },
    { title: "Bus pass", amount: 800, category: "Transport", date: "2025-07-10" }
  ]);

  console.log("Seeded!");
  process.exit(0);
}

seed().catch((e)=>{ console.error(e); process.exit(1); });
