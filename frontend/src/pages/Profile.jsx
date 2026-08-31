// src/pages/Profile.jsx

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';

export default function Profile() {
  const { token, user, isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState(user);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .getProfile(token)
      .then((data) => {
        setProfile(data);
        setError(null);
      })
      .catch((err) => {
        if (err.status === 401) {
          // Token expired/invalid — clear it out and bounce to login.
          logout();
        } else {
          setError(err.message || 'Failed to load your profile.');
        }
      })
      .finally(() => setLoading(false));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="auth-page">
      <div className="card profile-card">
        <div className="card__perforation" aria-hidden="true" />
        <div className="card__id">Library Card</div>

        {loading && <p className="state-block">Loading your profile…</p>}

        {!loading && <h2 className="card__title">{profile?.name}</h2>}

        {error && <p className="form-error">{error}</p>}

        {!loading && profile && (
          <dl className="card__facts card__facts--stacked">
            <div>
              <dt>Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>
                <span className={`role-pill role-pill--${profile.role}`}>{profile.role}</span>
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
