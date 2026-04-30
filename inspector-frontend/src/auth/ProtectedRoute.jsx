import { Navigate, Link } from "react-router-dom";
import { getUser, clearSession } from "./session";
import NotificationBell from "../components/NotificationBell";
import { 
  LayoutDashboard, User, Calendar, FileText, LogOut, 
  ShieldCheck, GraduationCap, School, Menu, X, Bell
} from "lucide-react";

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

  const getDashboardPath = (role) => {
    switch (role) {
      case "ADMIN": return "/admin";
      case "INSPECTOR": return "/inspector";
      case "TEACHER": return "/teacher";
      case "PEDAGOGICAL_RESPONSIBLE": return "/responsible";
      default: return "/login";
    }
  };

  return (
    <div className="layout-container">
      <nav className="main-navbar-premium">
        <div className="navbar-left">
          <div className="navbar-logo">
            <div className="logo-icon-wrapper-img">
              <img src="/logo.png" alt="Logo" className="platform-logo-img" />
            </div>
            <div className="logo-text">
              <span className="brand-name">Pedagogical</span>
              <span className="brand-suffix">Center</span>
            </div>
          </div>
          
          <div className="navbar-divider"></div>
          
          <div className="navbar-links">
            <Link to={getDashboardPath(user.role)} className={`nav-item-premium ${window.location.pathname === getDashboardPath(user.role) ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            
            <Link to="/profile/setup" className={`nav-item-premium ${window.location.pathname === '/profile/setup' ? 'active' : ''}`}>
              <User size={18} />
              <span>My Profile</span>
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-actions-group">
            <NotificationBell />
            
            <div className="user-profile-widget">
              <div className="user-info-text">
                <span className="user-email-label">{user.email}</span>
                <span className="user-role-badge">{user.role}</span>
              </div>
              <div className="user-avatar-mini">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="navbar-avatar-img" />
                ) : (
                  user.email.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <button onClick={handleLogout} className="logout-action-btn" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

