// src/components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    nav('/login', { replace: true });
  };

  return (
        <li className="nav-item pointer" onClick={logout}>
          <span className="nav-link p-2 rounded-circle">
            <i className="bi bi-power fs-4"></i>
          </span>
        </li>
  );
}
