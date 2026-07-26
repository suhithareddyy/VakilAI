import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

// Validated categorical palette (dark surface #16152a) — see dataviz skill.
// "general" intentionally uses the muted ink tone rather than a categorical
// hue, since it's the "Other/uncategorized" bucket, not a real legal domain.
const CATEGORY_CHART_COLORS = {
  consumer_rights: '#3987e5',
  property_law: '#d95926',
  labor_law: '#199e70',
  cyber_law: '#c98500',
  constitutional_rights: '#d55181',
  criminal_law: '#008300',
  family_law: '#9085e9',
  general: '#898781'
};

const CATEGORY_LABELS = {
  consumer_rights: 'Consumer Rights', property_law: 'Property Law', labor_law: 'Labor Law',
  cyber_law: 'Cyber Law', constitutional_rights: 'Constitutional Rights', criminal_law: 'Criminal Law',
  family_law: 'Family Law', general: 'General'
};

const LEGAL_TOPICS_DATA = [
  {
    emoji: '🛒', title: 'Consumer Rights', desc: 'Refunds, defective products, unfair trade', color: '#27ae60',
    summary: 'When you buy something and it turns out to be defective, fake, or the seller cheats you — you have strong legal rights to get your money back or get compensation.',
    laws: ['Consumer Protection Act, 2019', 'E-Commerce Consumer Rules, 2020', 'Consumer Protection Authority (CCPA)'],
    rights: ['🛡️ You can return a defective product and demand a full refund', 'ℹ️ The seller must tell you the correct price, quality & quantity', '🔁 You can choose from multiple options — not forced to accept one', '💰 You can claim compensation if a product causes you harm', '📚 You have the right to know your consumer rights'],
    steps: ['Save your bill, order screenshot & all chat messages with the seller', 'Send a written complaint email to the seller mentioning "Consumer Protection Act 2019"', 'If no response, escalate via Amazon/Flipkart grievance section (they must respond in 48 hrs)', 'Call the free government helpline: 1915', 'File a free online complaint at edaakhil.nic.in — no lawyer needed!'],
    helplines: [{ label: '📞 Consumer Helpline (Free)', number: '1915 / 1800-11-4000', url: 'https://consumerhelpline.gov.in' }, { label: '🌐 File Complaint Online', number: 'edaakhil.nic.in', url: 'https://edaakhil.nic.in' }],
    faqs: ['What can I do if I receive a broken or fake product?', 'Can a seller legally refuse to give me a refund?', 'How do I complain against Flipkart or Amazon?'],
    funFact: '💡 Did you know? You can file a consumer complaint yourself online — completely FREE, no lawyer required!'
  },
  {
    emoji: '🏠', title: 'Property Law', desc: 'Sale deed, RERA, tenant rights', color: '#3498db',
    summary: 'Whether you are buying a flat, renting a house, or dealing with a builder who is delaying your home — Indian law protects you at every step.',
    laws: ['Transfer of Property Act, 1882', 'Registration Act, 1908', 'RERA (Real Estate Act), 2016', 'Hindu Succession Act, 1956'],
    rights: ['📄 You must get a proper registered sale deed when buying property', '⏰ If your builder delays handing over your flat — you can claim interest', '🏘️ A landlord cannot throw you out without a proper court notice', '👩 Daughters have equal rights to family property (since 2005)', '🔨 If your new flat has construction defects — builder must fix it free within 5 years'],
    steps: ['Before buying, check the property\'s history at the Sub-Registrar office', 'Check if the builder is registered under RERA at your state\'s RERA website', 'Register the sale deed within 4 months of signing — it\'s legally required', 'Pay stamp duty (a government tax — usually 5-8% of property value)', 'If builder delays, file a complaint at your state\'s RERA portal'],
    helplines: [{ label: '🌐 RERA Portal (All States)', number: 'rera.in', url: 'https://rera.in' }, { label: '🌐 MahaRERA (Maharashtra)', number: 'maharera.mahaonline.gov.in', url: 'https://maharera.mahaonline.gov.in' }],
    faqs: ['What papers do I need to buy a house or flat in India?', 'My builder is not giving me possession — what can I do?', 'Can my landlord force me to leave my rented house?'],
    funFact: '💡 Did you know? Under RERA, if your builder delays possession, they must pay you interest every month until they hand over the flat!'
  },
  {
    emoji: '👷', title: 'Labor Law', desc: 'PF, gratuity, wrongful termination', color: '#e67e22',
    summary: 'As an employee, you have rights about your salary, savings (PF), bonus after long service (gratuity), maternity leave and protection from unfair firing.',
    laws: ['EPF (Provident Fund) Act, 1952', 'Payment of Gratuity Act, 1972', 'Maternity Benefit Act, 1961', 'Code on Wages, 2019', 'POSH Act, 2013'],
    rights: ['💼 Your employer must deposit 12% of your salary into your PF account every month', '🎁 After working 5 years at a company, you are entitled to Gratuity (bonus pay)', '🤱 Working mothers get 26 weeks of fully paid maternity leave', '📢 Your employer must give you 30 days notice before firing you', '🚫 You are protected from sexual harassment at your workplace (POSH Act)'],
    steps: ['Check your PF balance anytime on the EPFO website or UMANG app', 'If your salary is not paid on time, complain to the Labour Commissioner', 'If fired unfairly, approach the Labour Court — you have 3 years to file', 'For PF problems, raise a grievance at epfigms.epfindia.gov.in', 'For workplace harassment, complain to your company\'s Internal Committee'],
    helplines: [{ label: '📞 EPF Helpline (Free)', number: '1800-118-005', url: 'https://epfindia.gov.in' }, { label: '🌐 Labour Portal', number: 'shramsuvidha.gov.in', url: 'https://shramsuvidha.gov.in' }],
    faqs: ['How do I calculate how much gratuity I will get?', 'Can my employer fire me without any notice?', 'How do I withdraw my PF money after leaving a job?'],
    funFact: '💡 Did you know? Your PF account follows you everywhere — even if you change jobs, your PF money stays with you using your UAN number!'
  },
  {
    emoji: '💻', title: 'Cyber Law', desc: 'Online fraud, hacking, data privacy', color: '#9b59b6',
    summary: 'If someone hacks your account, steals your money online, or misuses your personal data — Indian law has strong protection and you can get help quickly.',
    laws: ['IT (Information Technology) Act, 2000', 'IT Amendment Act, 2008', 'Digital Personal Data Protection Act, 2023', 'BNS (New Criminal Law), 2023'],
    rights: ['🚨 You can report cyber crime at any police station — they cannot refuse', '🔒 Your personal data cannot be used by any company without your permission', '💳 If your bank account is hacked, you can get your money back if reported fast', '👤 Identity theft is a crime — the culprit can go to jail for 3 years', '📱 Cyberstalking and online harassment is a punishable offence'],
    steps: ['🚨 FIRST: Call 1930 immediately if money was stolen from your account', 'Take screenshots of everything — conversations, links, payment proofs', 'File a complaint at cybercrime.gov.in within 24 hours', 'Call your bank within 72 hours to block the fraudulent transaction', 'Visit the nearest Cyber Crime police cell with all your evidence'],
    helplines: [{ label: '🚨 Cyber Crime Helpline', number: '1930 (Call Immediately!)', url: 'https://cybercrime.gov.in' }, { label: '🌐 Cyber Crime Portal', number: 'cybercrime.gov.in', url: 'https://cybercrime.gov.in' }],
    faqs: ['Someone transferred money from my account — what do I do right now?', 'How do I report a fake social media profile using my photos?', 'What are my rights if a company misuses my personal data?'],
    funFact: '💡 The "Golden Hour" Rule: If you report online financial fraud within the first hour, your chances of getting the money back are very high!'
  },
  {
    emoji: '⚖️', title: 'Constitutional Rights', desc: 'Fundamental rights, writs, PILs', color: '#c9a96e',
    summary: 'The Indian Constitution gives every citizen certain Fundamental Rights that cannot be taken away by anyone — not even the government.',
    laws: ['Constitution of India — Part III (Articles 12 to 35)', 'Article 32 — Right to approach Supreme Court', 'Article 226 — Right to approach High Court'],
    rights: ['🤝 Right to Equality — No one can discriminate based on caste, religion or gender', '🗣️ Right to Freedom — You can speak freely, travel anywhere in India, choose any job', '🛑 Right Against Exploitation — No one can force you to work without pay', '🙏 Right to Religion — You can follow any religion you choose', '⚖️ Right to go to Court — If your rights are violated, you can approach Supreme Court'],
    steps: ['If your basic rights are violated, you can file a Writ Petition in the High Court', 'If it\'s very serious, you can go directly to the Supreme Court under Article 32', 'Any citizen can file a PIL (Public Interest Litigation) for issues affecting the public', 'If you cannot afford a lawyer, NALSA provides completely FREE legal help', 'You can also complain to the National Human Rights Commission (NHRC)'],
    helplines: [{ label: '📞 NALSA Free Legal Aid', number: '15100 (Toll Free)', url: 'https://nalsa.gov.in' }, { label: '📞 NHRC Helpline', number: '14433', url: 'https://nhrc.nic.in' }],
    faqs: ['What are the 6 fundamental rights every Indian citizen has?', 'What is a PIL and how can I file one?', 'What is Habeas Corpus — when can it help me?'],
    funFact: '💡 Did you know? Article 21 (Right to Life) is the most powerful right — courts have used it to include the right to education, clean environment and even the right to sleep!'
  },
  {
    emoji: '🚔', title: 'Criminal Law', desc: 'FIR, bail, rights of accused', color: '#e74c3c',
    summary: 'If you are ever arrested, want to file a police complaint, or need to understand bail — knowing your rights can protect you from being treated unfairly.',
    laws: ['Bharatiya Nyaya Sanhita (BNS) 2023 — replaced old IPC', 'BNSS 2023 — replaced old CrPC', 'Bharatiya Sakshya Adhiniyam (BSA) 2023'],
    rights: ['📋 Police MUST register your FIR — they cannot say "come back later" or refuse', '⏱️ If arrested, police must take you to a Magistrate (judge) within 24 hours', '👨‍⚖️ You have the right to call a lawyer immediately after arrest', '🤐 You cannot be forced to confess or sign a blank paper', '🏠 You can apply for bail — in simple cases, police must give bail'],
    steps: ['Go to any police station to file an FIR — it\'s called a "Zero FIR" if the crime didn\'t happen in that area', 'If police refuse to register your FIR, write a complaint letter to the SP', 'You can also directly approach a Magistrate if police don\'t help', 'For bail in serious cases, apply to the Sessions Court (district court)', 'If worried about being arrested, apply for Anticipatory Bail from the High Court'],
    helplines: [{ label: '🚨 Police Emergency', number: '100', url: '' }, { label: '📞 NALSA Free Legal Aid', number: '15100 (Toll Free)', url: 'https://nalsa.gov.in' }],
    faqs: ['What are my rights if police arrest me?', 'What do I do if police refuse to file my FIR?', 'What is the difference between bailable and non-bailable offence?'],
    funFact: '💡 Did you know? India replaced the 163-year-old IPC (Indian Penal Code) with a new law called BNS (Bharatiya Nyaya Sanhita) in July 2024!'
  },
  {
    emoji: '👨‍👩‍👧', title: 'Family Law', desc: 'Divorce, custody, maintenance', color: '#f1c40f',
    summary: 'Family laws cover marriage, divorce, who gets the children, monthly financial support (maintenance), and protection from abuse at home.',
    laws: ['Hindu Marriage Act, 1955', 'Special Marriage Act, 1954', 'Protection of Women from DV Act, 2005', 'Hindu Succession Act, 1956', 'Dowry Prohibition Act, 1961'],
    rights: ['💰 A wife, children and even parents can demand monthly maintenance', '👩‍👧 Daughters have equal right to their father\'s property — same as sons', '🛡️ Victims of domestic violence can get a Protection Order', '🏠 Even after separation, a wife has the right to stay in the shared home', '🤝 Couples can get a mutual divorce after just 6 months of separation'],
    steps: ['For domestic violence, go to the nearest police station or call 181 (Women Helpline)', 'For divorce, file a petition in the Family Court in your city', 'For monthly maintenance, apply in the Magistrate Court under Section 125', 'For child custody, the Family Court always decides based on "what is best for the child"', 'For dowry harassment, file an FIR — it is a serious crime under BNS'],
    helplines: [{ label: '📞 Women Helpline', number: '181 (Free, 24x7)', url: '' }, { label: '📞 NCW Helpline', number: '7827170170', url: 'https://ncw.nic.in' }],
    faqs: ['How can I get a divorce if my spouse does not agree?', 'What should I do if I am facing domestic violence at home?', 'Who gets custody of the child after divorce?'],
    funFact: '💡 Did you know? Since 2005, daughters have the SAME right to their father\'s ancestral property as sons — even if the father passed away before 2005!'
  },
  {
    emoji: '🏛️', title: 'General Legal', desc: 'RTI, legal aid, court procedures', color: '#95a5a6',
    summary: 'Every citizen has the right to ask the government for information, get a free lawyer if they cannot afford one, and understand how Indian courts work.',
    laws: ['Right to Information (RTI) Act, 2005', 'Legal Services Authorities Act, 1987', 'Limitation Act, 1963', 'Advocates Act, 1961'],
    rights: ['📄 You can ask ANY government office for information — they must reply in 30 days', '🆓 If you cannot afford a lawyer, the government will provide one for FREE', '⚡ You can use Lok Adalat for a quick settlement — no long court waiting', '📱 You can check your court case status online anytime', '⚠️ You can file a complaint against a bad lawyer with the Bar Council'],
    steps: ['To get government information: file an RTI at rtionline.gov.in with just ₹10 fee', 'For a free government lawyer: go to your District Legal Services Authority (DLSA) office', 'To track your court case: go to ecourts.gov.in and search by case number', 'For fast settlement without long court process: approach Lok Adalat', 'To verify if a lawyer is genuine: check barcouncilofindia.org'],
    helplines: [{ label: '📞 NALSA Free Legal Aid', number: '15100 (Toll Free)', url: 'https://nalsa.gov.in' }, { label: '🌐 File RTI Online', number: 'rtionline.gov.in', url: 'https://rtionline.gov.in' }],
    faqs: ['How do I file an RTI to get information from the government?', 'Can I get a free lawyer if I cannot afford one?', 'What is Lok Adalat and how is it different from a regular court?'],
    funFact: '💡 Did you know? Using RTI, any ordinary citizen can ask the government why a road was not built — and they MUST answer within 30 days!'
  }
];

const CATEGORY_ICONS = { consumer_rights: '🛒', property_law: '🏠', labor_law: '👷', cyber_law: '💻', constitutional_rights: '⚖️', criminal_law: '🚔', family_law: '👨‍👩‍👧', tax_law: '💰', general: '📋' };
const CATEGORY_BADGE = { consumer_rights: 'badge-consumer', property_law: 'badge-property', labor_law: 'badge-labor', cyber_law: 'badge-cyber', constitutional_rights: 'badge-constitutional', criminal_law: 'badge-criminal', family_law: 'badge-family', general: 'badge-general' };

function LegalTopicModal({ topic, onClose, onAskQuestion }) {
  if (!topic) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottom: `3px solid ${topic.color}` }}>
          <div className="modal-header-left">
            <span className="modal-emoji">{topic.emoji}</span>
            <div>
              <h2 className="modal-title">{topic.title}</h2>
              <p className="modal-summary">{topic.summary}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} title="Close (Esc)">✕</button>
        </div>
        <div className="modal-body">
          {topic.funFact && (
            <div className="modal-funfact" style={{ borderColor: topic.color + '50', background: topic.color + '10' }}>
              {topic.funFact}
            </div>
          )}
          <div className="modal-grid">
            <div className="modal-col">
              <div className="modal-section">
                <h3 className="modal-section-title"><span>📜</span> Which Laws Apply?</h3>
                <div className="modal-laws">
                  {topic.laws.map((law, i) => (
                    <span key={i} className="law-tag" style={{ borderColor: topic.color + '50', color: topic.color }}>{law}</span>
                  ))}
                </div>
              </div>
              <div className="modal-section">
                <h3 className="modal-section-title"><span>✅</span> What Rights Do You Have?</h3>
                <ul className="modal-list">
                  {topic.rights.map((right, i) => (
                    <li key={i} className="modal-list-item">{right}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-col">
              <div className="modal-section">
                <h3 className="modal-section-title"><span>🪜</span> What Should You Do? (Step by Step)</h3>
                <ol className="modal-list">
                  {topic.steps.map((step, i) => (
                    <li key={i} className="modal-list-item step-item">
                      <span className="step-number" style={{ background: topic.color }}>{i + 1}</span>{step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="modal-section">
                <h3 className="modal-section-title"><span>📞</span> Who Can You Call for Help?</h3>
                <div className="helplines-grid">
                  {topic.helplines.map((h, i) => (
                    <a key={i} href={h.url || '#'} target={h.url ? '_blank' : '_self'} rel="noopener noreferrer"
                      className="helpline-card" style={{ borderColor: topic.color + '40' }}>
                      <span className="helpline-label">{h.label}</span>
                      <span className="helpline-number" style={{ color: topic.color }}>{h.number}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-section modal-faqs">
            <h3 className="modal-section-title"><span>💬</span> Still Have Questions? Ask VakilAI Directly!</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              Click any question below — VakilAI will answer it instantly in the chat
            </p>
            <div className="faqs-list">
              {topic.faqs.map((faq, i) => (
                <button key={i} className="faq-btn" style={{ '--faq-color': topic.color }} onClick={() => onAskQuestion(faq)}>
                  <span className="faq-icon">🤔</span>
                  <span>{faq}</span>
                  <span className="faq-arrow">Ask →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, categories: 0 });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSelectedTopic(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const fetchData = async () => {
    try {
      const [convRes, statsRes] = await Promise.all([
        axios.get('/chat/conversations?limit=5'),
        axios.get('/chat/stats')
      ]);

      setConversations(convRes.data.conversations || []);

      const s = statsRes.data.stats || {};
      const breakdown = s.categoryBreakdown || [];
      setStats({
        total: s.total || 0,
        thisWeek: s.thisWeek || 0,
        categories: breakdown.length
      });
      setCategoryBreakdown(breakdown);
      setWeeklyActivity(
        (s.weeklyActivity || []).map(w => ({
          week: format(new Date(w.weekStart), 'MMM d'),
          count: w.count
        }))
      );
    } catch (err) { console.error('Dashboard load error'); }
    finally { setLoading(false); }
  };

  const handleAskQuestion = (question) => {
    setSelectedTopic(null);
    navigate('/chat', { state: { initialQuery: question } });
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-page">
          <div className="dashboard-header">
            <h1 className="dashboard-greeting">{getGreeting()}, <span>{user?.name?.split(' ')[0] || 'Counselor'}</span> 👋</h1>
            <p className="dashboard-date">{format(new Date(), 'EEEE, MMMM d, yyyy')} · Your legal advisor is ready</p>
          </div>

          <div className="disclaimer-banner">
            <span className="disclaimer-icon">⚠️</span>
            <span><strong>Note:</strong> VakilAI gives you general legal information to help you understand your rights. It is not a substitute for a real lawyer. For serious matters, please consult a qualified advocate.</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon gold">💬</div><div><div className="stat-value">{stats.total}</div><div className="stat-label">Total Consultations</div></div></div>
            <div className="stat-card"><div className="stat-icon green">📅</div><div><div className="stat-value">{stats.thisWeek}</div><div className="stat-label">This Week</div></div></div>
            <div className="stat-card"><div className="stat-icon red">⚖️</div><div><div className="stat-value">{stats.categories}</div><div className="stat-label">Legal Areas Explored</div></div></div>
          </div>

          {!loading && stats.total > 0 && (
            <>
              <h2 className="section-title">Your Legal Activity</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-card-title">Consultations by Legal Area</div>
                  {categoryBreakdown.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={categoryBreakdown}
                            dataKey="count"
                            nameKey="category"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            label={({ percent }) => `${Math.round(percent * 100)}%`}
                            labelLine={false}
                          >
                            {categoryBreakdown.map((entry, i) => (
                              <Cell key={i} fill={CATEGORY_CHART_COLORS[entry.category] || CATEGORY_CHART_COLORS.general} stroke="var(--bg-secondary)" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13 }}
                            labelStyle={{ color: 'var(--text-primary)' }}
                            formatter={(value, name) => [value, CATEGORY_LABELS[name] || name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <ul className="analytics-legend">
                        {categoryBreakdown.map((entry, i) => (
                          <li key={i}>
                            <span className="analytics-legend-dot" style={{ background: CATEGORY_CHART_COLORS[entry.category] || CATEGORY_CHART_COLORS.general }} />
                            {CATEGORY_LABELS[entry.category] || 'General'} — {entry.count}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="analytics-empty">Not enough data yet</div>
                  )}
                </div>

                <div className="analytics-card">
                  <div className="analytics-card-title">Weekly Activity (last 6 weeks)</div>
                  {weeklyActivity.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={weeklyActivity} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--border-color)' }} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13 }}
                          labelStyle={{ color: 'var(--text-primary)' }}
                          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        />
                        <Bar dataKey="count" name="Consultations" fill={CATEGORY_CHART_COLORS.consumer_rights} radius={[4, 4, 0, 0]} maxBarSize={36} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="analytics-empty">Not enough data yet</div>
                  )}
                </div>
              </div>
            </>
          )}

          <h2 className="section-title">Explore Your Legal Rights
            <span style={{ fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 400, color: 'var(--text-muted)', marginLeft: 12, textTransform: 'none', letterSpacing: 0 }}>
              👆 Click any card to learn your rights in simple language
            </span>
          </h2>
          <div className="quick-actions">
            {LEGAL_TOPICS_DATA.map((topic, i) => (
              <div key={i} className="quick-action-card topic-card" onClick={() => setSelectedTopic(topic)} style={{ '--topic-color': topic.color }}>
                <div className="quick-action-icon">{topic.emoji}</div>
                <div className="quick-action-title">{topic.title}</div>
                <div className="quick-action-desc">{topic.desc}</div>
                <div className="topic-card-hint">Tap to learn more →</div>
              </div>
            ))}
          </div>

          <h2 className="section-title">Recent Consultations</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner" style={{ margin: '0 auto' }}></div></div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚖️</div>
              <div className="empty-state-title">No consultations yet</div>
              <div className="empty-state-text">Click any topic card above to explore your rights, or ask VakilAI a legal question directly.</div>
              <Link to="/chat" className="btn btn-primary" style={{ width: 'auto', marginTop: 16, padding: '10px 24px' }}>Ask VakilAI a Question →</Link>
            </div>
          ) : (
            <div className="recent-conversations">
              {conversations.map(conv => (
                <Link key={conv._id} to={`/chat/${conv._id}`} className="conversation-row">
                  <div className="conv-icon">{CATEGORY_ICONS[conv.legalCategory] || '📋'}</div>
                  <div className="conv-info">
                    <div className="conv-title">{conv.title || 'Legal Consultation'}</div>
                    <div className="conv-meta">
                      <span className={`category-badge ${CATEGORY_BADGE[conv.legalCategory] || 'badge-general'}`}>{conv.legalCategory?.replace(/_/g, ' ') || 'General'}</span>
                      {' · '}{conv.messageCount} messages{' · '}{format(new Date(conv.updatedAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>›</span>
                </Link>
              ))}
              {stats.total > 5 && (
                <Link to="/history" style={{ display: 'block', textAlign: 'center', padding: '16px', color: 'var(--accent-gold)', fontSize: 14, textDecoration: 'none' }}>View all {stats.total} consultations →</Link>
              )}
            </div>
          )}

          <h2 className="section-title" style={{ marginTop: 24 }}>Key Legal Helplines</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { icon: '🛒', title: 'Consumer Helpline', info: '1800-11-4000 / 1915', link: 'https://consumerhelpline.gov.in' },
              { icon: '💻', title: 'Cyber Crime', info: '1930 · cybercrime.gov.in', link: 'https://cybercrime.gov.in' },
              { icon: '⚖️', title: 'NALSA (Legal Aid)', info: '15100 (Toll Free)', link: 'https://nalsa.gov.in' },
            ].map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="quick-action-card" style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: 28 }}>{item.icon}</div>
                <div className="quick-action-title">{item.title}</div>
                <div className="quick-action-desc" style={{ color: 'var(--accent-gold)', fontWeight: 500 }}>{item.info}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {selectedTopic && <LegalTopicModal topic={selectedTopic} onClose={() => setSelectedTopic(null)} onAskQuestion={handleAskQuestion} />}
    </div>
  );
}