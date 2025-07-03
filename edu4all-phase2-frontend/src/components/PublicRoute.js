import { jwtDecode } from 'jwt-decode'
import { Navigate } from 'react-router-dom'

export default function PublicRoute({ children }) {
  const token = localStorage.getItem('jwtToken')
  if (token) {
    try {
      const { role } = jwtDecode(token)
      // Redirect based on role
      return role === 'mentor'
        ? <Navigate to="/dashboard/mentor" replace />
        : <Navigate to="/dashboard/student" replace />
    } catch {
      // Invalid token – clear and fall back to public view
      localStorage.removeItem('jwtToken')
    }
  }
  return children
}
