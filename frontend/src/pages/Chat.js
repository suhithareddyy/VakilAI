import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { exportConversationToPdf } from '../utils/pdfExport';

const QUICK_TOPICS = [
  { emoji: '🛒', text: 'Consumer Rights', query: 'What are my consumer rights in India under Consumer Protection Act 2019?' },
  { emoji: '🏠', text: 'Property Law', query: 'What are the laws for property registration and sale deed in India?' },
  { emoji: '👷', text: 'Labor Rights', query: 'What are my rights as an employee regarding salary, PF and termination?' },
  { emoji: '💻', text: 'Cyber Law', query: 'What are cyber crime laws in India and how do I report online fraud?' },
  { emoji: '⚖️', text: 'Fundamental Rights', query: 'What are the fundamental rights guaranteed to Indian citizens by the Constitution?' },
  { emoji: '👨‍👩‍👧', text: 'Family Law', query: 'What are the laws regarding divorce and maintenance in India?' },
];

const CATEGORY_ICONS = {
  consumer_rights: '🛒', property_law: '🏠', labor_law: '👷',
  cyber_law: '💻', constitutional_rights: '⚖️', criminal_law: '🚔',
  family_law: '👨‍👩‍👧', general: '📋'
};

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConv, setLoadingConv] = useState(false);
  const [currentConvId, setCurrentConvId] = useState(conversationId || null);
  const [convTitle, setConvTitle] = useState('New Legal Consultation');
  const [legalCategory, setLegalCategory] = useState('general');
  const [attachedFile, setAttachedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const sidebarRefreshRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, loading, scrollToBottom]);

  // Load existing conversation
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setMessages([]);
      setCurrentConvId(null);
      setConvTitle('New Legal Consultation');
      setLegalCategory('general');
    }
  }, [conversationId]);

  const loadConversation = async (id) => {
    setLoadingConv(true);
    try {
      const res = await axios.get(`/chat/history/${id}`);
      const conv = res.data.conversation;
      setMessages(conv.messages || []);
      setConvTitle(conv.title || 'Legal Consultation');
      setLegalCategory(conv.legalCategory || 'general');
      setCurrentConvId(id);
    } catch (err) {
      toast.error('Could not load conversation');
      navigate('/chat');
    } finally {
      setLoadingConv(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isValid = /\.(pdf|txt)$/i.test(file.name);
    if (!isValid) {
      toast.error('Only PDF and .txt files are supported.');
    } else {
      setAttachedFile(file);
    }
    e.target.value = '';
  };

  const handleSend = async (messageText) => {
    const text = (messageText || input).trim();
    if ((!text && !attachedFile) || loading) return;

    const userMessage = {
      role: 'user',
      content: attachedFile ? `📎 ${attachedFile.name}${text ? '\n\n' + text : ''}` : text,
      timestamp: new Date()
    };

    const fileToSend = attachedFile;

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedFile(null);
    setLoading(true);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      let res;
      if (fileToSend) {
        const formData = new FormData();
        formData.append('file', fileToSend);
        formData.append('message', text);
        if (currentConvId) formData.append('conversationId', currentConvId);
        res = await axios.post('/chat/analyze-document', formData);
      } else {
        res = await axios.post('/chat', {
          message: text,
          conversationId: currentConvId,
        });
      }

      const { conversationId: newConvId, message: aiMsg, conversationTitle } = res.data;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiMsg.content,
        timestamp: new Date(),
        legalCategory: aiMsg.legalCategory
      }]);

      if (!currentConvId) {
        setCurrentConvId(newConvId);
        navigate(`/chat/${newConvId}`, { replace: true });
      }

      if (conversationTitle) setConvTitle(conversationTitle);
      if (aiMsg.legalCategory) setLegalCategory(aiMsg.legalCategory);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get response. Please try again.');
      setMessages(prev => prev.slice(0, -1)); // remove optimistic user message on error
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConvId(null);
    setConvTitle('New Legal Consultation');
    setLegalCategory('general');
    navigate('/chat');
  };

  const getUserInitials = () => {
    return user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const formatTime = (ts) => {
    try { return format(new Date(ts), 'h:mm a'); } catch { return ''; }
  };

  const handleDownloadPdf = () => {
    if (!messages.length) return;
    try {
      exportConversationToPdf(convTitle || 'Legal Consultation', messages);
    } catch (err) {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar onNewChat={handleNewChat} />

      <div className="main-content">
        <div className="chat-page">

          {/* Header */}
          <div className="chat-header">
            <span style={{ fontSize: 22 }}>{CATEGORY_ICONS[legalCategory] || '⚖️'}</span>
            <div className="chat-header-info">
              <div className="chat-header-title">{convTitle}</div>
              <div className="chat-header-meta">
                <span className={`category-badge badge-${legalCategory?.replace('_', '-').split('_')[0] || 'general'}`}>
                  {legalCategory?.replace(/_/g, ' ') || 'General'}
                </span>
                {messages.length > 0 && (
                  <span>· {Math.ceil(messages.length / 2)} exchange{messages.length > 2 ? 's' : ''}</span>
                )}
              </div>
            </div>
            {messages.length > 0 && (
              <button className="btn-download-pdf" onClick={handleDownloadPdf} title="Download this consultation as PDF">
                ⬇ PDF
              </button>
            )}
            <div className="chat-header-status">
              <div className="status-dot"></div>
              VakilAI Online
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {loadingConv ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <div className="loading-spinner"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="chat-welcome">
                <div className="welcome-icon">⚖️</div>
                <h1 className="welcome-title">
                  Ask <span>VakilAI</span> Anything
                </h1>
                <p className="welcome-subtitle">
                  I'm your personal Indian legal advisor. Ask me about consumer rights, property laws, labor disputes, cyber crimes, constitutional rights, and more. I maintain context so you can ask follow-up questions naturally.
                </p>

                <div className="quick-topics">
                  {QUICK_TOPICS.map((topic, i) => (
                    <button
                      key={i}
                      className="quick-topic-btn"
                      onClick={() => handleSend(topic.query)}
                    >
                      <span className="quick-topic-emoji">{topic.emoji}</span>
                      <span className="quick-topic-text">{topic.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message-wrapper ${msg.role}`}>
                    <div className="message-meta">
                      <div className={`message-avatar ${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                        {msg.role === 'assistant' ? '⚖️' : getUserInitials()}
                      </div>
                      <span className="message-sender">
                        {msg.role === 'assistant' ? 'VakilAI' : user?.name?.split(' ')[0] || 'You'}
                      </span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className={`message-bubble ${msg.role}`}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message-wrapper assistant">
                    <div className="message-meta">
                      <div className="message-avatar ai">⚖️</div>
                      <span className="message-sender">VakilAI</span>
                      <span className="message-time">typing...</span>
                    </div>
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            {attachedFile && (
              <div className="attached-file-chip">
                📎 {attachedFile.name}
                <button type="button" onClick={() => setAttachedFile(null)} title="Remove file">✕</button>
              </div>
            )}
            <div className="chat-input-wrapper">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                hidden
                onChange={handleFileSelect}
              />
              <button
                type="button"
                className="btn-attach"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || loadingConv}
                title="Attach a PDF or text document for analysis"
              >
                📎
              </button>
              <div className="chat-textarea-wrapper">
                <textarea
                  ref={textareaRef}
                  className="chat-textarea"
                  placeholder={attachedFile ? 'Ask a question about this document (optional)...' : 'Ask about Indian laws, your rights, legal procedures...'}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={loading || loadingConv}
                />
              </div>
              <button
                className="btn-send"
                onClick={() => handleSend()}
                disabled={(!input.trim() && !attachedFile) || loading || loadingConv}
                title="Send message (Enter)"
              >
                ➤
              </button>
            </div>
            <div className="chat-input-hint">
              Press <strong>Enter</strong> to send · <strong>Shift+Enter</strong> for new line
            </div>
            <div className="chat-disclaimer">
              ⚖️ VakilAI provides legal information only. For serious matters, consult a qualified advocate.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
