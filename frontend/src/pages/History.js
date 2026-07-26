import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

const CATEGORY_ICONS = {
  consumer_rights: '🛒', property_law: '🏠', labor_law: '👷',
  cyber_law: '💻', constitutional_rights: '⚖️', criminal_law: '🚔',
  family_law: '👨‍👩‍👧', tax_law: '💰', general: '📋'
};

const CATEGORY_BADGE = {
  consumer_rights: 'badge-consumer', property_law: 'badge-property',
  labor_law: 'badge-labor', cyber_law: 'badge-cyber',
  constitutional_rights: 'badge-constitutional', criminal_law: 'badge-criminal',
  family_law: 'badge-family', general: 'badge-general'
};

const CATEGORY_LABELS = {
  consumer_rights: 'Consumer Rights', property_law: 'Property Law',
  labor_law: 'Labor Law', cyber_law: 'Cyber Law',
  constitutional_rights: 'Constitutional Rights', criminal_law: 'Criminal Law',
  family_law: 'Family Law', general: 'General'
};

const ALL_CATEGORIES = ['all', 'consumer_rights', 'property_law', 'labor_law', 'cyber_law', 'constitutional_rights', 'criminal_law', 'family_law', 'general'];

export default function History() {
  const [conversations, setConversations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  useEffect(() => {
    fetchHistory();
  }, [page]);

  useEffect(() => {
    applyFilters();
  }, [conversations, filter, search]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/chat/conversations?page=${page}&limit=${LIMIT}`);
      setConversations(res.data.conversations || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...conversations];
    if (filter !== 'all') result = result.filter(c => c.legalCategory === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => c.title?.toLowerCase().includes(q));
    }
    setFiltered(result);
  };

  const handleDelete = async (e, convId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axios.delete(`/chat/conversations/${convId}`);
      setConversations(prev => prev.filter(c => c._id !== convId));
      toast.success('Consultation deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const getLastMessage = (conv) => {
    if (!conv.lastMessage) return 'No messages yet';
    const content = conv.lastMessage.content || '';
    return content.substring(0, 100) + (content.length > 100 ? '...' : '');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="history-page">

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: "'Crimson Pro', serif", fontSize: 30, fontWeight: 600, color: 'var(--text-primary)' }}>
                Case History
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
                {total} total consultation{total !== 1 ? 's' : ''}
              </p>
            </div>
            <Link to="/chat" className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: 14 }}>
              + New Consultation
            </Link>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search consultations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ maxWidth: 260, marginBottom: 0 }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: '1px solid',
                    borderColor: filter === cat ? 'var(--accent-gold)' : 'var(--border-color)',
                    background: filter === cat ? 'rgba(201, 169, 110, 0.12)' : 'transparent',
                    color: filter === cat ? 'var(--accent-gold)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s'
                  }}
                >
                  {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📁</div>
              <div className="empty-state-title">
                {search || filter !== 'all' ? 'No matching consultations' : 'No consultations yet'}
              </div>
              <div className="empty-state-text">
                {search || filter !== 'all'
                  ? 'Try different search terms or filters'
                  : 'Start a new consultation to see your history here'
                }
              </div>
              {!search && filter === 'all' && (
                <Link to="/chat" className="btn btn-primary" style={{ width: 'auto', marginTop: 16, padding: '10px 24px' }}>
                  Start First Consultation →
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="history-grid">
                {filtered.map(conv => (
                  <Link
                    to={`/chat/${conv._id}`}
                    key={conv._id}
                    className="history-card"
                  >
                    <div className="history-card-header">
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ fontSize: 24, flexShrink: 0 }}>
                          {CATEGORY_ICONS[conv.legalCategory] || '📋'}
                        </span>
                        <div className="history-card-title">{conv.title || 'Legal Consultation'}</div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, conv._id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-muted)', fontSize: 16, padding: '0 4px',
                          flexShrink: 0, transition: 'color 0.2s'
                        }}
                        title="Delete consultation"
                        onMouseEnter={e => e.target.style.color = 'var(--accent-crimson)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                      >
                        🗑
                      </button>
                    </div>

                    <div className="history-card-preview">
                      {getLastMessage(conv)}
                    </div>

                    <div className="history-card-footer">
                      <span className={`category-badge ${CATEGORY_BADGE[conv.legalCategory] || 'badge-general'}`}>
                        {CATEGORY_LABELS[conv.legalCategory] || 'General'}
                      </span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span>{conv.messageCount || 0} msgs</span>
                        <span>·</span>
                        <span title={format(new Date(conv.updatedAt), 'PPpp')}>
                          {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {total > LIMIT && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-ghost"
                  >
                    ← Previous
                  </button>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, display: 'flex', alignItems: 'center' }}>
                    Page {page} of {Math.ceil(total / LIMIT)}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(total / LIMIT)}
                    className="btn btn-ghost"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
