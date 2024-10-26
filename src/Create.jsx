import React, { useState } from "react";
import axios from "axios";

export default function Create({ onAddTodo }) {
  const [task, setTask] = useState("");

  // Handle adding the todo task
  const handleAdd = async () => {
    if (!task.trim()) return; // Prevent adding empty tasks

    try {
      const response = await axios.post("http://localhost:3001/add", { task }); // Send POST request to add a new todo

      // Pass the newly added todo to the Home component
      onAddTodo(response.data);

      // Clear the input field after adding
      setTask("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a todo"
      />
      <button type="button" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}
