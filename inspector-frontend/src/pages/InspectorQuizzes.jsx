import { useState, useEffect } from "react";
import { generateQuiz, saveQuiz, getInspectorQuizzes } from "../api/quizzes";
import profileApi from "../api/profile";
import { Brain, Plus, Loader2, CheckCircle, AlertCircle, Save, X, BookOpen, Trash } from "lucide-react";

export default function InspectorQuizzes() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [expandedQuizId, setExpandedQuizId] = useState(null);

  useEffect(() => {
    profileApi.getSubjects().then(res => setSubjects(res.data?.data || []));
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const res = await getInspectorQuizzes();
      setRecentQuizzes(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  async function handleGenerate(e) {
    e.preventDefault();
    if (!topic || !subject) return;
    
    setLoading(true);
    setError("");
    setGeneratedQuestions(null);
    
    try {
      const res = await generateQuiz(topic, subject);
      setGeneratedQuestions(res.data?.data || []);
    } catch (err) {
      setError("Failed to generate quiz. Is the Gemini API Key configured?");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!generatedQuestions) return;
    setLoading(true);
    try {
      await saveQuiz({
        title: `${subject} Quiz: ${topic}`,
        topic,
        subject,
        questions: generatedQuestions
      });
      setSuccess("Quiz published to all related teachers!");
      setGeneratedQuestions(null);
      setTopic("");
      loadQuizzes();
    } catch (err) {
      setError("Failed to publish quiz.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inspector-quizzes-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">AI Quiz Center</h1>
          <p className="page-subtitle">Generate subject-specific quizzes and evaluate teacher performance automatically.</p>
        </div>
        <div className="pill secondary">
          <Brain size={16} /> <strong>Gemini Pro Powered</strong>
        </div>
      </header>

      {error && <div className="auth-error" style={{ marginBottom: '2rem' }}><AlertCircle size={18} /> {error}</div>}
      {success && <div className="auth-success" style={{ marginBottom: '2rem' }}><CheckCircle size={18} /> {success}</div>}

      <div className="quiz-generator-section card">
        <div className="card-header">
          <div className="card-title">New AI Quiz</div>
        </div>
        
        <form onSubmit={handleGenerate} className="activity-form">
          <div className="form-row">
            <label>
              Subject Context
              <select value={subject} onChange={e => setSubject(e.target.value)} required>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.name} value={s.name}>{s.label}</option>)}
              </select>
            </label>
            <label>
              Topic / Theme
              <input 
                type="text" 
                placeholder="e.g. Modern Physics, French Grammar, etc." 
                value={topic} 
                onChange={e => setTopic(e.target.value)} 
                required 
              />
            </label>
          </div>
          
          <button type="submit" disabled={loading} className="primary-link-button" style={{ width: 'auto', marginTop: '1rem' }}>
            {loading ? <><Loader2 className="spinner" size={16} /> Generating...</> : <><Brain size={16} /> Generate Questions</>}
          </button>
        </form>
      </div>

      {generatedQuestions && (
        <div className="review-questions card animate-in" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <div className="card-title">Review AI Suggestions</div>
            <button className="compact-btn" onClick={() => setGeneratedQuestions(null)}><X size={16} /></button>
          </div>

          <div className="questions-list" style={{ marginTop: '1.5rem' }}>
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="question-preview-item">
                <div className="q-label">Question {idx + 1} <span>{q.type}</span></div>
                <p><strong>{q.text}</strong></p>
                {q.options && (
                  <ul className="options-preview">
                    {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                  </ul>
                )}
                <div className="correct-answer-hint">
                  <CheckCircle size={14} /> {q.correctAnswer}
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button className="primary-link-button" onClick={handlePublish}>
              <Save size={16} /> Publish to My Teachers
            </button>
            <button className="secondary-action-btn" onClick={() => setGeneratedQuestions(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {recentQuizzes.length > 0 && (
        <div className="recent-quizzes-section card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <div className="card-title">Recent Quizzes</div>
          </div>
          
          <div className="recent-quizzes-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentQuizzes.map(quiz => (
              <div key={quiz.id} className="recent-quiz-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={`recent-quiz-item ${expandedQuizId === quiz.id ? 'expanded' : ''}`} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: expandedQuizId === quiz.id ? '12px 12px 0 0' : '12px',
                  border: '1px solid #e2e8f0'
                }}>
                <div className="quiz-info">
                  <h4 style={{ margin: '0 0 4px', color: '#1e293b' }}>{quiz.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '12px' }}>
                    <span>Subject: {quiz.subject}</span>
                    <span>Topic: {quiz.topic}</span>
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="secondary-action-btn"
                    onClick={() => setExpandedQuizId(expandedQuizId === quiz.id ? null : quiz.id)}
                  >
                    <BookOpen size={16} /> {expandedQuizId === quiz.id ? "Hide Details" : "View Details"}
                  </button>
                  <button 
                    className="primary-action-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => {
                      setSubject(quiz.subject);
                      setTopic(quiz.topic);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Plus size={16} /> Reuse Topic
                  </button>
                </div>
              </div>

              {expandedQuizId === quiz.id && quiz.questions && (
                <div className="quiz-details-tray animate-in" style={{ 
                  marginTop: '-1rem', 
                  marginBottom: '1rem',
                  padding: '1.5rem', 
                  background: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderTop: 'none', 
                  borderBottomLeftRadius: '12px', 
                  borderBottomRightRadius: '12px' 
                }}>
                  <div className="questions-list">
                    {quiz.questions.map((q, idx) => (
                      <div key={idx} className="question-preview-item" style={{ background: '#f8fafc', marginBottom: idx === quiz.questions.length - 1 ? 0 : '1rem' }}>
                        <div className="q-label">Question {idx + 1} <span>{q.type}</span></div>
                        <p><strong>{q.text}</strong></p>
                        {q.options && q.options.length > 0 && (
                          <ul className="options-preview">
                            {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                          </ul>
                        )}
                        {q.correctAnswer && (
                          <div className="correct-answer-hint">
                            <CheckCircle size={14} /> {q.correctAnswer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .question-preview-item {
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 1rem;
          border: 1px solid #e2e8f0;
        }
        .q-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
        }
        .q-label span {
          background: #e2e8f0;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .options-preview {
          margin: 10px 0;
          padding-left: 20px;
          color: #475569;
          font-size: 0.9rem;
        }
        .correct-answer-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #10b981;
          font-weight: 700;
          margin-top: 10px;
        }
        .animate-in {
          animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
