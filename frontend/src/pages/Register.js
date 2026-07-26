import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Jammu & Kashmir', 'Ladakh'
];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', state: '', preferredLanguage: 'english'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name, email: form.email, password: form.password,
        phone: form.phone, state: form.state, preferredLanguage: form.preferredLanguage
      });
      toast.success('Account created! Welcome to VakilAI.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
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
            Join thousands of<br /><em>empowered citizens</em>
          </h1>
          <p className="auth-subtext">
            Understand your legal rights without expensive consultations. VakilAI gives you instant guidance on Indian laws in plain, simple language.
          </p>
        </div>

        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon">⚡</div>
            <div className="auth-feature-text">
              <h4>Instant Answers</h4>
              <p>Get legal guidance in seconds, not days</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">🇮🇳</div>
            <div className="auth-feature-text">
              <h4>India-Specific Laws</h4>
              <p>BNS 2023, RERA, IT Act, Consumer Act & all state laws</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">💬</div>
            <div className="auth-feature-text">
              <h4>Memory & Context</h4>
              <p>Ask follow-up questions naturally, like with a real advisor</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="auth-form-title">Create account</h2>
          <p className="auth-form-subtitle">Start your free legal advisory account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Arjun Sharma"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Min. 6 chars"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <select
                  name="state"
                  className="form-select"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Language</label>
              <select
                name="preferredLanguage"
                className="form-select"
                value={form.preferredLanguage}
                onChange={handleChange}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Free Account →'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
