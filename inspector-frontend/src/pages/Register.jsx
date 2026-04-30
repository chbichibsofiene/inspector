import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serialCode, setSerialCode] = useState("");
  const [cin, setCin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await register({ email, password, serialCode, cin });
      const msg =
        res.data?.message ||
        "Registration successful! Your account is automatically enabled.";
      setSuccess(msg);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Validation errors come back as data: { field: "message", ... }
      const validationErrors = err?.response?.data?.data;
      if (validationErrors && typeof validationErrors === "object") {
        const msgs = Object.entries(validationErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(" | ");
        setError(msgs);
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Registration failed: Please check your network or try again later.";
        setError(msg);
      }
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
        <h2>Request an account</h2>

        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="auth-error" style={{ backgroundColor: "#ecfdf3", color: "#166534", borderColor: "#bbf7d0" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Serial code
            <input
              type="text"
              value={serialCode}
              onChange={(e) => setSerialCode(e.target.value)}
              required
            />
          </label>

          <label>
            National Identity Number (CIN)
            <input
              type="text"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
              placeholder="8 digits"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px", display: "block" }}>
              Minimum 8 characters
            </span>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit request"}
          </button>
        </form>
      </div>
    </div>
  );
}

