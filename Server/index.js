const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const TodoModel = require("./Models/Todo");
const UserModel = require("./Models/User"); // Import the User model
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using environment variable
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Fetch all todos and sort by createdAt in descending order
app.get("/get", (req, res) => {
  TodoModel.find()
    .sort({ createdAt: -1 })
    .then((result) => res.json(result))
    .catch((err) =>
      res.status(500).json({ message: "Server error", error: err.message })
    );
});

// Update a todo by ID
app.put("/update/:id", (req, res) => {
  const todoId = req.params.id;
  const { status } = req.body;

  // Validate the status
  if (!["Incomplete", "Complete"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  TodoModel.findByIdAndUpdate(todoId, { status }, { new: true })
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    })
    .catch((err) =>
      res.status(500).json({ message: "Server error", error: err.message })
    );
});

// Add a new todo
app.post("/add", (req, res) => {
  const { task } = req.body;

  // Validate the task input
  if (!task || task.trim() === "") {
    return res.status(400).json({ message: "Task is required" });
  }

  TodoModel.create({ task })
    .then((result) => res.status(201).json(result)) // Respond with 201 Created
    .catch((err) =>
      res.status(500).json({ message: "Server error", error: err.message })
    );
});

// Delete a todo by ID
app.delete("/delete/:id", (req, res) => {
  const todoId = req.params.id;

  TodoModel.findByIdAndDelete(todoId)
    .then((result) => {
      if (result) {
        res.json({ message: "Todo deleted successfully", result });
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    })
    .catch((err) =>
      res.status(500).json({ message: "Server error", error: err.message })
    );
});

// Add the signup route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // Duplicate email
      return res.status(400).json({ message: "Email already exists." });
    }
    res.status(500).json({ message: "Error creating user.", error });
  }
});

// Add the login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Use bcrypt to compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // If login is successful
    res.status(200).json({ success: true, message: "Login successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in.", error });
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server is Running on port 3001");
});
