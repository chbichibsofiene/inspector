import { useState, useEffect } from "react";
import profileApi from "../api/profile";
import { downloadReportPdf } from "../api/reports";
import { X, Calendar, FileText, Download, User, School, Clock, MapPin, AlertCircle, Brain } from "lucide-react";

export default function TeacherInsightsModal({ teacher, onClose }) {
  const [activeTab, setActiveTab] = useState("timetable");
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [reports, setReports] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  useEffect(() => {
    if (teacher) {
      loadInsights();
    }
  }, [teacher]);

  async function loadInsights() {
    setLoading(true);
    setError("");
    try {
      const [ttRes, repRes, quizRes] = await Promise.all([
        profileApi.getTeacherTimetable(teacher.id),
        profileApi.getTeacherReports(teacher.id),
        profileApi.getTeacherQuizzes(teacher.id)
      ]);
      setTimetable(ttRes.data?.data || []);
      setReports(repRes.data?.data || []);
      setQuizzes(quizRes.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load teacher insights.");
    } finally {
      setLoading(false);
    }
  }

  const groupedSlots = days.reduce((acc, day) => {
    acc[day] = timetable.filter(s => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  const handleDownload = async (e, reportId, title) => {
    e.stopPropagation(); // Prevent card from collapsing/expanding when downloading
    try {
      await downloadReportPdf(reportId, `${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    } catch (err) {
      alert("Failed to download PDF. Please try again later.");
    }
  };

  const toggleReport = (id) => {
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  return (
    <div className="modal-overlay insight-modal-overlay" onClick={onClose}>
      <div className="modal-content teacher-insight-modal card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}></button>

        <div className="modal-header-premium">
          <div className="teacher-profile-summary">
            {teacher.profileImageUrl ? (
              <img 
                src={teacher.profileImageUrl} 
                alt={`${teacher.firstName} ${teacher.lastName}`} 
                className="profile-avatar-large" 
                style={{ objectFit: 'cover', border: '3px solid white', outline: '2px solid #3b82f6' }} 
              />
            ) : (
              <div className="profile-avatar-large">
                <User size={32} />
              </div>
            )}
            <div className="profile-text">
              <h2>{teacher.firstName} {teacher.lastName}</h2>
              <div className="meta-info">
                <span className="serial-badge">{teacher.serialCode}</span>
                <span className="sep">•</span>
                <span className="school-name"><School size={14} /> {teacher.etablissement?.name}</span>
              </div>
            </div>
          </div>

          <div className="tab-switcher">
            <button 
              className={`tab-btn ${activeTab === 'timetable' ? 'active' : ''}`}
              onClick={() => setActiveTab('timetable')}
            >
              <Calendar size={16} /> Timetable
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <FileText size={16} /> Report History
            </button>
            <button 
              className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quizzes')}
            >
              <Brain size={16} /> Quiz assessment
            </button>
          </div>
        </div>

        <div className="modal-body-scroller">
          {loading ? (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Fetching insights...</p>
            </div>
          ) : error ? (
            <div className="modal-error">
              <AlertCircle size={40} />
              <p>{error}</p>
            </div>
          ) : (
            <div className="tab-content">
              {activeTab === 'timetable' && (
                <div className="timetable-insights">
                  <div className="timetable-grid-read">
                    {days.map(day => (
                      <div key={day} className="timetable-col">
                        <h5>{day.charAt(0) + day.slice(1).toLowerCase()}</h5>
                        <div className="col-slots">
                          {groupedSlots[day].length === 0 ? (
                            <div className="no-slots-muted">No classes</div>
                          ) : (
                            groupedSlots[day].map(slot => (
                              <div key={slot.id} className="insight-slot-item">
                                <div className="slot-time-range">
                                  <Clock size={12} /> {slot.startTime} - {slot.endTime}
                                </div>
                                <div className="slot-subject-text">{slot.subject}</div>
                                <div className="slot-level-text">{slot.level}</div>
                                <div className="slot-place">
                                  <MapPin size={12} /> {slot.classroom || "N/A"}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="reports-insights">
                  {reports.length === 0 ? (
                    <div className="empty-reports-state">
                      <FileText size={48} />
                      <p>No validated reports found for this teacher.</p>
                    </div>
                  ) : (
                    <div className="reports-legacy-list">
                      {reports.map(report => (
                        <div 
                          key={report.id} 
                          className={`report-history-item card ${expandedReportId === report.id ? 'expanded' : ''}`}
                          onClick={() => toggleReport(report.id)}
                        >
                          <div className="report-item-header">
                            <div className="report-main">
                              <div className="report-icon-box">
                                <FileText size={20} />
                              </div>
                              <div className="report-meta">
                                <h4>{report.title}</h4>
                                <p>{report.activityType || 'Pedagogical Visit'} • {new Date(report.updatedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="report-actions">
                              <button 
                                className="download-report-btn" 
                                onClick={(e) => handleDownload(e, report.id, report.title)}
                              >
                                <Download size={16} /> PDF
                              </button>
                            </div>
                          </div>

                          {expandedReportId === report.id && (
                            <div className="report-details-tray" onClick={e => e.stopPropagation()}>
                              <div className="detail-section">
                                <div className="detail-label">Observations</div>
                                <div className="detail-value">{report.observations || "No observations recorded."}</div>
                              </div>
                              <div className="detail-section">
                                <div className="detail-label">Recommendations</div>
                                <div className="detail-value">{report.recommendations || "No recommendations recorded."}</div>
                              </div>
                              <div className="detail-footer">
                                <div className="detail-score-box">
                                  <span className="score-label">Final Score</span>
                                  <span className="score-value">{report.score ? `${report.score}/20` : 'N/A'}</span>
                                </div>
                                <div className="status-indicator">
                                  Status: <strong>{report.status}</strong>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'quizzes' && (
                <div className="reports-insights">
                  {quizzes.length === 0 ? (
                    <div className="empty-reports-state">
                      <Brain size={48} />
                      <p>This teacher has not submitted any AI quizzes yet.</p>
                    </div>
                  ) : (
                    <div className="reports-legacy-list">
                      {quizzes.map(quiz => (
                        <div key={quiz.id} className="report-history-item card expanded" style={{ cursor: 'default' }}>
                          <div className="report-item-header">
                            <div className="report-main">
                              <div className="report-icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                                <Brain size={20} />
                              </div>
                              <div className="report-meta">
                                <h4>{quiz.quizTitle}</h4>
                                <p>{quiz.quizTopic} • {new Date(quiz.submittedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="score-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>AI Score</span>
                              <strong style={{ fontSize: '1.25rem', color: '#3b82f6' }}>{quiz.score}/20</strong>
                            </div>
                          </div>
                          
                          <div className="report-details-tray" style={{ display: 'block' }}>
                            <div className="detail-section">
                              <div className="detail-label">AI Evaluation</div>
                              <div className="detail-value">{quiz.evaluationText}</div>
                            </div>
                            <div className="detail-section">
                              <div className="detail-label" style={{ color: '#16a34a' }}>Recommended Training</div>
                              <div className="detail-value" style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', marginTop: '8px' }}>
                                {quiz.trainingSuggestion}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .insight-modal-overlay {
            z-index: 1000;
          }

          .teacher-insight-modal {
            max-width: 1000px;
            width: 95%;
            height: 90vh;
            display: flex;
            flex-direction: column;
            padding: 0;
            border-radius: 24px;
            background: #fff;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            position: relative;
            overflow: hidden;
          }

          .close-btn {
            position: absolute;
            top: 24px;
            right: 24px;
            width: 30px;
            height: 30px;
            background: transparent;
            border: none;
            cursor: pointer;
            z-index: 9999;
          }

          .close-btn::before,
          .close-btn::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 2px;
            background: #333;
            transform-origin: center;
            transition: background 0.2s;
          }

          .close-btn::before {
            transform: translate(-50%, -50%) rotate(45deg);
          }

          .close-btn::after {
            transform: translate(-50%, -50%) rotate(-45deg);
          }

          .close-btn:hover::before,
          .close-btn:hover::after {
            background: red;
          }

          .modal-header-premium {
            padding: 2.5rem 2.5rem 1rem;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
          }

          .teacher-profile-summary {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .profile-avatar-large {
            width: 72px;
            height: 72px;
            background: #3b82f6;
            color: white;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
          }

          .profile-text h2 {
            margin: 0 0 0.5rem;
            font-size: 1.75rem;
            color: #0f172a;
          }

          .meta-info {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #64748b;
            font-size: 0.95rem;
          }

          .serial-badge {
            background: white;
            padding: 4px 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-weight: 700;
            font-size: 0.8rem;
            color: #3b82f6;
          }

          .sep { color: #cbd5e1; }
          .school-name { display: flex; align-items: center; gap: 6px; }

          .tab-switcher {
            display: flex;
            gap: 8px;
          }

          .tab-btn {
            padding: 0.75rem 1.25rem;
            border-radius: 12px 12px 0 0;
            border: none;
            background: none;
            font-weight: 700;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            top: 1px;
          }

          .tab-btn.active {
            background: white;
            color: #3b82f6;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.02);
            border-left: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            border-top: 1px solid #e2e8f0;
          }

          .modal-body-scroller {
            flex: 1;
            overflow-y: auto;
            padding: 2.5rem;
            background: white;
          }

          .timetable-grid-read {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 12px;
          }

          .timetable-col h5 {
            text-align: center;
            margin: 0 0 1rem;
            color: #64748b;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }

          .insight-slot-item {
            background: #f1f5f9;
            border-radius: 12px;
            padding: 0.75rem;
            margin-bottom: 8px;
            border: 1px solid #e2e8f0;
          }

          .slot-time-range {
            font-size: 0.7rem;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 4px;
          }

          .slot-subject-text {
            font-weight: 800;
            font-size: 0.85rem;
            color: #1e293b;
            line-height: 1.2;
          }

          .slot-level-text {
            font-size: 0.75rem;
            color: #64748b;
            margin: 2px 0 6px;
          }

          .slot-place {
            font-size: 0.7rem;
            color: #94a3b8;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .no-slots-muted {
            text-align: center;
            font-size: 0.7rem;
            color: #cbd5e1;
            padding: 1rem 0;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px dashed #e2e8f0;
          }

          .reports-legacy-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .report-history-item {
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            background: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            border-left: 4px solid transparent;
          }

          .report-history-item:hover {
            border-color: #316eda;
            background: #f8fafc;
          }

          .report-history-item.expanded {
            border-left-color: #3b82f6;
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          }

          .report-item-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .report-main {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .report-icon-box {
            width: 44px;
            height: 44px;
            background: #eff6ff;
            color: #3b82f6;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .report-meta h4 {
            margin: 0 0 4px;
            color: #1e293b;
            font-size: 1rem;
          }

          .report-meta p {
            margin: 0;
            font-size: 0.85rem;
            color: #64748b;
          }

          .report-details-tray {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #f1f5f9;
            animation: slideDown 0.3s ease-out;
          }

          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .detail-section {
            margin-bottom: 1.25rem;
          }

          .detail-label {
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 6px;
            letter-spacing: 0.05em;
          }

          .detail-value {
            font-size: 0.95rem;
            color: #334155;
            line-height: 1.6;
            white-space: pre-wrap;
          }

          .detail-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 2rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 12px;
          }

          .detail-score-box {
            display: flex;
            flex-direction: column;
          }

          .score-label {
            font-size: 0.7rem;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
          }

          .score-value {
            font-size: 1.25rem;
            font-weight: 900;
            color: #3b82f6;
          }

          .status-indicator {
            font-size: 0.85rem;
            color: #64748b;
          }

          .status-indicator strong {
            color: #10b981;
            text-transform: uppercase;
          }

          .download-report-btn {
            background: white;
            border: 1px solid #e2e8f0;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 700;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .download-report-btn:hover {
            border-color: #3b82f6;
            color: #3b82f6;
            background: #f0f9ff;
          }

          .modal-loading, .modal-error, .empty-reports-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 5rem 0;
            color: #64748b;
          }

          .modal-error { color: #ef4444; }
          .modal-error p { margin-top: 1rem; }

          @media (max-width: 900px) {
            .timetable-grid-read {
              grid-template-columns: 1fr;
            }
            .timetable-col { margin-bottom: 2rem; }
          }

          .insight-slot-item {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 10px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .insight-slot-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #3b82f6;
            border-radius: 4px 0 0 4px;
            opacity: 0;
            transition: opacity 0.3s;
          }

          .insight-slot-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.1);
            border-color: #bfdbfe;
          }

          .insight-slot-item:hover::before {
            opacity: 1;
          }

          .tab-btn {
            padding: 0.85rem 1.5rem;
            border-radius: 14px 14px 0 0;
            font-size: 0.95rem;
            background: transparent;
          }
          
          .tab-btn:hover {
            background: rgba(241, 245, 249, 0.5);
            color: #3b82f6;
          }

          .report-history-item {
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            margin-bottom: 8px;
          }

          .report-history-item:hover {
            transform: scale(1.01);
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
            z-index: 10;
          }
        `}} />
      </div>
    </div>
  );
}
