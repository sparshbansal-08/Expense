const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Expense = require("../models/Expense");


router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date, paymentMethod } = req.body;
    const expense = new Expense({
      id: uuidv4(),
      title,
      amount,
      category,
      date: new Date(date),
      paymentMethod,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { title, amount, category, date, paymentMethod } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { id: req.params.id },
      { title, amount, category, date: new Date(date), paymentMethod },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ id: req.params.id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
