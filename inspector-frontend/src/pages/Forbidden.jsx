import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h1>403 – Forbidden</h1>
        <h2>You do not have permission to access this page.</h2>
        <p className="auth-footer">
          You can switch account or go back to the login screen.
        </p>
        <Link to="/login">
          <button type="button">Back to login</button>
        </Link>
      </div>
    </div>
  );
}
