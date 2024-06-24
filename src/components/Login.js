// In your Login component
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./Login.css"; // Import your custom CSS file for additional styles

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000", { username, password });

      if (res.data === "exist") {
        sessionStorage.setItem("username", username);
        navigate("/home", { state: { id: username } });
      } else if (res.data === "notexist") {
        alert("User has not signed up");
      }
    } catch (error) {
      alert("Wrong details");
      console.log(error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-form-container p-4 shadow rounded">
        <h1 className="text-center mb-4">Login</h1>

        <form onSubmit={submit} className="mb-3">
          <div className="mb-3">
            <input
              type="username"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <hr className="my-4" />

        <p className="text-center">OR</p>

        <Link to="/signup" className="d-block text-center">
          Signup Page
        </Link>
      </div>
    </div>
  );
}

export default Login;
