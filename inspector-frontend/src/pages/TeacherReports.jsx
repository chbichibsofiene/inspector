import React, { useState, useEffect } from 'react';
import reportsApi from '../api/reports';
import { FileText, Download, Calendar, User, Search, RefreshCcw } from 'lucide-react';

export default function TeacherReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportsApi.getMyReports();
      setReports(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load your reports. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = async (reportId, title) => {
    try {
      await reportsApi.downloadReportPdf(reportId, `${title}.pdf`);
    } catch (err) {
      alert('Failed to download the report.');
    }
  };

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.activityTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="layout-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">My Pedagogical Reports</h1>
          <p className="page-subtitle">
            View and download reports finalized by your inspectors.
          </p>
        </div>
        <button className="secondary-action-btn" onClick={fetchReports} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCcw size={18} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </header>

      <div className="dashboard-content">
        <div className="search-section" style={{ marginBottom: '2rem' }}>
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              className="modern-search-input"
              placeholder="Search reports by title or activity..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Gathering your pedagogical feedback...</p>
          </div>
        ) : error ? (
          <div className="auth-error">
            <p>{error}</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state-card">
            <FileText size={64} strokeWidth={1} className="muted-icon" />
            <h3>No reports found</h3>
            <p>
              {searchTerm ? "No reports match your search criteria." : "You don't have any finalized reports yet. They will appear here once submitted by your inspector."}
            </p>
          </div>
        ) : (
          <div className="report-card-grid">
            {filteredReports.map((report) => (
              <div key={report.id} className="report-modern-card shadow-hover">
                <div className="card-top">
                  <div className={`status-badge-chip ${report.status?.toLowerCase()}`}>
                    {report.status || 'FINAL'}
                  </div>
                  <div className="activity-icon-brand">
                    <FileText size={22} />
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="report-title-text">{report.title}</h3>
                  
                  <div className="report-detail-group">
                    <div className="detail-row">
                      <Calendar size={14} />
                      <span>{new Date(report.updatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                    <div className="detail-row">
                      <User size={14} />
                      <span>{report.activityTitle}</span>
                    </div>
                  </div>

                  <div className="activity-type-pill">
                    {report.activityType || 'Inspection'}
                  </div>
                </div>

                <div className="card-footer-actions">
                  <button 
                    className="download-action-btn"
                    onClick={() => handleDownload(report.id, report.title)}
                  >
                    <Download size={18} />
                    Download PDF Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .search-input-wrapper {
          position: relative;
          max-width: 500px;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .modern-search-input {
          padding-left: 48px !important;
          height: 52px;
          border-radius: 14px;
          font-size: 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-subtle);
        }

        .report-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .report-modern-card {
          background: var(--bg-card);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(148, 163, 184, 0.1);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
        }

        .report-modern-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
          border-color: var(--primary-soft);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .status-badge-chip {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.05em;
        }
        .status-badge-chip.final { background: #dcfce7; color: #15803d; }
        .status-badge-chip.draft { background: #fee2e2; color: #b91c1c; }

        .activity-icon-brand {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--primary-soft);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .report-title-text {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 16px 0;
          color: var(--text-main);
          line-height: 1.4;
        }

        .report-detail-group {
          display: grid;
          gap: 10px;
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .activity-type-pill {
          display: inline-flex;
          padding: 4px 12px;
          background: #f1f5f9;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 24px;
        }

        .card-footer-actions {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }

        .download-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--primary);
          color: white;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .download-action-btn:hover {
          background: var(--primary-dark);
          transform: scale(1.02);
        }

        .loading-container, .empty-state-card {
          padding: 80px 20px;
          text-align: center;
          background: white;
          border-radius: 24px;
          border: 1px dashed var(--border-subtle);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .muted-icon { color: var(--text-muted); opacity: 0.4; }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .report-card-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
}
