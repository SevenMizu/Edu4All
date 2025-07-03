// src/components/Profile.js
import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import apiClient from "../api/apiClient";
import StickyNavbar from "../components/StickyNavbar";
import { useAuth } from "../contexts/AuthContext";

const GRADES = ["1", "2", "3", "4", "5", "6"];
const CURRICULA = [
  "IB",
  "Cambridge International",
  "CBSE",
  "National Curriculum",
  "Other",
];

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const { user, logout } = useAuth();

  // State for fetched profile data and editable form
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    grade: "",
    country: "",
    curriculum: "",
    profilePictureUrl: "",
    type: "", // needed for API but not shown in form
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Generate country options once
  const countryOptions = useMemo(() => countryList().getData(), []);

  // Ref to the hidden file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    async function fetchProfile() {
      try {
        const response = await apiClient.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setProfileData(data);

        // Initialize formData with fetched values; leave password blank
        setFormData({
          username: data.username || "",
          name: data.name || "",
          email: data.email || "",
          password: "",
          grade: data.grade || "",
          country: data.country || "",
          curriculum: data.curriculum || "",
          profilePictureUrl: data.profilePictureUrl || "",
          type: data.type || "",
        });

        // === Determine preview URL using explicit backend origin ===
        const BACKEND_BASE = "http://localhost:8080";
        let previewURL = "/default-avatar.png";
        if (data.profilePictureUrl) {
          if (data.profilePictureUrl.startsWith("http")) {
            // Already a full URL
            previewURL = data.profilePictureUrl;
          } else {
            // If it already begins with "/uploads/...", just prepend base
            const relPath = data.profilePictureUrl.startsWith("/")
              ? data.profilePictureUrl
              : `/uploads/${data.profilePictureUrl}`;
            previewURL = `${BACKEND_BASE}${relPath}`;
          }
        }
        setPhotoPreview(previewURL);
      } catch (err) {
        setErrorMsg(err.response?.data || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  // Redirect if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Handle input/text/select changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  // Handle clicking the profile picture (opens file selector)
  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection and preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission (save changes)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const didChangePassword = formData.password.trim() !== "";
      const updateData = new FormData();
      updateData.append("username", formData.username);
      updateData.append("name", formData.name);
      updateData.append("email", formData.email);
      if (didChangePassword) {
        updateData.append("password", formData.password);
      }
      updateData.append("country", formData.country);
      // Only send grade & curriculum if user is not a mentor
      if (formData.type !== "mentor") {
        updateData.append("grade", formData.grade);
        updateData.append("curriculum", formData.curriculum);
      }
      updateData.append("type", formData.type);
      if (photoFile) {
        updateData.append("profilePicture", photoFile);
      }

      const resp = await apiClient.put("/auth/me", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // On success, immediately fix photoPreview if picture changed:
      if (photoFile) {
        const updatedUrl = resp.data.profilePictureUrl;
        const BACKEND_BASE = "http://localhost:8080";
        let previewURL = "/default-avatar.png";

        if (updatedUrl) {
          if (updatedUrl.startsWith("http")) {
            previewURL = updatedUrl;
          } else {
            // If backend returned "/uploads/filename.png", use that directly
            const relPath = updatedUrl.startsWith("/")
              ? updatedUrl
              : `/uploads/${updatedUrl}`;
            previewURL = `${BACKEND_BASE}${relPath}`;
          }
        }
        setPhotoPreview(previewURL);
      }

      if (didChangePassword) {
        setShowLogoutModal(true);
      } else {
        toastr.success("Profile updated successfully.");
      }
    } catch (err) {
      console.error(err);
      toastr.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <StickyNavbar />

      <div className="container-fluid py-5">
        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "50vh" }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="container py-5">
            <div className="alert alert-danger text-center">{errorMsg}</div>
          </div>
        ) : (
          <div
            className="mx-auto p-4"
            style={{
              width: "80%",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="mb-5 text-center">My Profile</h2>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />

            {/* Profile Picture (clickable) */}
            <div className="text-center mb-5">
              <img
                src={photoPreview}
                alt="Profile"
                onClick={handlePhotoClick}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #3b6ea5",
                  cursor: "pointer",
                }}
              />
              <div className="small mt-2 text-muted">
                Click image to change
              </div>
            </div>

            <div className="row g-4">
              {/* Username (read-only) */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control shadow-sm"
                  value={formData.username}
                  readOnly
                />
              </div>

              {/* Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control shadow-sm"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email (read-only) */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control shadow-sm"
                  value={formData.email}
                  readOnly
                />
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Password{" "}
                  <span className="text-muted" style={{ fontWeight: 400 }}>
                    (leave blank to keep current)
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control shadow-sm"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              {/* Conditionally show Grade & Curriculum only if user type is NOT mentor */}
              {formData.type !== "mentor" && (
                <>
                  {/* Grade */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Grade</label>
                    <select
                      name="grade"
                      className="form-select shadow-sm"
                      value={formData.grade}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Grade</option>
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Curriculum */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Curriculum
                    </label>
                    <select
                      name="curriculum"
                      className="form-select shadow-sm"
                      value={formData.curriculum}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Curriculum</option>
                      {CURRICULA.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Country */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Country</label>
                <select
                  name="country"
                  className="form-select shadow-sm"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="">Select Country</option>
                  {countryOptions.map((opt) => (
                    <option key={opt.value} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center mt-5">
              <button
                className="btn btn-primary px-5 me-3"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Save Changes
              </button>
              <button
                className="btn btn-outline-danger px-5"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for logging out after password change */}
      {showLogoutModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal d-block"
            tabIndex="-1"
            role="dialog"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div
              className="modal-dialog"
              role="document"
              style={{ maxWidth: "400px" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Password Changed</h5>
                </div>
                <div className="modal-body">
                  <p>
                    Your password has been updated. You will be logged out now.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleLogout}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
