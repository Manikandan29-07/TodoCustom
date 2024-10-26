const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoModel = require("./Models/Todo");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// Connect to MongoDB (No deprecated options)
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Fetch all todos and sort them by createdAt in descending order
app.get("/get", (req, res) => {
  TodoModel.find()
    .sort({ createdAt: -1 }) // Sort by createdAt, newest first
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});
// Update a todo by ID
app.put("/update/:id", (req, res) => {
  const todoId = req.params.id; // Get the todo ID from the request parameters
  const { status } = req.body; // Get the new status from the request body

  TodoModel.findByIdAndUpdate(todoId, { status }, { new: true }) // Find and update the todo by its ID
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Add a new todo
app.post("/add", (req, res) => {
  const task = req.body;
  TodoModel.create(task)
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

// Delete a todo by ID
app.delete("/delete/:id", (req, res) => {
  const todoId = req.params.id; // Get the todo ID from the request parameters

  TodoModel.findByIdAndDelete(todoId) // Find and delete the todo by its ID
    .then((result) => {
      if (result) {
        res.json({ message: "Todo deleted successfully", result });
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Start the server
app.listen(3001, () => {
  console.log("Server is Running on port 3001");
});
