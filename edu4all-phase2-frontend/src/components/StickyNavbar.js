import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import logo from '../resources/logo.png';

export default function StickyNavbar() {
  // Get user role from localStorage (or any global state management solution)
  const userRole = localStorage.getItem('userType'); // 'student' or 'mentor'

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img
            src={logo}
            alt="Edu4ALL"
            width="115"
            height="65"
            className="d-inline-block align-text-top me-2"
          />
          <span><b>EDU4ALL</b></span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto main-menu-items">
            {/* Conditionally render based on user role */}
            {userRole === 'student' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link p-2 rounded-circle" to="/dashboard/student">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard/student/resources">Resources</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard/student/all-sessions">Sessions</Link>
                </li>
                 <li className="nav-item">
                  <Link className="nav-link" to="/dashboard/student/forum">Forum</Link>
                </li>
              </>
            )}

            {userRole === 'mentor' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link p-2 rounded-circle" to="/dashboard/mentor">
                    Dashboard
                  </Link>
                </li>
                 <li className="nav-item">
                  <Link className="nav-link p-2 rounded-circle" to="/dashboard/mentor">
                    Sessions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard/upload-resource">Upload Resources</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard/manage-resources">Manage Resources</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard/mentor/forum">Forum</Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
            {userRole === 'mentor' && (
              <>
            <li className="nav-item me-3">
              <Link className="nav-link p-2 rounded-circle" to="/dashboard/mentor/support">
                <i className="bi bi-question-circle fs-4"></i>
              </Link>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link p-2 rounded-circle" href="/dashboard/mentor/profile">
                <i className="bi bi-person-circle fs-4"></i>
              </a>
            </li>
            </>
             )}
            {userRole === 'student' && (
              <>
            <li className="nav-item me-3">
              <Link className="nav-link p-2 rounded-circle" to="/dashboard/student/support">
                <i className="bi bi-question-circle fs-4"></i>
              </Link>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link p-2 rounded-circle" href="/dashboard/student/profile">
                <i className="bi bi-person-circle fs-4"></i>
              </a>
            </li>
            </>
             )}

            <LogoutButton />
          </ul>

        </div>
      </div>
    </nav>
  );
}
