// src/components/RegisterForm.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import apiClient from "../api/apiClient";
import logo from "../resources/logo.png";

const initialFormState = {
  name: "",
  username: "",
  email: "",
  password: "",
  type: "student",
  grade: "",
  country: "",
  curriculum: "",
  profilePictureUrl: "https://cdn.myapp.com/avatars/default.png",
};

// Options for selects
const typeOptions = [
  { value: "student", label: "Student" },
  { value: "mentor", label: "Mentor" },
];
const gradeOptions = Array.from({ length: 6 }, (_, i) => ({
  value: `Grade ${i + 1}`,
  label: `Grade ${i + 1}`,
}));

export default function RegisterForm() {
  const [form, setForm] = useState(initialFormState);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate country options once
  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleTypeChange = (option) => {
    setForm((f) => ({ ...f, type: option ? option.value : "" }));
  };
  const handleGradeChange = (option) => {
    setForm((f) => ({ ...f, grade: option ? option.value : "" }));
  };
  const handleCountryChange = (option) => {
    setForm((f) => ({ ...f, country: option ? option.value : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsLoading(true);

    try {
      await apiClient.post("/auth/register", form);
      setForm(initialFormState);
      setMsg(
        "Registration successful! Click the 'Sign In' link below to access the system."
      );
    } catch (err) {
      setMsg(err.response?.data || "Registration failed");
    } finally {
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
      maxHeight: 50,
      objectFit: "contain",
      marginBottom: 20,
    }}
  />
</Link>
        <h2 className="mb-2 text-center">Welcome to Edu4all!</h2>
        <div
          className="mb-4 text-center"
          style={{ color: "#7da0ca", fontSize: 20 }}
        >
          Sign up for your Account
        </div>
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <input
              name="name"
              className="form-control"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          {/* Username */}
          <div className="mb-3">
            <input
              name="username"
              className="form-control"
              placeholder="Username (login ID)"
              value={form.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          {/* Email */}
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          {/* Password */}
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
          {/* User Type */}
          <div className="mb-3">
            <Select
              options={typeOptions}
              value={typeOptions.find((o) => o.value === form.type) || null}
              onChange={handleTypeChange}
              placeholder="Select Account Type"
              isSearchable
              isDisabled={isLoading}
            />
          </div>
          {/* Student-only fields */}
          {form.type === "student" && (
            <>
              {/* Grade */}
              <div className="mb-3">
                <Select
                  options={gradeOptions}
                  value={
                    form.grade
                      ? gradeOptions.find((o) => o.value === form.grade)
                      : null
                  }
                  onChange={handleGradeChange}
                  placeholder="Select Grade"
                  isSearchable
                  isDisabled={isLoading}
                />
              </div>
              {/* Country */}
              <div className="mb-3">
                <Select
                  options={countryOptions}
                  value={
                    form.country
                      ? countryOptions.find((o) => o.value === form.country)
                      : null
                  }
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                  isSearchable
                  isDisabled={isLoading}
                />
              </div>
              {/* Curriculum */}
              <div className="mb-3">
                <input
                  name="curriculum"
                  className="form-control"
                  placeholder="Curriculum"
                  value={form.curriculum}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {/* Submit */}
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
              />
            )}
            SIGN UP
          </button>
        </form>
        {/* Sign In Link */}
        <div className="text-center">
          Already have an account?{' '}
          <Link to="/login" style={{ color: "#3b6ea5", fontWeight: 500 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
