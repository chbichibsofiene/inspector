import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSendCode(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await forgotPassword({ email });
      setMessage("If an account exists, a reset code has been sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword({ email, code, newPassword });
      setMessage("Password reset successful! You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid code or failed reset");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="login-logo-container">
          <img src="/logo.png" alt="Logo" className="login-logo" />
          <h1>Pedagogical Center</h1>
        </div>
        
        <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
        
        {message && <div className="auth-success" style={{color: 'green', marginBottom: '15px', textAlign: 'center'}}>{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="auth-form">
            <p style={{fontSize: '14px', color: '#666', marginBottom: '15px', textAlign: 'center'}}>
              Enter your email address and we'll send you a 6-digit code to reset your password.
            </p>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
            <div className="auth-footer" style={{marginTop: '15px'}}>
              <a href="/login">Back to Login</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            <p style={{fontSize: '14px', color: '#666', marginBottom: '15px', textAlign: 'center'}}>
              Please enter the 6-digit code sent to your email and your new password.
            </p>
            <label>
              Verification Code
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                placeholder="6-digit code"
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
