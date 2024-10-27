import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:3001/signup", { email, password });
      alert("Signup successful, please login.");
      navigate("/login"); // Redirect to login after successful signup
    } catch (err) {
      console.error("Error signing up:", err);
      alert("Signup failed.");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
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
      <button type="button" onClick={handleSignup}>
        Signup
      </button>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}
