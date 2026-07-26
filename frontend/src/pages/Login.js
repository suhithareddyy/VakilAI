import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-decoration" />

      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <div className="brand-icon">⚖️</div>
            <div className="brand-name">Vakil<span>AI</span></div>
          </div>
          <h1 className="auth-headline">
            Your personal<br /><em>Indian Legal Advisor</em>
          </h1>
          <p className="auth-subtext">
            Get instant, accurate guidance on Indian laws — consumer rights, property, labor, cyber law, and more. Powered by AI with context memory.
          </p>
        </div>

        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon">🧠</div>
            <div className="auth-feature-text">
              <h4>Context-Aware AI</h4>
              <p>Remembers your conversation for follow-up questions</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">📚</div>
            <div className="auth-feature-text">
              <h4>Comprehensive Indian Law Coverage</h4>
              <p>BNS, BNSS, Consumer Act, RERA, IT Act & more</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">🔒</div>
            <div className="auth-feature-text">
              <h4>Secure & Confidential</h4>
              <p>Your legal queries are encrypted and private</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-subtitle">Sign in to your legal advisor account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one free</Link>
          </div>

          <div style={{ marginTop: 24, padding: '12px', background: 'rgba(201, 169, 110, 0.08)', borderRadius: 8, border: '1px solid rgba(201, 169, 110, 0.2)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              ⚖️ <em>This platform provides legal information only, not formal legal advice. Consult a qualified advocate for specific legal matters.</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
