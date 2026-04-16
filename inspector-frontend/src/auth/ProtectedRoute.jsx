import { Navigate, Link } from "react-router-dom";
import { getUser, clearSession } from "./session";

export default function ProtectedRoute({ allowRoles, children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowRoles) && allowRoles.length > 0) {
    if (!allowRoles.includes(user.role)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  // Enforce profile completion (except for ADMIN)
  if (user.role !== "ADMIN" && !user.profileCompleted) {
    // If we are not already on the setup page, redirect to it
    if (window.location.pathname !== "/profile/setup") {
      return <Navigate to="/profile/setup" replace />;
    }
  }

  const handleLogout = () => {
    clearSession();
    // Use window.location.href to perform a hard navigation and reset all React state
    window.location.href = "/login";
  };

  return (
    <div className="layout-container">
      <nav className="main-nav">
        <div className="nav-brand">Inspector Platform</div>
        <div className="nav-actions">
          <Link to="/profile/setup" style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>My Profile</Link>
          <span className="user-email">{user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

