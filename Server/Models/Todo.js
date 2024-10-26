const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the timestamp when created
  },
  status: {
    type: String,
    default: "Incomplete", // Use quotes for string
  },
});

const TodoModel = mongoose.model("Todo", TodoSchema);

module.exports = TodoModel;
