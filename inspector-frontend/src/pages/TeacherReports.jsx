import React, { useState, useEffect } from 'react';
import reportsApi from '../api/reports';
import { FileText, Download, Calendar, User, Search, RefreshCcw, Star, MessageSquare, Lightbulb, X, Eye } from 'lucide-react';

export default function TeacherReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportsApi.getMyReports();
      setReports(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load your reports. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

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
          <p className="page-subtitle">View and download reports finalized by your inspectors.</p>
        </div>
        <button className="secondary-action-btn" onClick={fetchReports} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCcw size={18} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </header>

      <div className="dashboard-content">
        <div style={{ marginBottom: '2rem' }}>
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
          <div className="auth-error"><p>{error}</p></div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state-card">
            <FileText size={64} strokeWidth={1} className="muted-icon" />
            <h3>No reports found</h3>
            <p>{searchTerm ? 'No reports match your search criteria.' : "You don't have any finalized reports yet."}</p>
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
                    {report.score != null && (
                      <div className="detail-row">
                        <Star size={14} style={{ color: '#f59e0b' }} />
                        <span style={{ fontWeight: 700, color: '#f59e0b' }}>{report.score} / 20</span>
                      </div>
                    )}
                  </div>
                  <div className="activity-type-pill">{report.activityType || 'Inspection'}</div>
                </div>

                <div className="card-footer-actions">
                  <button className="details-action-btn" onClick={() => setSelectedReport(report)}>
                    <Eye size={16} /> View Details
                  </button>
                  <button className="download-action-btn" onClick={() => handleDownload(report.id, report.title)}>
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className={`status-badge-chip ${selectedReport.status?.toLowerCase()}`} style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {selectedReport.status}
                </div>
                <h2 className="modal-title">{selectedReport.title}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedReport(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-meta-grid">
              <div className="meta-item"><Calendar size={14} /><span>{new Date(selectedReport.updatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span></div>
              <div className="meta-item"><User size={14} /><span>{selectedReport.activityTitle}</span></div>
              {selectedReport.score != null && (
                <div className="meta-item">
                  <Star size={14} style={{ color: '#f59e0b' }} />
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>{selectedReport.score} / 20</span>
                </div>
              )}
            </div>

            {selectedReport.observations && (
              <div className="modal-section">
                <div className="modal-section-label"><MessageSquare size={14} /> Observations</div>
                <p className="modal-section-text">{selectedReport.observations}</p>
              </div>
            )}

            {selectedReport.recommendations && (
              <div className="modal-section">
                <div className="modal-section-label"><Lightbulb size={14} /> Recommendations</div>
                <p className="modal-section-text">{selectedReport.recommendations}</p>
              </div>
            )}

            <div className="modal-footer">
              <button
                className="download-action-btn"
                style={{ width: 'auto', padding: '12px 24px', flex: 'none' }}
                onClick={() => handleDownload(selectedReport.id, selectedReport.title)}
              >
                <Download size={16} /> Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .search-input-wrapper { position: relative; max-width: 500px; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .modern-search-input { padding-left: 48px !important; height: 52px; border-radius: 14px; font-size: 1rem; background: var(--bg-card); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-subtle); }

        .report-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

        .report-modern-card { background: var(--bg-card); border-radius: 20px; padding: 24px; border: 1px solid rgba(148,163,184,0.1); display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
        .report-modern-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(15,23,42,0.12); border-color: var(--primary-soft); }

        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .status-badge-chip { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.05em; }
        .status-badge-chip.final { background: #dcfce7; color: #15803d; }
        .status-badge-chip.draft { background: #fef9c3; color: #854d0e; }
        .activity-icon-brand { width: 44px; height: 44px; border-radius: 12px; background: var(--primary-soft); color: var(--primary); display: flex; align-items: center; justify-content: center; }

        .report-title-text { font-size: 1.1rem; font-weight: 700; margin: 0 0 16px 0; color: var(--text-main); line-height: 1.4; }
        .report-detail-group { display: grid; gap: 10px; margin-bottom: 16px; }
        .detail-row { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: var(--text-muted); }
        .activity-type-pill { display: inline-flex; padding: 4px 12px; background: #f1f5f9; border-radius: 999px; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 20px; }

        .card-footer-actions { margin-top: auto; padding-top: 16px; border-top: 1px solid #f1f5f9; display: flex; gap: 10px; }
        .details-action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #f1f5f9; color: #334155; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.875rem; border: none; cursor: pointer; transition: background 0.2s; }
        .details-action-btn:hover { background: #e2e8f0; }
        .download-action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: var(--primary); color: white; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
        .download-action-btn:hover { background: var(--primary-dark); }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .report-detail-modal { background: white; border-radius: 20px; padding: 32px; max-width: 600px; width: 100%; max-height: 85vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 16px; }
        .modal-title { font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0; }
        .modal-close-btn { background: #f1f5f9; border: none; border-radius: 10px; padding: 8px; cursor: pointer; display: flex; align-items: center; color: #64748b; transition: background 0.2s; flex-shrink: 0; }
        .modal-close-btn:hover { background: #e2e8f0; }
        .modal-meta-grid { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
        .meta-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-muted); }
        .modal-section { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 14px; border-left: 3px solid var(--primary); }
        .modal-section-label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 8px; }
        .modal-section-text { font-size: 0.9rem; color: #374151; line-height: 1.7; margin: 0; white-space: pre-wrap; }
        .modal-footer { display: flex; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9; }

        .loading-container, .empty-state-card { padding: 80px 20px; text-align: center; background: white; border-radius: 24px; border: 1px dashed var(--border-subtle); display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .muted-icon { color: var(--text-muted); opacity: 0.4; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .report-card-grid { grid-template-columns: 1fr; } }
      `}} />
    </div>
  );
}
