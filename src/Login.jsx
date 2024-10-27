import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true); // Set loading state to true
    setErrorMessage(""); // Clear any previous error messages

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      if (response.data.success) {
        navigate("/todos"); // Redirect to todos page after successful login
      } else {
        setErrorMessage("Invalid login credentials.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button type="button" onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <p>
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
}
