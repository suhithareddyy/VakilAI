import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Jammu & Kashmir', 'Ladakh'
];

const HELPLINE_GROUPS = [
  {
    title: '🆘 Free Legal Aid',
    color: '#c9a96e',
    items: [
      { label: 'NALSA Free Legal Aid', number: '15100 (Toll Free)', url: 'https://nalsa.gov.in', desc: 'Free lawyers for those who cannot afford one' },
      { label: 'NALSA Website', number: 'nalsa.gov.in', url: 'https://nalsa.gov.in', desc: 'Find your state/district legal services authority' },
    ]
  },
  {
    title: '🛒 Consumer Rights',
    color: '#27ae60',
    items: [
      { label: 'Consumer Helpline', number: '1800-11-4000 / 1915', url: 'https://consumerhelpline.gov.in', desc: 'Refunds, defective products, e-commerce disputes' },
      { label: 'File Complaint Online', number: 'edaakhil.nic.in', url: 'https://edaakhil.nic.in', desc: 'Free online consumer complaint filing' },
    ]
  },
  {
    title: '💻 Cyber Crime',
    color: '#9b59b6',
    items: [
      { label: 'Cyber Crime Helpline', number: '1930 (Call Immediately!)', url: 'https://cybercrime.gov.in', desc: 'Online fraud, hacking, financial cybercrime' },
      { label: 'Cyber Crime Portal', number: 'cybercrime.gov.in', url: 'https://cybercrime.gov.in', desc: 'File a detailed cybercrime complaint' },
    ]
  },
  {
    title: '👨‍👩‍👧 Women & Family',
    color: '#f1c40f',
    items: [
      { label: 'Women Helpline', number: '181 (Free, 24x7)', url: '', desc: 'Domestic violence, harassment, abuse' },
      { label: 'NCW Helpline', number: '7827170170', url: 'https://ncw.nic.in', desc: 'National Commission for Women' },
    ]
  },
  {
    title: '🚔 Police & Emergency',
    color: '#e74c3c',
    items: [
      { label: 'Police Emergency', number: '100 / 112', url: '', desc: 'Immediate police assistance' },
      { label: 'Child Helpline', number: '1098 (Toll Free)', url: '', desc: 'Child abuse, trafficking, missing children' },
    ]
  },
  {
    title: '👷 Labor & Employment',
    color: '#e67e22',
    items: [
      { label: 'EPF Helpline', number: '1800-118-005', url: 'https://epfindia.gov.in', desc: 'Provident fund queries & grievances' },
      { label: 'Shram Suvidha Portal', number: 'shramsuvidha.gov.in', url: 'https://shramsuvidha.gov.in', desc: 'Labour law complaints & inspections' },
    ]
  },
];

export default function LegalAid() {
  const [state, setState] = useState('');

  const handleFindDlsa = () => {
    window.open('https://nalsa.gov.in', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-page">
          <div className="dashboard-header">
            <h1 className="dashboard-greeting">Legal Aid & <span>Helplines</span></h1>
            <p className="dashboard-date">Verified national helplines and free legal aid resources for Indian citizens</p>
          </div>

          <div className="disclaimer-banner">
            <span className="disclaimer-icon">ℹ️</span>
            <span>
              <strong>Note:</strong> We only list verified national toll-free numbers here.
              For your local District Legal Services Authority (DLSA) office address, please use the
              official NALSA locator below — we don't display office addresses we can't independently verify.
            </span>
          </div>

          <div className="analytics-card" style={{ marginBottom: 32 }}>
            <div className="analytics-card-title">Find Your Local DLSA Office</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 12 }}>
              <select className="form-select" style={{ maxWidth: 260, marginBottom: 0 }} value={state} onChange={e => setState(e.target.value)}>
                <option value="">Select your state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleFindDlsa}>
                Find DLSA Office on NALSA →
              </button>
            </div>
          </div>

          <h2 className="section-title">Helpline Directory</h2>
          <div className="legalaid-grid">
            {HELPLINE_GROUPS.map((group, gi) => (
              <div key={gi} className="analytics-card">
                <div className="analytics-card-title" style={{ color: group.color }}>{group.title}</div>
                <div className="helplines-grid" style={{ marginTop: 10 }}>
                  {group.items.map((item, i) => (
                    <a
                      key={i}
                      href={item.url || '#'}
                      target={item.url ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="helpline-card"
                      style={{ borderColor: group.color + '40' }}
                    >
                      <div>
                        <div className="helpline-label">{item.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                      </div>
                      <span className="helpline-number" style={{ color: group.color }}>{item.number}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
