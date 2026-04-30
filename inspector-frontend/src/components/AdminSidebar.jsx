import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, History, BarChart3, LogOut, ShieldCheck, Users } from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <ShieldCheck size={32} color="#4f46e1" />
        <span>Audit Platform</span>
      </div>
      
      <nav className="sidebar-nav">
        <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/admin/users" className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
          <Users size={20} />
          <span>Users</span>
        </Link>
        <Link to="/admin/logs" className={`nav-item ${isActive('/admin/logs') ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Action Logs</span>
        </Link>
        <Link to="/admin/analytics" className={`nav-item ${isActive('/admin/analytics') ? 'active' : ''}`}>
          <BarChart3 size={20} />
          <span>Analytics</span>
        </Link>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
