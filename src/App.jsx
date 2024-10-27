import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todos" element={<Home />} /> {/* Todo page route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
