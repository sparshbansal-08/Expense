import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    amount: "",
    category: "",
    date: "",
    paymentMethod: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update expense
        await axios.put(
          `http://localhost:5000/api/expenses/${formData.id}`,
          formData
        );
      } else {
        // Create expense
        await axios.post("http://localhost:5000/api/expenses", formData);
      }
      fetchExpenses();
      resetForm();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  // Handle edit button click
  const handleEdit = (expense) => {
    setFormData(expense);
    setIsEditing(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      amount: "",
      category: "",
      date: "",
      paymentMethod: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-8 animate-fade-in">
          Expense Tracker
        </h1>

        {/* Form */}
        <div className="mb-12 p-8 bg-white rounded-2xl shadow-xl transform transition-all hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">
            {isEditing ? "Edit Expense" : "Add New Expense"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Expense Title"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Amount (USD)"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
            </select>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Debit Card">Debit Card</option>
            </select>
            <div className="md:col-span-2 flex justify-start space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all"
              >
                {isEditing ? "Update Expense" : "Add Expense"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Expenses List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="p-6 bg-white rounded-2xl shadow-lg transform transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                {expense.title}
              </h3>
              <p className="text-gray-600">
                Amount:{" "}
                <span className="font-medium text-indigo-600">
                  ${expense.amount}
                </span>
              </p>
              <p className="text-gray-600">
                Category:{" "}
                <span className="font-medium text-indigo-600">
                  {expense.category}
                </span>
              </p>
              <p className="text-gray-600">
                Date:{" "}
                <span className="font-medium text-indigo-600">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-600">
                Payment:{" "}
                <span className="font-medium text-indigo-600">
                  {expense.paymentMethod}
                </span>
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleEdit(expense)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transform hover:scale-105 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
