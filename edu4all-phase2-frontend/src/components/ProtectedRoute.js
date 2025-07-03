// src/components/ProtectedRoute.jsx
import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let payload;
  try {
    payload = jwtDecode(token);
  } catch {
    localStorage.removeItem('jwtToken');
    return <Navigate to="/login" replace />;
  }

  // payload.exp is in seconds since epoch
  if (payload.exp < Date.now() / 1000) {
    localStorage.removeItem('jwtToken');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
    // e.g. a student tried to hit /dashboard/mentor
    return <Navigate to="/dashboard/student" replace />;
  }

  return <Outlet />;
}
