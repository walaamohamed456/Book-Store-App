// src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const justRegistered = location.state?.justRegistered;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await api.login(form);
      login(result.token, result.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="book-form" onSubmit={handleSubmit}>
        <h2 className="book-form__title">Log in</h2>

        {justRegistered && (
          <p className="auth-notice">Registration successful — please log in.</p>
        )}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="book-form__actions">
          <button type="submit" className="btn btn--stamp" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </div>

        <p className="auth-switch">
          No card yet? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
