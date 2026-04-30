import { useState, useEffect, useCallback } from "react";
import { getTeacherCourses, getTeacherCourseDetail, markLessonComplete } from "../api/courses";
import { getQuizDetail, submitQuiz } from "../api/quizzes";
import {
  BookOpen, Loader2, CheckCircle, AlertCircle, Video, FileText,
  Brain, ChevronDown, ChevronRight, GraduationCap, Layers, PlayCircle,
  Lock, Star, X, Info
} from "lucide-react";

const LESSON_ICONS = {
  VIDEO: <Video size={15} />,
  PDF: <FileText size={15} />,
  QUIZ: <Brain size={15} />,
};

const LESSON_LABELS = { VIDEO: "Video", PDF: "PDF", QUIZ: "Quiz" };

const TYPE_COLORS = {
  VIDEO: "#3b82f6",
  PDF:   "#f59e0b",
  QUIZ:  "#8b5cf6",
};

function ProgressBar({ value, total }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>
        <span>{value}/{total} lessons</span>
        <span style={{ fontWeight: 700, color: pct === 100 ? "#10b981" : "#7c3aed" }}>{pct}%</span>
      </div>
      <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "100px", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: "100px",
          background: pct === 100
            ? "linear-gradient(90deg,#10b981,#34d399)"
            : "linear-gradient(90deg,#7c3aed,#a78bfa)",
          transition: "width 0.6s cubic-bezier(.4,0,.2,1)"
        }} />
      </div>
    </div>
  );
}

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Views: "list" | "detail"
  const [view, setView] = useState("list");
  const [activeCourse, setActiveCourse] = useState(null);
  
  // Quiz specific state
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  const [expandedModules, setExpandedModules] = useState({});
  const [markingLesson, setMarkingLesson] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    if (selectedLesson?.type === 'QUIZ' && selectedLesson.contentUrl?.startsWith('quiz:')) {
      const quizId = selectedLesson.contentUrl.split(':')[1];
      loadQuizData(quizId);
    } else {
      setQuizData(null);
      setQuizAnswers({});
      setQuizResult(null);
    }
  }, [selectedLesson]);

  const loadQuizData = async (quizId) => {
    setQuizLoading(true);
    try {
      const res = await getQuizDetail(quizId);
      setQuizData(res.data?.data);
    } catch (err) {
      console.error("Failed to load quiz", err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!quizData) return;
    setQuizSubmitting(true);
    try {
      const res = await submitQuiz(quizData.id, quizAnswers);
      setQuizResult(res.data?.data);
      // Automatically mark lesson as complete
      handleMarkComplete(selectedLesson.id);
    } catch (err) {
      alert("Submission failed. You may have already submitted this quiz.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTeacherCourses();
      setCourses(res.data?.data || []);
    } catch {
      setError("Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  const openCourse = async (courseId) => {
    setError(""); setSuccess("");
    try {
      const res = await getTeacherCourseDetail(courseId);
      const detail = res.data?.data;
      setActiveCourse(detail);
      // Auto-expand first incomplete module
      const firstIncomplete = detail?.modules?.findIndex(m =>
        m.lessons?.some(l => !l.completed)
      );
      if (firstIncomplete !== undefined && firstIncomplete >= 0) {
        setExpandedModules({ [detail.modules[firstIncomplete].id]: true });
      }
      setView("detail");
    } catch {
      setError("Failed to load course.");
    }
  };

  const handleMarkComplete = async (lessonId) => {
    setMarkingLesson(lessonId);
    try {
      await markLessonComplete(lessonId, null);
      setSuccess("Lesson completed! 🎉");
      // Refresh course detail
      if (activeCourse) {
        const res = await getTeacherCourseDetail(activeCourse.id);
        setActiveCourse(res.data?.data);
      }
      loadCourses();
    } catch {
      setError("Failed to mark lesson.");
    } finally {
      setMarkingLesson(null);
    }
  };

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="teacher-courses-page">

      {/* Header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">
            {view === "list" ? "My Courses" : activeCourse?.title || "Course"}
          </h1>
          <p className="page-subtitle">
            {view === "list"
              ? "Complete your assigned learning paths and track your progress."
              : `Subject: ${activeCourse?.subject || ""} · By ${activeCourse?.inspectorName || ""}`}
          </p>
        </div>
        {view === "detail" && (
          <button className="secondary-action-btn" onClick={() => { setView("list"); setActiveCourse(null); }}>
            ← Back
          </button>
        )}
      </header>

      {error   && <div className="auth-error"   style={{ marginBottom: "1.5rem" }}><AlertCircle size={16} /> {error}</div>}
      {success && <div className="auth-success" style={{ marginBottom: "1.5rem" }}><CheckCircle size={16} /> {success}</div>}

      {/* ── LIST VIEW ──────────────────────────────────────────────────────── */}
      {view === "list" && (
        <>
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
              <Loader2 className="spinner" size={32} style={{ margin: "0 auto 1rem", display: "block" }} />
              <p>Loading your courses…</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
              <GraduationCap size={48} style={{ color: "#cbd5e1", margin: "0 auto 1rem", display: "block" }} />
              <h3 style={{ color: "#475569", marginBottom: "0.5rem" }}>No courses assigned yet</h3>
              <p className="muted">Your inspector will assign training courses here once available.</p>
            </div>
          ) : (
            <div className="teacher-courses-grid">
              {courses.map(c => {
                const pct = c.progressPercent ?? 0;
                const done = pct === 100;
                return (
                  <div
                    key={c.id}
                    id={`course-card-${c.id}`}
                    className="teacher-course-card card"
                    onClick={() => openCourse(c.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {done && (
                      <div style={{
                        position: "absolute", top: "12px", right: "12px",
                        background: "linear-gradient(135deg,#10b981,#34d399)",
                        color: "white", padding: "4px 10px", borderRadius: "20px",
                        fontSize: "0.7rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px"
                      }}>
                        <Star size={11} fill="white" /> Completed
                      </div>
                    )}

                    <div style={{ marginBottom: "0.75rem" }}>
                      <div style={{
                        display: "inline-block", background: "#ede9fe", color: "#7c3aed",
                        padding: "3px 12px", borderRadius: "20px", fontSize: "0.72rem",
                        fontWeight: 700, marginBottom: "0.75rem"
                      }}>
                        {c.subject}
                      </div>
                      <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.05rem", color: "#1e293b", lineHeight: 1.3 }}>
                        {c.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                        {c.description || "No description."}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", color: "#94a3b8" }}>
                        <Layers size={13} /> {c.totalModules} modules
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", color: "#94a3b8" }}>
                        <BookOpen size={13} /> {c.totalLessons} lessons
                      </div>
                    </div>

                    <ProgressBar value={c.completedLessons ?? 0} total={c.totalLessons ?? 0} />

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                      <span style={{
                        fontSize: "0.8rem", fontWeight: 600, color: "var(--primary)",
                        display: "flex", alignItems: "center", gap: "4px"
                      }}>
                        {done ? "Review" : "Continue"} <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── DETAIL VIEW ────────────────────────────────────────────────────── */}
      {view === "detail" && activeCourse && (
        <div>
          {/* Overall progress */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="card-header" style={{ marginBottom: "1rem" }}>
              <div className="card-title">Your Progress</div>
              <span style={{
                fontSize: "1.5rem", fontWeight: 800,
                color: activeCourse.progressPercent === 100 ? "#10b981" : "#7c3aed"
              }}>
                {activeCourse.progressPercent ?? 0}%
              </span>
            </div>
            <ProgressBar
              value={activeCourse.completedLessons ?? 0}
              total={activeCourse.totalLessons ?? 0}
            />
          </div>

          {/* Modules accordion */}
          {(activeCourse.modules || []).map((mod, mi) => {
            const isExpanded = !!expandedModules[mod.id];
            const modCompleted = mod.completedLessons ?? 0;
            const modTotal = mod.totalLessons ?? mod.lessons?.length ?? 0;
            const modDone = modCompleted === modTotal && modTotal > 0;

            return (
              <div key={mod.id} className="card module-accordion"
                style={{ marginBottom: "1rem", overflow: "hidden" }}>

                {/* Module header */}
                <button
                  id={`module-toggle-${mod.id}`}
                  onClick={() => toggleModule(mod.id)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    padding: "1.25rem", display: "flex", alignItems: "center", gap: "12px",
                    textAlign: "left"
                  }}
                >
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                    background: modDone ? "linear-gradient(135deg,#10b981,#34d399)" : "linear-gradient(135deg,#7c3aed,#a78bfa)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "white"
                  }}>
                    {modDone ? <CheckCircle size={18} /> : <Layers size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                      Module {mi + 1}: {mod.title}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "2px" }}>
                      {modCompleted}/{modTotal} lessons completed
                    </div>
                  </div>
                  <div style={{ color: "#94a3b8", flexShrink: 0 }}>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </button>

                {/* Lessons list */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #f1f5f9" }}>
                    {(mod.lessons || []).map((les, li) => {
                      const isMarking = markingLesson === les.id;
                      const prevDone = li === 0 || mod.lessons[li - 1]?.completed;

                      return (
                        <div key={les.id}
                          id={`lesson-${les.id}`}
                          style={{
                            display: "flex", alignItems: "center", gap: "14px",
                            padding: "1rem 1.25rem",
                            borderBottom: li < mod.lessons.length - 1 ? "1px solid #f8fafc" : "none",
                            background: les.completed ? "#f0fdf4" : "white",
                            opacity: (!prevDone && !les.completed) ? 0.5 : 1,
                            transition: "background 0.3s"
                          }}>

                          {/* Type icon */}
                          <div style={{
                            width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                            background: les.completed ? "#d1fae5" : "#f1f5f9",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: les.completed ? "#10b981" : TYPE_COLORS[les.type]
                          }}>
                            {les.completed ? <CheckCircle size={16} /> : LESSON_ICONS[les.type]}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {les.title}
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "3px" }}>
                              <span style={{ fontSize: "0.75rem", color: TYPE_COLORS[les.type], fontWeight: 600 }}>
                                {LESSON_LABELS[les.type]}
                              </span>
                              {les.durationMinutes && (
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{les.durationMinutes} min</span>
                              )}
                              {les.score != null && (
                                <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>
                                  Score: {les.score}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                            {les.contentUrl && (
                              <button 
                                onClick={() => setSelectedLesson(les)}
                                className="secondary-action-btn"
                                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px" }}>
                                <PlayCircle size={14} /> {les.type === 'VIDEO' ? 'Watch' : 'Read'}
                              </button>
                            )}
                            {!les.completed ? (
                              <button
                                id={`btn-complete-${les.id}`}
                                className="primary-link-button"
                                style={{ padding: "6px 14px", display: "flex", alignItems: "center", gap: "6px" }}
                                disabled={isMarking}
                                onClick={() => handleMarkComplete(les.id)}
                              >
                                {isMarking
                                  ? <><Loader2 className="spinner" size={13} /> Saving…</>
                                  : <><CheckCircle size={13} /> Mark Done</>}
                              </button>
                            ) : (
                              <span style={{
                                fontSize: "0.8rem", color: "#10b981", fontWeight: 700,
                                display: "flex", alignItems: "center", gap: "4px",
                                padding: "6px 14px", background: "#d1fae5", borderRadius: "8px"
                              }}>
                                <CheckCircle size={13} /> Done
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Completion banner */}
          {activeCourse.progressPercent === 100 && (
            <div className="card animate-in" style={{
              marginTop: "1.5rem", textAlign: "center", padding: "2.5rem",
              background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
              border: "1.5px solid #10b981"
            }}>
              <Star size={40} style={{ color: "#10b981", margin: "0 auto 1rem", display: "block" }} fill="#10b981" />
              <h3 style={{ margin: "0 0 0.5rem", color: "#065f46" }}>Course Completed!</h3>
              <p style={{ color: "#047857", margin: 0 }}>
                You've finished all lessons in this course. Great work!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── LESSON VIEWER MODAL ────────────────────────────────────────────────── */}
      {selectedLesson && (
        <div className="lesson-viewer-overlay" onClick={() => setSelectedLesson(null)}>
          <div className="lesson-viewer-content" onClick={e => e.stopPropagation()}>
            <header className="viewer-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ color: TYPE_COLORS[selectedLesson.type] }}>{LESSON_ICONS[selectedLesson.type]}</div>
                <div>
                  <div className="viewer-title">{selectedLesson.title}</div>
                  <div className="viewer-subtitle">{activeCourse?.title}</div>
                </div>
              </div>
              <button className="viewer-close" onClick={() => setSelectedLesson(null)}><X size={20} /></button>
            </header>
            
            <div className={`viewer-body ${selectedLesson.type === 'VIDEO' ? 'video-mode' : ''}`}>
              {selectedLesson.type === 'VIDEO' ? (
                <div className="video-wrapper">
                  {selectedLesson.contentUrl.includes('youtube.com') || selectedLesson.contentUrl.includes('youtu.be') ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${getYouTubeID(selectedLesson.contentUrl)}?autoplay=1`}
                      title={selectedLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video controls autoPlay style={{ width: "100%", borderRadius: "8px" }}>
                      <source src={selectedLesson.contentUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : selectedLesson.type === 'PDF' ? (
                <iframe 
                  src={`${selectedLesson.contentUrl}#toolbar=0`} 
                  className="pdf-viewer" 
                  title={selectedLesson.title}
                ></iframe>
              ) : (
                <div className="quiz-viewer-container">
                  {quizLoading ? (
                    <div className="quiz-loading">
                      <Loader2 className="spinner" size={40} />
                      <p>Loading Quiz...</p>
                    </div>
                  ) : quizResult ? (
                    <div className="quiz-result-overlay animate-in">
                      <div className="score-circle">
                        <div className="score-val">{quizResult.score}<span>/20</span></div>
                        <div className="score-label">Your Score</div>
                      </div>
                      <h3>AI Evaluation</h3>
                      <p className="eval-text">{quizResult.evaluation}</p>
                      {quizResult.trainingSuggestion && (
                        <div className="training-suggestion">
                          <h4><Info size={16} /> Training Suggestion</h4>
                          <p>{quizResult.trainingSuggestion}</p>
                        </div>
                      )}
                      <button className="secondary-action-btn" onClick={() => setSelectedLesson(null)} style={{ marginTop: '1.5rem' }}>
                        Return to Course
                      </button>
                    </div>
                  ) : quizData ? (
                    <form onSubmit={handleQuizSubmit} className="quiz-viewer-form animate-in">
                      <div className="quiz-info-bar">
                        <div className="quiz-topic-tag">{quizData.topic}</div>
                        <div className="quiz-q-count">{quizData.questions?.length} Questions</div>
                      </div>
                      
                      {quizData.questions?.map((q, idx) => (
                        <div key={q.id} className="quiz-viewer-q">
                          <div className="q-index">Question {idx + 1}</div>
                          <p className="q-text">{q.text}</p>
                          
                          {q.type === 'MCQ' ? (
                            <div className="mcq-grid">
                              {q.options?.map(opt => (
                                <label key={opt} className={`mcq-opt-card ${quizAnswers[q.id] === opt ? 'active' : ''}`}>
                                  <input 
                                    type="radio" 
                                    name={`q-${q.id}`} 
                                    value={opt} 
                                    checked={quizAnswers[q.id] === opt}
                                    onChange={() => setQuizAnswers({...quizAnswers, [q.id]: opt})}
                                    required 
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <textarea 
                              className="free-text-input"
                              placeholder="Type your answer here..."
                              value={quizAnswers[q.id] || ""}
                              onChange={(e) => setQuizAnswers({...quizAnswers, [q.id]: e.target.value})}
                              required
                            />
                          )}
                        </div>
                      ))}
                      
                      <div className="quiz-viewer-actions">
                        <button type="submit" className="primary-link-button" disabled={quizSubmitting}>
                          {quizSubmitting ? <><Loader2 className="spinner" size={16} /> Evaluating...</> : "Submit Quiz"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="quiz-viewer-placeholder">
                      <Brain size={48} />
                      <h3>Integrated Quiz System</h3>
                      <p>This lesson is linked to an existing quiz.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedLesson.description && (
              <div className="viewer-description">
                <h4>Description</h4>
                <p>{selectedLesson.description}</p>
              </div>
            )}
            
            <div className="viewer-footer">
              {!selectedLesson.completed && selectedLesson.type !== 'QUIZ' && (
                <button 
                  className="primary-link-button" 
                  onClick={() => {
                    handleMarkComplete(selectedLesson.id);
                    setSelectedLesson(null);
                  }}
                >
                  Mark Lesson as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .teacher-courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .teacher-course-card {
          position: relative;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .teacher-course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 35px rgba(124,58,237,0.14);
        }
        .module-accordion { border-left: 4px solid #a78bfa; }
        .animate-in { animation: slideUp 0.4s ease; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .spinner { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Quiz Viewer Styles */
        .quiz-viewer-container { padding: 2rem; width: 100%; max-width: 800px; margin: 0 auto; color: #1e293b; }
        .quiz-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; color: #64748b; }
        .quiz-viewer-form { display: flex; flex-direction: column; gap: 2rem; }
        .quiz-info-bar { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; }
        .quiz-topic-tag { background: #eff6ff; color: #3b82f6; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
        .quiz-q-count { font-size: 0.85rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .quiz-viewer-q { background: #fff; border: 1px solid #f1f5f9; padding: 1.5rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .q-index { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.75rem; }
        .q-text { font-size: 1.15rem; font-weight: 600; color: #1e293b; margin-bottom: 1.5rem; line-height: 1.5; }
        .mcq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .mcq-opt-card { 
          padding: 1.25rem; border: 2px solid #f1f5f9; border-radius: 14px; cursor: pointer; transition: all 0.22s;
          display: flex; align-items: center; gap: 12px; font-size: 0.95rem; font-weight: 500; color: #475569;
          background: #fff;
        }
        .mcq-opt-card:hover { border-color: #a78bfa; background: #faf5ff; transform: translateY(-2px); }
        .mcq-opt-card.active { border-color: #7c3aed; background: #f5f3ff; color: #7c3aed; font-weight: 700; box-shadow: 0 4px 12px rgba(124,58,237,0.12); }
        .mcq-opt-card input { display: none; }
        .free-text-input { width: 100%; min-height: 120px; padding: 1.25rem; border: 2px solid #f1f5f9; border-radius: 14px; font-family: inherit; transition: all 0.2s; font-size: 1rem; }
        .free-text-input:focus { border-color: #a78bfa; outline: none; background: #faf5ff; }
        .quiz-viewer-actions { margin-top: 1rem; }
        
        .quiz-result-overlay { text-align: center; padding: 2rem; }
        .score-circle { 
          width: 140px; height: 140px; border-radius: 50%; border: 10px solid #3b82f6; 
          display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 2rem;
        }
        .score-val { font-size: 2.5rem; font-weight: 900; color: #1e293b; }
        .score-val span { font-size: 1rem; color: #64748b; }
        .score-label { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .eval-text { color: #475569; line-height: 1.6; margin-bottom: 2rem; }
        .training-suggestion { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 1.25rem; border-radius: 12px; text-align: left; }
        .training-suggestion h4 { color: #16a34a; margin: 0 0 0.5rem; font-size: 0.9rem; }
        .training-suggestion p { font-size: 0.9rem; color: #15803d; line-height: 1.5; margin: 0; }

        /* Lesson Viewer Styles */
        .lesson-viewer-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        .lesson-viewer-content {
          background: white;
          width: 100%;
          max-width: 1000px;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .viewer-header {
          padding: 1.25rem 2rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }
        .viewer-title { font-weight: 800; color: #1e293b; font-size: 1.1rem; }
        .viewer-subtitle { font-size: 0.8rem; color: #64748b; }
        .viewer-close {
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .viewer-close:hover { background: #fee2e2; color: #ef4444; }
        .viewer-body {
          flex: 1;
          overflow-y: auto;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          min-height: 400px;
        }
        .viewer-body.video-mode {
          background: #000;
          justify-content: center;
          align-items: center;
        }
        .video-wrapper {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
        }
        .video-wrapper iframe {
          width: 100%;
          height: 100%;
        }
        .pdf-viewer {
          width: 100%;
          height: 70vh;
          border: none;
          background: white;
        }
        .viewer-description {
          padding: 1.5rem 2rem;
          border-top: 1px solid #f1f5f9;
        }
        .viewer-description h4 { margin: 0 0 0.5rem; color: #1e293b; font-size: 0.9rem; }
        .viewer-description p { margin: 0; color: #64748b; font-size: 0.9rem; line-height: 1.6; }
        .viewer-footer {
          padding: 1.25rem 2rem;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: flex-end;
        }
        .quiz-viewer-placeholder {
          color: #64748b;
          text-align: center;
          padding: 4rem 2rem;
        }
        .quiz-viewer-placeholder h3 { margin: 1rem 0 0.5rem; color: #1e293b; }
        .quiz-viewer-placeholder p { color: #94a3b8; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}

// Helper to extract YouTube ID
function getYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
