import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import Sidebar from '../components/Sidebar';
import { exportTextToPdf } from '../utils/pdfExport';

const blank = (v, placeholder) => (v && v.trim() ? v.trim() : placeholder);

const TEMPLATES = [
  {
    id: 'rti',
    icon: '📄',
    label: 'RTI Application',
    desc: 'Request information from a government office under the RTI Act, 2005',
    fields: [
      { name: 'applicantName', label: 'Your Full Name', placeholder: '[Your Full Name]' },
      { name: 'applicantAddress', label: 'Your Address', placeholder: '[Your Address]', textarea: true },
      { name: 'authorityName', label: 'Public Authority / Department Name', placeholder: '[Public Authority Name]' },
      { name: 'authorityAddress', label: 'Public Authority Address', placeholder: '[Public Authority Address]', textarea: true },
      { name: 'informationSought', label: 'Information You Are Seeking', placeholder: '[Describe the specific information you want]', textarea: true },
    ],
    generate: (d) => `To,
The Public Information Officer,
${blank(d.authorityName, '[Public Authority Name]')}
${blank(d.authorityAddress, '[Public Authority Address]')}

Date: ${format(new Date(), 'MMMM d, yyyy')}

Subject: Request for Information under the Right to Information Act, 2005

Sir/Madam,

I, ${blank(d.applicantName, '[Your Full Name]')}, residing at ${blank(d.applicantAddress, '[Your Address]')}, wish to seek the following information under Section 6(1) of the Right to Information Act, 2005:

${blank(d.informationSought, '[Describe the specific information you want]')}

I am enclosing the prescribed application fee of Rs. 10/- (or as applicable) via the mode accepted by your office. Kindly provide the requested information within 30 days as mandated under the RTI Act, 2005. If the information concerns the life or liberty of a person, kindly provide it within 48 hours as per the Act.

If this office is not the correct authority to answer this application, please transfer it to the appropriate Public Information Officer under Section 6(3) and inform me accordingly.

Yours faithfully,
${blank(d.applicantName, '[Your Full Name]')}
${blank(d.applicantAddress, '[Your Address]')}`
  },
  {
    id: 'complaint',
    icon: '🛒',
    label: 'Consumer Complaint Letter',
    desc: 'Formal complaint to a seller/company citing the Consumer Protection Act, 2019',
    fields: [
      { name: 'yourName', label: 'Your Full Name', placeholder: '[Your Full Name]' },
      { name: 'yourAddress', label: 'Your Address', placeholder: '[Your Address]', textarea: true },
      { name: 'sellerName', label: 'Seller / Company Name', placeholder: '[Seller/Company Name]' },
      { name: 'productService', label: 'Product / Service in Question', placeholder: '[Product or Service Name]' },
      { name: 'purchaseDate', label: 'Date of Purchase', placeholder: '[Date of Purchase]' },
      { name: 'issueDescription', label: 'Description of the Issue', placeholder: '[Describe what went wrong]', textarea: true },
      { name: 'reliefSought', label: 'Relief Sought (refund, replacement, etc.)', placeholder: '[What you want them to do]' },
    ],
    generate: (d) => `To,
${blank(d.sellerName, '[Seller/Company Name]')}

Date: ${format(new Date(), 'MMMM d, yyyy')}

Subject: Complaint Regarding Defective Product/Deficient Service — ${blank(d.productService, '[Product/Service Name]')}

Dear Sir/Madam,

I, ${blank(d.yourName, '[Your Full Name]')}, residing at ${blank(d.yourAddress, '[Your Address]')}, am writing to formally complain about ${blank(d.productService, '[Product/Service Name]')} purchased from you on ${blank(d.purchaseDate, '[Date of Purchase]')}.

Issue: ${blank(d.issueDescription, '[Describe what went wrong]')}

Under the Consumer Protection Act, 2019, I am entitled to a remedy for defective goods, deficient services, or unfair trade practices. I request that you resolve this matter by providing: ${blank(d.reliefSought, '[What you want them to do]')}.

I expect a satisfactory response within 15 days of this letter. Failing that, I will be compelled to escalate this complaint to the appropriate Consumer Disputes Redressal Commission and/or the National Consumer Helpline (1800-11-4000 / 1915), and file online at edaakhil.nic.in.

I am attaching copies of the purchase receipt/invoice and any other supporting evidence with this letter.

Yours sincerely,
${blank(d.yourName, '[Your Full Name]')}
${blank(d.yourAddress, '[Your Address]')}`
  },
  {
    id: 'notice',
    icon: '⚖️',
    label: 'Legal Notice (Demand Notice) Draft',
    desc: 'A draft demand notice — review with a qualified advocate before sending',
    fields: [
      { name: 'senderName', label: 'Your Full Name', placeholder: '[Your Full Name]' },
      { name: 'senderAddress', label: 'Your Address', placeholder: '[Your Address]', textarea: true },
      { name: 'recipientName', label: 'Recipient Name', placeholder: '[Recipient Name]' },
      { name: 'recipientAddress', label: 'Recipient Address', placeholder: '[Recipient Address]', textarea: true },
      { name: 'facts', label: 'Facts of the Matter', placeholder: '[Describe what happened, with dates]', textarea: true },
      { name: 'demand', label: 'What You Are Demanding', placeholder: '[e.g. repayment of Rs. X within 15 days]', textarea: true },
      { name: 'responseDays', label: 'Response Deadline (days)', placeholder: '15' },
    ],
    generate: (d) => `LEGAL NOTICE

To,
${blank(d.recipientName, '[Recipient Name]')}
${blank(d.recipientAddress, '[Recipient Address]')}

Date: ${format(new Date(), 'MMMM d, yyyy')}

Sir/Madam,

Under instructions from and on behalf of my client, ${blank(d.senderName, '[Your Full Name]')}, residing at ${blank(d.senderAddress, '[Your Address]')}, I hereby serve upon you the following legal notice:

FACTS:
${blank(d.facts, '[Describe what happened, with dates]')}

DEMAND:
In view of the above, my client hereby calls upon you to ${blank(d.demand, '[e.g. repayment of Rs. X within 15 days]')} within ${blank(d.responseDays, '15')} days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate civil and/or criminal proceedings against you, entirely at your risk, cost, and consequences.

This notice is issued without prejudice to my client's other rights and remedies available under law, all of which are expressly reserved.

Yours faithfully,
${blank(d.senderName, '[Your Full Name]')}
${blank(d.senderAddress, '[Your Address]')}

⚖️ IMPORTANT: This is an AI-generated DRAFT only. A legal notice carries formal weight and potential consequences — have a qualified advocate review, finalize, and send it on your behalf before it is dispatched.`
  }
];

export default function Templates() {
  const [activeId, setActiveId] = useState(TEMPLATES[0].id);
  const [formData, setFormData] = useState({});

  const active = TEMPLATES.find(t => t.id === activeId);

  const previewText = useMemo(() => active.generate(formData), [active, formData]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectTemplate = (id) => {
    setActiveId(id);
    setFormData({});
  };

  const handleDownload = () => {
    exportTextToPdf(active.label, previewText);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-page">
          <div className="dashboard-header">
            <h1 className="dashboard-greeting">Document <span>Templates</span></h1>
            <p className="dashboard-date">Fill in the details and download a ready-to-use draft as a PDF</p>
          </div>

          <div className="disclaimer-banner">
            <span className="disclaimer-icon">⚠️</span>
            <span><strong>Note:</strong> These are AI-generated drafts to help you get started. For anything with legal consequences (especially a Legal Notice), please have a qualified advocate review it before use.</span>
          </div>

          <div className="quick-topics" style={{ marginBottom: 28 }}>
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                className="quick-topic-btn"
                style={activeId === t.id ? { borderColor: 'var(--accent-gold)', background: 'rgba(201,169,110,0.12)' } : undefined}
                onClick={() => handleSelectTemplate(t.id)}
              >
                <span className="quick-topic-emoji">{t.icon}</span>
                <span className="quick-topic-text">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="analytics-grid" style={{ alignItems: 'start' }}>
            <div className="analytics-card">
              <div className="analytics-card-title">{active.label} — Details</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{active.desc}</p>

              <form onSubmit={e => e.preventDefault()}>
                {active.fields.map(f => (
                  <div className="form-group" key={f.name}>
                    <label className="form-label">{f.label}</label>
                    {f.textarea ? (
                      <textarea
                        className="form-input"
                        rows={3}
                        placeholder={f.placeholder}
                        value={formData[f.name] || ''}
                        onChange={e => handleChange(f.name, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        placeholder={f.placeholder}
                        value={formData[f.name] || ''}
                        onChange={e => handleChange(f.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </form>

              <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={handleDownload}>
                ⬇ Download as PDF
              </button>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-title">Live Preview</div>
              <pre style={{
                whiteSpace: 'pre-wrap',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: 16,
                maxHeight: 560,
                overflowY: 'auto'
              }}>
                {previewText}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
