import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
      <style dangerouslySetInnerHTML={{
        __html: `
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
        }
        .admin-sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          position: fixed;
          height: 100vh;
        }
        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 2rem;
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 3rem;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #64748b;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }
        .nav-item:hover {
          background-color: #f1f5f9;
          color: #1e293b;
        }
        .nav-item.active {
          background-color: #eef2ff;
          color: #4f46e1;
        }
        .sidebar-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #ef4444;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .logout-btn:hover {
          background-color: #fef2f2;
        }
        
        /* Shared Admin Styles */
        .admin-page {
          max-width: 1200px;
          margin: 0 auto;
        }
        .card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .page-title {
          font-size: 1.875rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }
        .page-subtitle {
          color: #64748b;
          margin-top: 4px;
        }
        .badge {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .badge-login { background: #dcfce7; color: #15803d; }
        .badge-create { background: #e0e7ff; color: #4338ca; }
        .badge-update { background: #fef9c3; color: #854d0e; }
        .badge-delete { background: #fee2e2; color: #b91c1c; }
        .badge-export { background: #f3f4f6; color: #374151; }
        
        .btn-primary {
          background-color: #4f46e1;
          color: white;
          padding: 10px 20px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover { background-color: #4338ca; transform: translateY(-1px); }
        
        .nav-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 2rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          text-decoration: none;
          color: #1e293b;
          font-weight: 700;
          transition: all 0.2s;
        }
        .nav-card:hover {
          background: white;
          border-color: #4f46e1;
          color: #4f46e1;
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1);
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
        }
        
        .alert-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1rem;
          background: #fff1f2;
          border: 1px solid #fee2e2;
          border-radius: 12px;
          margin: 1rem;
          color: #b91c1c;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .vertical-timeline {
          border-left: 2px solid #e2e8f0;
          margin-left: 20px;
          padding-left: 30px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .timeline-item {
          position: relative;
        }
        .timeline-dot {
          position: absolute;
          left: -41px;
          top: 10px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 4px solid #4f46e1;
        }
        `
      }} />
    </div>
  );
}
