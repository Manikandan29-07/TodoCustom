import React, { useEffect, useState } from "react";
import Create from "./Create";
import axios from "axios";
import styles from "./Home.module.css";
import { FaTrash } from "react-icons/fa";

function Home() {
  const [todos, setTodos] = useState([]);

  // Fetch todos when the component mounts
  const fetchTodos = () => {
    axios
      .get("http://localhost:3001/get")
      .then((result) => setTodos(result.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTodos(); // Fetch todos on initial render
  }, []);

  // Function to handle deletion of todo
  const handleDelete = async (todoId) => {
    try {
      await axios.delete(`http://localhost:3001/delete/${todoId}`); // Send DELETE request to your API
      setTodos(todos.filter((todo) => todo._id !== todoId)); // Update the state to remove the deleted todo
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Function to handle adding new todo
  const handleAddTodo = (newTodo) => {
    setTodos((prevTodos) => [newTodo, ...prevTodos]); // Add newTodo to the beginning of the array
  };

  // Function to handle status change
  const handleStatusChange = async (todoId, currentStatus) => {
    const newStatus = currentStatus === "Complete" ? "Incomplete" : "Complete";
    try {
      await axios.put(`http://localhost:3001/update/${todoId}`, {
        status: newStatus,
      }); // Update the status in the database
      setTodos(
        todos.map((todo) =>
          todo._id === todoId ? { ...todo, status: newStatus } : todo
        )
      ); // Update state locally
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Todo List</h2>

      {/* Pass the handleAddTodo function to the Create component */}
      <Create onAddTodo={handleAddTodo} />

      {todos.length === 0 ? (
        <div>
          <h3 className={styles.noRecords}>No Records</h3>
        </div>
      ) : (
        todos.map((todo, index) => (
          <div key={index} className={styles.todoItem}>
            <input
              type="checkbox"
              checked={todo.status === "Complete"} // Checkbox is checked if status is Complete
              onChange={() => handleStatusChange(todo._id, todo.status)} // Call status change function on checkbox change
            />
            <span
              className={todo.status === "Complete" ? styles.strikeThrough : ""}
              style={{ marginLeft: "8px" }} // Add some margin for better spacing
            >
              {todo.task}
            </span>
            <span className={styles.timestamp}>
              {new Date(todo.createdAt).toLocaleString()}{" "}
              {/* Format the timestamp */}
            </span>
            <FaTrash
              className={styles.deleteIcon}
              onClick={() => handleDelete(todo._id)} // Call delete function on click
              title="Delete"
            />
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
