import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const CATEGORY_ICONS = {
  consumer_rights: '🛒',
  property_law: '🏠',
  labor_law: '👷',
  cyber_law: '💻',
  constitutional_rights: '⚖️',
  criminal_law: '🚔',
  family_law: '👨‍👩‍👧',
  tax_law: '💰',
  general: '📋'
};

const CATEGORY_BADGE = {
  consumer_rights: 'badge-consumer',
  property_law: 'badge-property',
  labor_law: 'badge-labor',
  cyber_law: 'badge-cyber',
  constitutional_rights: 'badge-constitutional',
  criminal_law: 'badge-criminal',
  family_law: 'badge-family',
  general: 'badge-general'
};

export default function Sidebar({ onNewChat }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchConversations();
    setIsOpen(false);
  }, [location.pathname]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/chat/conversations');
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      navigate('/chat');
      if (onNewChat) onNewChat();
    } catch (err) {
      toast.error('Failed to start new chat');
    }
  };

  const toggleSidebar = () => setIsOpen(o => !o);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const getUserInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <>
      <button
        className="sidebar-hamburger"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-brand">
          <div className="sidebar-brand-icon">⚖️</div>
          <span className="sidebar-brand-text">Vakil<span>AI</span></span>
        </Link>
        <button className="btn-new-chat" onClick={handleNewChat}>
          <span>+</span> New Consultation
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <span className="nav-item-icon">🏛️</span>
          Dashboard
        </Link>
        <Link to="/chat" className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}>
          <span className="nav-item-icon">💬</span>
          Ask a Question
        </Link>
        <Link to="/history" className={`nav-item ${location.pathname === '/history' ? 'active' : ''}`}>
          <span className="nav-item-icon">📁</span>
          Case History
        </Link>
        <Link to="/legal-aid" className={`nav-item ${location.pathname === '/legal-aid' ? 'active' : ''}`}>
          <span className="nav-item-icon">🆘</span>
          Legal Aid
        </Link>
        <Link to="/templates" className={`nav-item ${location.pathname === '/templates' ? 'active' : ''}`}>
          <span className="nav-item-icon">📝</span>
          Templates
        </Link>
      </nav>

      <div className="sidebar-history">
        <div className="sidebar-history-title">Recent Consultations</div>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Loading...
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: '16px 8px', color: 'var(--text-muted)', fontSize: 13 }}>
            No consultations yet. Start a new one!
          </div>
        ) : (
          conversations.map(conv => (
            <Link
              to={`/chat/${conv._id}`}
              key={conv._id}
              className={`history-item ${conversationId === conv._id ? 'active' : ''}`}
            >
              <span className="history-item-icon">
                {CATEGORY_ICONS[conv.legalCategory] || '📋'}
              </span>
              <div className="history-item-content">
                <div className="history-item-title">{conv.title || 'Legal Consultation'}</div>
                <div className="history-item-meta">
                  <span className={`category-badge ${CATEGORY_BADGE[conv.legalCategory] || 'badge-general'}`}>
                    {conv.legalCategory?.replace('_', ' ') || 'General'}
                  </span>
                  {' · '}
                  {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{getUserInitials(user?.name)}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">Legal Client</div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            ↩
          </button>
        </div>
      </div>
      </aside>
    </>
  );
}
