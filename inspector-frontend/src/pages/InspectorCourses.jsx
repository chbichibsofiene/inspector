import { useState, useEffect, useCallback } from "react";
import {
  createCourse, getInspectorCourses, getInspectorCourseDetail,
  publishCourse, addModuleToCourse, assignTeacher, unassignTeacher, getCourseProgress,
  deleteCourse as apiDeleteCourse, deleteModuleFromCourse as apiDeleteModule
} from "../api/courses";
import profileApi from "../api/profile";
import { getInspectorQuizzes } from "../api/quizzes";
import {
  BookOpen, Plus, Loader2, CheckCircle, AlertCircle, ChevronRight,
  ChevronDown, Users, Eye, Upload, Video, FileText, Brain, X,
  GraduationCap, BarChart2, Layers, PlayCircle, Trash2
} from "lucide-react";
import { useTranslation } from "react-i18next";

const LESSON_TYPE_ICONS = {
  VIDEO: <Video size={14} />,
  PDF: <FileText size={14} />,
  QUIZ: <Brain size={14} />,
};

const STATUS_COLORS = {
  DRAFT: "#f59e0b",
  PUBLISHED: "#10b981",
  ARCHIVED: "#94a3b8",
};

export default function InspectorCourses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Views: "list" | "create" | "detail" | "progress"
  const [view, setView] = useState("list");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [progressData, setProgressData] = useState([]);

  // Create form
  const [form, setForm] = useState({
    title: "", description: "", subject: "",
    modules: [{ title: "", description: "", lessons: [{ title: "", type: "VIDEO", contentUrl: "", description: "", durationMinutes: "" }] }]
  });

  // Add-module form
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState({ 
    title: "", 
    description: "", 
    lessons: [{ title: "", type: "VIDEO", contentUrl: "", description: "", durationMinutes: "" }] 
  });

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getInspectorCourses();
      setCourses(res.data?.data || []);
    } catch { setError("Failed to load courses"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadCourses();
    profileApi.getSubjects().then(r => setSubjects(r.data?.data || []));
    profileApi.getMyTeachers().then(r => setTeachers(r.data?.data || [])).catch(() => {});
    getInspectorQuizzes().then(r => setQuizzes(r.data?.data || [])).catch(() => {});
  }, [loadCourses]);

  const openDetail = async (courseId) => {
    try {
      const res = await getInspectorCourseDetail(courseId);
      setSelectedCourse(res.data?.data);
      setView("detail");
    } catch { setError("Failed to load course detail"); }
  };

  const openProgress = async (courseId) => {
    try {
      const res = await getCourseProgress(courseId);
      setProgressData(res.data?.data || []);
      setView("progress");
    } catch { setError("Failed to load progress data"); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      await createCourse({
        title: form.title,
        description: form.description,
        subject: form.subject,
        modules: form.modules.map((m, mi) => ({
          title: m.title, description: m.description, orderIndex: mi,
          lessons: m.lessons.map((l, li) => ({
            ...l,
            durationMinutes: l.durationMinutes ? parseInt(l.durationMinutes) : null,
            orderIndex: li
          }))
        }))
      });
      setSuccess("Course created successfully!");
      setView("list");
      loadCourses();
      setForm({ title: "", description: "", subject: "", modules: [{ title: "", description: "", lessons: [{ title: "", type: "VIDEO", contentUrl: "", description: "", durationMinutes: "" }] }] });
    } catch { setError("Failed to create course."); }
    finally { setLoading(false); }
  };

  const handlePublish = async (courseId) => {
    try {
      await publishCourse(courseId);
      setSuccess("Course published!");
      if (selectedCourse?.id === courseId) {
        openDetail(courseId);
      }
      loadCourses();
    } catch { setError("Failed to publish course."); }
  };

  const handleAddModule = async () => {
    if (!selectedCourse) return;
    setLoading(true); setError(""); setSuccess("");
    try {
      await addModuleToCourse(selectedCourse.id, { 
        ...newModule, 
        orderIndex: (selectedCourse.modules?.length || 0),
        lessons: newModule.lessons.map((l, li) => ({
          ...l,
          durationMinutes: l.durationMinutes ? parseInt(l.durationMinutes) : null,
          orderIndex: li
        }))
      });
      setSuccess("Module added!"); setShowAddModule(false);
      openDetail(selectedCourse.id);
      setNewModule({ title: "", description: "", lessons: [{ title: "", type: "VIDEO", contentUrl: "", description: "", durationMinutes: "" }] });
    } catch { setError("Failed to add module."); }
    finally { setLoading(false); }
  };

  const handleAssign = async (courseId, teacherUserId) => {
    try {
      await assignTeacher(courseId, teacherUserId);
      setSuccess("Teacher assigned!");
      openDetail(courseId);
    } catch { setError("Already assigned or error."); }
  };

  const handleUnassign = async (courseId, teacherUserId) => {
    try {
      await unassignTeacher(courseId, teacherUserId);
      setSuccess("Teacher removed!");
      openDetail(courseId);
    } catch { setError("Error removing teacher."); }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone and will remove all modules, lessons, and teacher assignments.")) return;
    try {
      await apiDeleteCourse(courseId);
      setSuccess("Course deleted successfully.");
      loadCourses();
      if (selectedCourse?.id === courseId) setView("list");
    } catch { setError("Failed to delete course."); }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!selectedCourse) return;
    if (!window.confirm("Are you sure you want to delete this module and all its lessons?")) return;
    try {
      await apiDeleteModule(selectedCourse.id, moduleId);
      setSuccess("Module deleted.");
      openDetail(selectedCourse.id);
    } catch { setError("Failed to delete module."); }
  };

  // ─── Module builder helpers ─────────────────────────────────────────────────
  const addModule = () => setForm(f => ({
    ...f, modules: [...f.modules, { title: "", description: "", lessons: [{ title: "", type: "VIDEO", contentUrl: "", description: "", durationMinutes: "" }] }]
  }));
  const removeModule = (mi) => setForm(f => ({ ...f, modules: f.modules.filter((_, i) => i !== mi) }));
  const updateModule = (mi, field, val) => setForm(f => ({
    ...f, modules: f.modules.map((m, i) => i === mi ? { ...m, [field]: val } : m)
  }));
  const addLesson = (mi) => setForm(f => ({
    ...f, modules: f.modules.map((m, i) => i === mi
      ? { ...m, lessons: [...m.lessons, { title: "", type: "VIDEO", contentUrl: "", description: "", durationMinutes: "" }] }
      : m)
  }));
  const removeLesson = (mi, li) => setForm(f => ({
    ...f, modules: f.modules.map((m, i) => i === mi ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) } : m)
  }));
  const updateLesson = (mi, li, field, val) => setForm(f => ({
    ...f, modules: f.modules.map((m, i) => i === mi
      ? { ...m, lessons: m.lessons.map((l, j) => j === li ? { ...l, [field]: val } : l) }
      : m)
  }));

  // New Module lesson helpers
  const addLessonToNewModule = () => setNewModule(m => ({
    ...m, lessons: [...m.lessons, { title: "", type: "VIDEO", contentUrl: "", description: "", durationMinutes: "" }]
  }));
  const removeLessonFromNewModule = (li) => setNewModule(m => ({
    ...m, lessons: m.lessons.filter((_, i) => i !== li)
  }));
  const updateLessonInNewModule = (li, field, val) => setNewModule(m => ({
    ...m, lessons: m.lessons.map((l, i) => i === li ? { ...l, [field]: val } : l)
  }));

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="inspector-courses-page">
      {/* Header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">
            {view === "list" && t("courseManagement")}
            {view === "create" && t("createNewCourse")}
            {view === "detail" && (selectedCourse?.title || t("courseDetail"))}
            {view === "progress" && t("progressOverview")}
          </h1>
          <p className="page-subtitle">
            {view === "list" && t("courseManagementDesc")}
            {view === "create" && t("createCourseDesc")}
            {view === "detail" && `${t("subject")}: ${selectedCourse?.subject || ""} · ${t("status")}: ${selectedCourse?.status || ""}`}
            {view === "progress" && t("progressOverviewDesc")}
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {view !== "list" && (
            <button className="secondary-action-btn" onClick={() => setView("list")}>
              ← {t("back")}
            </button>
          )}
          {view === "list" && (
            <button id="btn-create-course" className="primary-link-button" onClick={() => setView("create")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> {t("newCourse")}
            </button>
          )}
        </div>
      </header>

      {error && <div className="auth-error" style={{ marginBottom: "1.5rem" }}><AlertCircle size={16} /> {error}</div>}
      {success && <div className="auth-success" style={{ marginBottom: "1.5rem" }}><CheckCircle size={16} /> {success}</div>}

      {/* ── LIST VIEW ──────────────────────────────────────────────────────── */}
      {view === "list" && (
        <>
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
              <Loader2 className="spinner" size={32} style={{ margin: "0 auto 1rem" }} />
              <p>Loading courses…</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
              <GraduationCap size={48} style={{ color: "#cbd5e1", margin: "0 auto 1rem" }} />
              <h3 style={{ color: "#475569", marginBottom: "0.5rem" }}>No courses yet</h3>
              <p className="muted">Create your first course to start training your teachers.</p>
              <button className="primary-link-button" style={{ marginTop: "1.5rem", width: "auto" }}
                onClick={() => setView("create")}>
                <Plus size={16} /> Create Course
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map(c => (
                <div key={c.id} className="course-card card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div className="course-subject-badge" style={{ background: "var(--primary-light, #ede9fe)", color: "var(--primary)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
                      {c.subject}
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: STATUS_COLORS[c.status], background: `${STATUS_COLORS[c.status]}18`, padding: "4px 10px", borderRadius: "12px" }}>
                      {c.status}
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", color: "#1e293b", lineHeight: 1.3 }}>{c.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
                    {c.description || "No description provided."}
                  </p>
                  <div className="course-stats" style={{ display: "flex", gap: "1.25rem", marginBottom: "1.25rem" }}>
                    <div className="course-stat"><Layers size={14} /><span>{c.totalModules} {t("modules")}</span></div>
                    <div className="course-stat"><BookOpen size={14} /><span>{c.totalLessons} {t("lessons")}</span></div>
                    <div className="course-stat"><Users size={14} /><span>{c.assignedTeachers} {t("teachers")}</span></div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button className="secondary-action-btn" style={{ flex: 1 }} onClick={() => openDetail(c.id)}>
                      <Eye size={14} /> {t("view")}
                    </button>
                    {c.status === "DRAFT" && (
                      <button className="primary-link-button" style={{ flex: 1 }} onClick={() => handlePublish(c.id)}>
                        <Upload size={14} /> Publish
                      </button>
                    )}
                    <button className="secondary-action-btn" onClick={() => openProgress(c.id)} title="View progress">
                      <BarChart2 size={14} />
                    </button>
                    <button className="secondary-action-btn" onClick={() => handleDeleteCourse(c.id)} title="Delete course" 
                      style={{ borderColor: "#fee2e2", color: "#ef4444" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── CREATE VIEW ────────────────────────────────────────────────────── */}
      {view === "create" && (
        <form onSubmit={handleCreate} className="course-create-form">
          {/* Course meta */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="card-header"><div className="card-title">{t("courseInfo")}</div></div>
            <div className="form-row" style={{ marginTop: "1.5rem" }}>
              <label>{t("title")} *
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={t("titlePlaceholder")} />
              </label>
              <label>{t("subject")} *
                <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                  <option value="">{t("selectSubject")}</option>
                  {subjects.map(s => <option key={s.name} value={s.name}>{s.label}</option>)}
                </select>
              </label>
            </div>
            <label style={{ display: "block", marginTop: "1rem" }}>{t("description")}
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder={t("descriptionPlaceholder")}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "6px", fontFamily: "inherit", fontSize: "0.95rem", resize: "vertical" }} />
            </label>
          </div>

          {/* Modules */}
          {form.modules.map((mod, mi) => (
            <div key={mi} className="card module-builder" style={{ marginBottom: "1.25rem", border: "1.5px solid #e2e8f0" }}>
              <div className="card-header">
                <div className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Layers size={16} /> {t("module")} {mi + 1}
                </div>
                {form.modules.length > 1 && (
                  <button type="button" className="compact-btn" onClick={() => removeModule(mi)}><X size={14} /></button>
                )}
              </div>
              <div className="form-row" style={{ marginTop: "1.25rem" }}>
                <label>{t("moduleTitle")} *
                  <input required value={mod.title} onChange={e => updateModule(mi, "title", e.target.value)}
                    placeholder={t("titlePlaceholder")} />
                </label>
                <label>{t("moduleDesc")}
                  <input value={mod.description} onChange={e => updateModule(mi, "description", e.target.value)}
                    placeholder={t("descriptionPlaceholder")} />
                </label>
              </div>

              {/* Lessons */}
              {mod.lessons.map((les, li) => (
                <div key={li} className="lesson-builder" style={{ background: "#f8fafc", borderRadius: "10px", padding: "1rem", marginTop: "1rem", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                      {LESSON_TYPE_ICONS[les.type]} {t("lesson")} {li + 1}
                    </span>
                    {mod.lessons.length > 1 && (
                      <button type="button" className="compact-btn" onClick={() => removeLesson(mi, li)}><X size={12} /></button>
                    )}
                  </div>
                  <div className="form-row">
                    <label>{t("lessonTitle")} *
                      <input required value={les.title} onChange={e => updateLesson(mi, li, "title", e.target.value)}
                        placeholder={t("titlePlaceholder")} />
                    </label>
                    <label>{t("type")}
                      <select value={les.type} onChange={e => updateLesson(mi, li, "type", e.target.value)}>
                        <option value="VIDEO">Video</option>
                        <option value="PDF">PDF</option>
                        <option value="QUIZ">Quiz</option>
                      </select>
                    </label>
                  </div>
                  <div className="form-row">
                    <label>{les.type === 'QUIZ' ? t("selectQuiz") : t("contentUrl")}
                      {les.type === 'QUIZ' ? (
                        <select 
                          required 
                          value={les.contentUrl} 
                          onChange={e => updateLesson(mi, li, "contentUrl", e.target.value)}
                        >
                          <option value="">{t("chooseQuiz")}</option>
                          {quizzes.map(q => (
                            <option key={q.id} value={`quiz:${q.id}`}>{q.title}</option>
                          ))}
                        </select>
                      ) : (
                        <input value={les.contentUrl} onChange={e => updateLesson(mi, li, "contentUrl", e.target.value)}
                          placeholder="https://…" />
                      )}
                    </label>
                    <label>{t("duration")}
                      <input type="number" min={0} value={les.durationMinutes}
                        onChange={e => updateLesson(mi, li, "durationMinutes", e.target.value)}
                        placeholder="e.g. 15" />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>Lesson Description
                      <input value={les.description} onChange={e => updateLesson(mi, li, "description", e.target.value)}
                        placeholder="Brief explanation of the lesson content" />
                    </label>
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => addLesson(mi)}
                style={{ marginTop: "0.75rem", background: "none", border: "1.5px dashed #cbd5e1", color: "#64748b", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Plus size={14} /> Add Lesson
              </button>
            </div>
          ))}

          <button type="button" onClick={addModule}
            style={{ marginBottom: "1.5rem", background: "none", border: "2px dashed #a78bfa", color: "#7c3aed", padding: "12px", borderRadius: "10px", cursor: "pointer", fontSize: "0.9rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 600 }}>
            <Plus size={16} /> Add Module
          </button>

          <div className="form-actions">
            <button type="submit" className="primary-link-button" disabled={loading}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {loading ? <><Loader2 className="spinner" size={16} /> Saving…</> : <><BookOpen size={16} /> {t("createCourse")}</>}
            </button>
            <button type="button" className="secondary-action-btn" onClick={() => setView("list")}>{t("reset")}</button>
          </div>
        </form>
      )}

      {/* ── DETAIL VIEW ────────────────────────────────────────────────────── */}
      {view === "detail" && selectedCourse && (
        <div>
          {/* Stats bar */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {[
              { label: "Status", value: selectedCourse.status, color: STATUS_COLORS[selectedCourse.status] },
              { label: "Modules", value: selectedCourse.totalModules },
              { label: "Lessons", value: selectedCourse.totalLessons },
              { label: "Teachers", value: selectedCourse.assignedTeachers },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ flex: "1 1 140px", padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: stat.color || "var(--primary)" }}>{stat.value}</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>{t(stat.label.toLowerCase())}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {selectedCourse.status === "DRAFT" && (
            <button className="primary-link-button" onClick={() => handlePublish(selectedCourse.id)}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Upload size={16} /> {t("publishCourse")}
              </button>
            )}
            <button className="secondary-action-btn" onClick={() => openProgress(selectedCourse.id)}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BarChart2 size={16} /> {t("progressOverview")}
            </button>
            <button className="secondary-action-btn" onClick={() => setShowAddModule(!showAddModule)}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> {t("addModule")}
            </button>
          </div>

          {/* Add Module Inline Form */}
          {showAddModule && (
            <div className="card animate-in" style={{ marginBottom: "1.5rem", border: "1.5px solid #a78bfa" }}>
              <div className="card-title" style={{ marginBottom: "1rem" }}>{t("newModule")}</div>
                <div className="form-row">
                  <label>Title<input required value={newModule.title} onChange={e => setNewModule(m => ({ ...m, title: e.target.value }))} placeholder="Module title" /></label>
                  <label>Description<input value={newModule.description} onChange={e => setNewModule(m => ({ ...m, description: e.target.value }))} placeholder="Optional" /></label>
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#64748b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <PlayCircle size={16} /> Module Lessons
                  </div>
                  
                  {newModule.lessons.map((les, li) => (
                    <div key={li} style={{ background: "#f8fafc", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>Lesson {li + 1}</span>
                        {newModule.lessons.length > 1 && (
                          <button type="button" className="compact-btn" onClick={() => removeLessonFromNewModule(li)}><X size={12} /></button>
                        )}
                      </div>
                      <div className="form-row">
                        <label>Title *<input required value={les.title} onChange={e => updateLessonInNewModule(li, "title", e.target.value)} /></label>
                        <label>Type
                          <select value={les.type} onChange={e => updateLessonInNewModule(li, "type", e.target.value)}>
                            <option value="VIDEO">Video</option>
                            <option value="PDF">PDF</option>
                            <option value="QUIZ">Quiz</option>
                          </select>
                        </label>
                      </div>
                      <div className="form-row">
                        <label>{les.type === 'QUIZ' ? 'Select Quiz' : 'Content URL'}
                          {les.type === 'QUIZ' ? (
                            <select 
                              required 
                              value={les.contentUrl} 
                              onChange={e => updateLessonInNewModule(li, "contentUrl", e.target.value)}
                            >
                              <option value="">Choose a quiz...</option>
                              {quizzes.map(q => (
                                <option key={q.id} value={`quiz:${q.id}`}>{q.title}</option>
                              ))}
                            </select>
                          ) : (
                            <input value={les.contentUrl} onChange={e => updateLessonInNewModule(li, "contentUrl", e.target.value)} placeholder="https://..." />
                          )}
                        </label>
                        <label>Duration (min)<input type="number" value={les.durationMinutes} onChange={e => updateLessonInNewModule(li, "durationMinutes", e.target.value)} placeholder="e.g. 15" /></label>
                      </div>
                      <div className="form-row">
                        <label>Lesson Description<input value={les.description} onChange={e => updateLessonInNewModule(li, "description", e.target.value)} placeholder="Brief explanation of the lesson content" /></label>
                      </div>
                    </div>
                  ))}
                  
                  <button type="button" onClick={addLessonToNewModule}
                    style={{ background: "none", border: "1.5px dashed #cbd5e1", color: "#64748b", padding: "8px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <Plus size={14} /> Add Lesson to Module
                  </button>
                </div>

                <div className="form-actions" style={{ marginTop: "2rem" }}>
                  <button className="primary-link-button" onClick={handleAddModule} disabled={loading}>
                    {loading ? <><Loader2 className="spinner" size={14} /> Saving…</> : <><Plus size={14} /> Create Module</>}
                  </button>
                  <button className="secondary-action-btn" onClick={() => setShowAddModule(false)}>Cancel</button>
                </div>
            </div>
          )}

          {/* Modules & Lessons */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
            <div className="course-content-col">
              {(selectedCourse.modules || []).map((mod, mi) => (
                <div key={mod.id} className="card" style={{ marginBottom: "1rem" }}>
                  <div className="card-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Layers size={16} style={{ color: "var(--primary)" }} />
                      <div className="card-title">{mod.title}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{mod.lessons?.length || 0} lessons</span>
                      <button className="compact-btn" onClick={() => handleDeleteModule(mod.id)} title="Delete module"
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {(mod.lessons || []).map((les) => (
                    <div key={les.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0.75rem 0", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ color: "#7c3aed", flexShrink: 0 }}>{LESSON_TYPE_ICONS[les.type]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>{les.title}</div>
                        {les.durationMinutes && <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{les.durationMinutes} min</div>}
                      </div>
                      <span style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "3px 10px", borderRadius: "10px", color: "#64748b" }}>{les.type}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="course-assignment-col">
              <div className="card">
                <div className="card-header"><div className="card-title"><Users size={16} /> Teachers</div></div>
                <div style={{ marginTop: "1rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem", display: "block" }}>Assign New Teacher</label>
                  <select 
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    onChange={(e) => e.target.value && handleAssign(selectedCourse.id, e.target.value)}
                    value=""
                  >
                    <option value="">Choose teacher...</option>
                    {teachers.map(t => (
                      <option key={t.userId || t.id} value={t.userId}>{t.firstName} {t.lastName}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ marginTop: "1.5rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.75rem" }}>Assigned ({selectedCourse.assignedTeachers || 0})</div>
                  {/* Note: The backend should ideally return the list of assigned teachers in the CourseResponse detail */}
                  {/* For now we show the count, and we can add the list if the API supports it */}
                  <p className="muted" style={{ fontSize: "0.8rem" }}>
                    Manage assignments from the <span style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }} onClick={() => openProgress(selectedCourse.id)}>Progress View</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROGRESS VIEW ──────────────────────────────────────────────────── */}
      {view === "progress" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">{t("teacherProgress")}</div>
          </div>
          {progressData.length === 0 ? (
            <p className="muted" style={{ marginTop: "1rem" }}>No teachers assigned to this course yet.</p>
          ) : (
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {progressData.map((t, i) => (
                <div key={i} style={{ padding: "1rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e293b" }}>{t.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{t.description}</div>
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: t.progressPercent === 100 ? "#10b981" : "var(--primary)" }}>
                      {t.progressPercent}%
                    </div>
                  </div>
                  <div style={{ background: "#e2e8f0", borderRadius: "100px", height: "8px", overflow: "hidden" }}>
                    <div style={{
                      width: `${t.progressPercent}%`, height: "100%", borderRadius: "100px",
                      background: t.progressPercent === 100
                        ? "linear-gradient(90deg,#10b981,#34d399)"
                        : "linear-gradient(90deg,var(--primary),#a78bfa)",
                      transition: "width 0.6s ease"
                    }} />
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                    {t.completedLessons} / {t.totalLessons} lessons completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .course-card { transition: transform 0.2s, box-shadow 0.2s; }
        .course-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(124,58,237,0.12); }
        .course-stat { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: #64748b; }
        .module-builder { border-left: 4px solid var(--primary, #7c3aed) !important; }
        .animate-in { animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .form-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}
