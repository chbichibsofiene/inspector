import { useState, useEffect } from "react";
import { getTeacherQuizzes, submitQuiz } from "../api/quizzes";
import { Brain, Clock, ChevronRight, CheckCircle, AlertCircle, Loader2, BookOpen } from "lucide-react";

export default function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  async function loadQuizzes() {
    try {
      const res = await getTeacherQuizzes();
      setQuizzes(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function startQuiz(quiz) {
    setActiveQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitQuiz(activeQuiz.id, answers);
      setSubmitted(true);
    } catch (err) {
      alert("Submission failed. You may have already submitted this quiz.");
    } finally {
      setSubmitting(false);
    }
  }

  if (activeQuiz) {
    return (
      <div className="quiz-session-container">
        <div className="quiz-header card">
          <button className="back-link" onClick={() => { setActiveQuiz(null); loadQuizzes(); }}>← Back to Quizzes</button>
          <h2>{activeQuiz.title}</h2>
          <p className="muted">{activeQuiz.topic}</p>
        </div>

        {submitted ? (
          <div className="evaluation-result card animate-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ 
              width: '80px', height: '80px', background: '#f0fdf4', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 1.5rem' 
            }}>
              <CheckCircle size={40} color="#10b981" />
            </div>
            <h2 style={{ margin: '0 0 0.75rem', color: '#1e293b' }}>Quiz Submitted!</h2>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Your answers have been recorded. Your inspector will review your performance and may provide feedback.
            </p>
            <button className="primary-link-button" onClick={() => { setActiveQuiz(null); loadQuizzes(); }}>
              Return to Quizzes
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="quiz-form card animate-in">
            {activeQuiz.questions.map((q, idx) => (
              <div key={q.id} className="quiz-question-item">
                <div className="q-head">Question {idx + 1}</div>
                <p className="q-text">{q.text}</p>
                
                {q.type === 'MCQ' ? (
                  <div className="mcq-options">
                    {q.options.map(opt => (
                      <label key={opt} className={`mcq-option ${answers[q.id] === opt ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name={`q-${q.id}`} 
                          value={opt} 
                          checked={answers[q.id] === opt} 
                          onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} 
                          required
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea 
                    className="free-text-area" 
                    placeholder="Type your pedagogical response here..."
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                    required
                  />
                )}
              </div>
            ))}

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button type="submit" className="primary-link-button" disabled={submitting}>
                {submitting ? <><Loader2 className="spinner" size={16} /> Submitting Quiz...</> : "Submit Quiz"}
              </button>
            </div>
          </form>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          .quiz-session-container { max-width: 800px; margin: 0 auto; color: #1e293b; }
          .back-link { background: none; border: none; color: #3b82f6; cursor: pointer; font-weight: 700; margin-bottom: 1rem; }
          .quiz-header { margin-bottom: 2rem; }
          .quiz-header h2 { margin: 0 0 0.5rem; }
          .quiz-question-item { margin-bottom: 2.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 2rem; }
          .q-head { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 1rem; }
          .q-text { font-size: 1.15rem; font-weight: 600; margin-bottom: 1.5rem; }
          .mcq-options { display: grid; gap: 10px; }
          .mcq-option { 
            padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; 
            transition: all 0.2s; display: flex; gap: 12px; align-items: center; 
          }
          .mcq-option:hover { background: #f8fafc; border-color: #3b82f6; }
          .mcq-option.selected { background: #eff6ff; border-color: #3b82f6; color: #3b82f6; }
          .free-text-area { width: 100%; min-height: 120px; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 1rem; }
          
          .score-hero { display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem; }
          .score-circle { 
            width: 120px; height: 120px; border-radius: 50%; border: 8px solid #3b82f6; 
            display: flex; flex-direction: column; align-items: center; justify-content: center; 
          }
          .score-circle strong { font-size: 2.5rem; }
          .score-circle span { font-size: 0.9rem; color: #64748b; }
          .training-suggestion { background: #f0fdf4; border: 1px solid #bbf7d0; margin-top: 2rem; }
          .training-suggestion h4 { display: flex; align-items: center; gap: 8px; color: #16a34a; margin-top: 0; }
        `}} />
      </div>
    );
  }

  return (
    <div className="teacher-quizzes-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Assigned Quizzes</h1>
          <p className="page-subtitle">Complete your assigned quizzes. Your inspector will review your performance.</p>
        </div>
      </header>

      {loading ? (
        <div className="loading-state"><div className="spinner"></div></div>
      ) : (
        <div className="quizzes-grid">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-card card">
              <div className="quiz-info">
                <h3>{quiz.title}</h3>
                <p className="muted">{quiz.topic}</p>
                <div className="quiz-meta">
                  <span className="meta-tag"><BookOpen size={14} /> {quiz.questions.length} Questions</span>
                  <span className="meta-tag"><Clock size={14} /> 15-20 Min</span>
                </div>
              </div>
              <button className="primary-link-button" onClick={() => startQuiz(quiz)}>
                Take Quiz <ChevronRight size={16} />
              </button>
            </div>
          ))}

          {quizzes.length === 0 && (
            <div className="empty-state card">
              <CheckCircle size={48} color="#10b981" />
              <h3>All caught up!</h3>
              <p>Your inspector hasn't published any quizzes for your subject yet.</p>
            </div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .quizzes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
        .quiz-card { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
        .quiz-card h3 { margin: 0 0 0.5rem; }
        .quiz-meta { display: flex; gap: 1rem; margin: 1rem 0 1.5rem; }
        .meta-tag { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #64748b; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }
        .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: #64748b; }
      `}} />
    </div>
  );
}
