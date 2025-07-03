// src/components/LoginForm.jsx
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from '../contexts/AuthContext';
import logo from "../resources/logo.png";

export default function LoginForm() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Get login method from AuthContext
  

  // if already logged in, bounce to their dashboard
  if (token) {
    const role = localStorage.getItem("userType");
    return (
      <Navigate
        to={role === "mentor" ? "/dashboard/mentor" : "/dashboard/student"}
        replace
      />
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setIsLoading(true);
    try {
      const res = await apiClient.post("/auth/login", form);
      localStorage.setItem("jwtToken", res.data.token);
      localStorage.setItem("userId", String(res.data.userId));
      localStorage.setItem("userType", res.data.type);
      localStorage.setItem("userName", res.data.username);
      localStorage.setItem("userPhoto", res.data.userphoto);
      // Store user info in AuthContext for global access
      login({
        id: res.data.userId,
        username: res.data.username, // Make sure backend returns username
        type: res.data.type,
        token: res.data.token
      });
      if (res.data.type === "mentor") {
        navigate("/dashboard/mentor", { replace: true });
      } else {
        navigate("/dashboard/student", { replace: true });
      }
    } catch (err) {
      setMsg(err.response?.data || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container py-5 d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        style={{
          width: 400,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px #0001",
          padding: 32,
        }}
      >
<Link to="/">
  <img
    src={logo}
    alt="Edu4All Logo"
    style={{
      width: "100%",
      maxHeight: 100,
      objectFit: "contain",
      marginBottom: 20,
    }}
  />
</Link>        <h2 className="mb-2 text-center">Welcome to Edu4all!</h2>
        <div
          className="mb-4 text-center"
          style={{ color: "#7da0ca", fontSize: 20 }}
        >
          Sign in to your Account
        </div>
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-3 text-end">
            <Link
              to="#"
              style={{ color: "#3b6ea5", textDecoration: "none" }}
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            style={{ fontWeight: 500 }}
            disabled={isLoading}
          >
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            SIGN IN
          </button>
        </form>
        <div className="text-center">
          Not registered?{" "}
          <Link to="/register" style={{ color: "#3b6ea5", fontWeight: 500 }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
