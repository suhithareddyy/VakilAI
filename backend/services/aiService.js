const Groq = require('groq-sdk');
const { retrieveRelevantChunks } = require('./ragService');

// Initialize Groq client (free API – get key at console.groq.com)
let groqClient = null;
try {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('✅ Groq AI configured (model: llama-3.1-8b-instant )');
  } else {
    console.log('ℹ️  Groq not configured – using built-in legal knowledge base');
  }
} catch (e) {
  console.log('Groq init error, using built-in legal knowledge base:', e.message);
}

// Comprehensive Indian Legal Knowledge Base for fallback
const LEGAL_KNOWLEDGE_BASE = {
  consumer_rights: {
    keywords: ['consumer', 'refund', 'defective', 'product', 'service', 'complaint', 'seller', 'buyer', 'purchase', 'warranty', 'guarantee', 'misleading', 'fraud', 'overcharging'],
    response: `**Consumer Rights under Indian Consumer Protection Act, 2019:**

Under the Consumer Protection Act, 2019, you have these fundamental rights:

1. **Right to Safety** – Protection from hazardous goods/services
2. **Right to Information** – Know quality, quantity, potency, purity & price
3. **Right to Choose** – Access to competitive goods/services at fair prices
4. **Right to be Heard** – Your interests will be considered in appropriate forums
5. **Right to Seek Redressal** – Compensation for unfair trade/exploitation
6. **Right to Consumer Education** – Knowledge of rights and remedies

**Where to File Complaints:**
- **District Consumer Commission** – Claims up to ₹1 crore
- **State Consumer Commission** – Claims ₹1 crore to ₹10 crore  
- **National Consumer Commission** – Claims above ₹10 crore
- **Online:** consumerhelpline.gov.in or file at edaakhil.nic.in

**Time Limit:** Complaint must be filed within **2 years** of cause of action.

**Law Reference:** Consumer Protection Act, 2019 (replaced 1986 Act)`
  },
  refund: {
    keywords: ['refund', 'return', 'money back', 'seller refuses', 'not returning', 'denied refund'],
    response: `**If a Seller Refuses Refund in India:**

Under Consumer Protection Act, 2019, a seller CANNOT refuse a valid refund claim if:
- Product is **defective or damaged**
- Product is **not as described**
- Service was **deficient**
- There was **unfair trade practice**

**Steps to Take:**
1. **Written Complaint** – Send email/letter to seller citing Consumer Protection Act, 2019
2. **E-Commerce Portal Escalation** – Use Amazon/Flipkart grievance mechanism (mandatory resolution within 48 hrs)
3. **National Consumer Helpline** – Call **1800-11-4000** (toll-free) or **1915**
4. **File Online Complaint** – Visit edaakhil.nic.in (free, no lawyer needed)
5. **Legal Notice** – Send through a lawyer (often prompts quick settlement)

**Relief Available:**
- Full refund + compensation for mental agony
- Punitive damages if unfair trade practice proven
- Up to ₹10 lakh penalty on seller for repeated violations

*Tip: Keep all purchase receipts, chat screenshots, and correspondence as evidence.*`
  },
  property: {
    keywords: ['property', 'land', 'house', 'flat', 'apartment', 'registry', 'sale deed', 'tenant', 'landlord', 'rent', 'eviction', 'possession', 'builder', 'rera'],
    response: `**Property Laws in India – Key Provisions:**

**1. Transfer of Property Act, 1882**
- Governs sale, mortgage, lease, gift of immovable property
- Sale deed must be registered under Registration Act, 1908
- Stamp duty varies by state (5-8% typically)

**2. Registration Act, 1908**
- Mandatory registration of property documents above ₹100
- Must be done within **4 months** of execution
- Sub-Registrar office registration required

**3. RERA (Real Estate Regulation Act, 2016)**
- Protects homebuyers from builders
- Builder must register project with RERA authority
- Delays entitle buyer to **interest @ SBI MCLR + 2%**
- File complaints at your state RERA portal

**4. Tenant Rights (Rent Control Acts)**
- State-specific laws (e.g., Delhi Rent Control Act)
- Tenant cannot be evicted without proper notice and court order
- Landlord must provide basic amenities

**5. Inheritance**
- Hindu Succession Act, 1956 (amended 2005) – Daughters have equal rights
- Muslim Personal Law for Muslims
- Indian Succession Act for Christians/Parsis

**Law References:** TPA 1882, Registration Act 1908, RERA 2016, Hindu Succession Act 1956`
  },
  labor: {
    keywords: ['employee', 'employer', 'salary', 'wages', 'fired', 'terminated', 'resignation', 'gratuity', 'pf', 'provident fund', 'esi', 'overtime', 'leave', 'maternity', 'workplace', 'labor', 'labour'],
    response: `**Labor Laws in India – Employee Rights:**

**1. Wages & Payment**
- **Payment of Wages Act, 1936** – Wages must be paid by 7th/10th of next month
- **Minimum Wages Act, 1948** – State-specific minimum wages
- **Code on Wages, 2019** – Consolidated wages law

**2. Provident Fund (PF)**
- **EPF Act, 1952** – Mandatory for companies with 20+ employees
- Employer contributes 12% of basic salary; Employee contributes 12%
- Check balance: epfindia.gov.in or UMANG app

**3. Gratuity**
- **Payment of Gratuity Act, 1972**
- Applicable after **5 years of continuous service**
- Formula: (Last salary × 15 × Years of service) ÷ 26

**4. Termination Rights**
- 30-day notice period (or pay in lieu) for most employees
- Wrongful termination → file complaint with Labour Commissioner
- Workmen cannot be retrenched without 30-day notice + compensation

**5. Other Key Rights**
- **Maternity Benefit Act, 1961** – 26 weeks paid maternity leave
- **ESI Act, 1948** – Medical coverage for salary up to ₹21,000/month
- **POSH Act, 2013** – Protection from sexual harassment at workplace

**File Complaints:** Labour Commissioner's office or Shram Suvidha Portal`
  },
  cyber: {
    keywords: ['cyber', 'hacking', 'fraud', 'online', 'digital', 'data', 'privacy', 'phishing', 'scam', 'identity theft', 'social media', 'defamation', 'pornography', 'cybercrime'],
    response: `**Cyber Laws in India – IT Act, 2000 & Amendments:**

**Key Offences & Penalties under IT Act, 2000:**

1. **Hacking/Unauthorized Access (Sec 66)**
   - Imprisonment up to 3 years + ₹5 lakh fine

2. **Identity Theft (Sec 66C)**
   - Imprisonment up to 3 years + ₹1 lakh fine

3. **Cheating by Personation (Sec 66D)**
   - Imprisonment up to 3 years + ₹1 lakh fine

4. **Cyber Stalking/Harassment**
   - Under IT Act + IPC Section 354D (women's specific)

5. **Data Protection**
   - Digital Personal Data Protection Act, 2023 (new)
   - Your data cannot be processed without consent

6. **Online Financial Fraud**
   - Report within **Golden Hour** – call 1930 (Cyber Crime Helpline)
   - File at cybercrime.gov.in

**Steps for Cyber Crime Victims:**
1. Preserve all digital evidence (screenshots, emails, URLs)
2. File complaint at **cybercrime.gov.in** or nearest Cyber Cell
3. Contact bank **immediately** for financial fraud (within 72 hours for max recovery)
4. Call helpline **1930**

**Law References:** IT Act 2000, IT (Amendment) Act 2008, DPDP Act 2023`
  },
  constitutional: {
    keywords: ['fundamental rights', 'constitutional', 'constitution', 'rights', 'freedom', 'equality', 'article', 'fundamental', 'pil', 'writ', 'habeas corpus', 'mandamus', 'high court', 'supreme court'],
    response: `**Constitutional Rights of Indian Citizens:**

**Part III – Fundamental Rights (Articles 12-35):**

1. **Right to Equality (Art. 14-18)**
   - Equality before law; No discrimination based on religion, race, caste, sex

2. **Right to Freedom (Art. 19-22)**
   - Freedom of speech & expression
   - Right to assemble peacefully
   - Right to move freely throughout India
   - Right to practice any profession

3. **Right Against Exploitation (Art. 23-24)**
   - No human trafficking
   - No child labour in hazardous work (below 14 years)

4. **Right to Freedom of Religion (Art. 25-28)**
   - Freedom of conscience and religion

5. **Cultural & Educational Rights (Art. 29-30)**
   - Minorities can establish educational institutions

6. **Right to Constitutional Remedies (Art. 32)**
   - Right to approach Supreme Court if fundamental rights violated
   - Called the "Heart and Soul" of Constitution (Dr. Ambedkar)

**Writs Available:**
- **Habeas Corpus** – Illegal detention
- **Mandamus** – Government to perform duty
- **Prohibition** – Stop lower court exceeding jurisdiction
- **Certiorari** – Quash lower court order
- **Quo Warranto** – Challenge appointment to public office

**File PIL (Public Interest Litigation):** Any citizen can file in High Court/Supreme Court for public interest`
  },
  criminal: {
    keywords: ['fir', 'police', 'arrest', 'bail', 'crime', 'theft', 'assault', 'murder', 'accused', 'charge sheet', 'ipc', 'crpc', 'complainant', 'victim'],
    response: `**Criminal Law in India – BNS, BNSS & BSA (2023 Codes):**

*Note: India replaced IPC, CrPC & Evidence Act with Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS) & Bharatiya Sakshya Adhiniyam (BSA) effective July 1, 2024.*

**Filing an FIR:**
- Any person can file FIR at any police station (Section 173 BNSS)
- Police **cannot refuse** to register FIR for cognizable offence
- If refused, send complaint by post to SP/Commissioner
- Or approach Magistrate under Sec 175 BNSS

**Rights of an Arrested Person:**
1. Right to know grounds of arrest
2. Right to bail (in bailable offences)
3. Right to consult a lawyer of choice
4. Must be produced before Magistrate within **24 hours**
5. Right against self-incrimination

**Bail:**
- **Bailable offence** – Bail is a right; police/magistrate must grant
- **Non-bailable offence** – Bail is discretionary; apply to Magistrate/Sessions Court
- **Anticipatory Bail** – Apply to Sessions Court/High Court before arrest

**For Victims:**
- **Zero FIR** – File at any police station regardless of jurisdiction
- **Compensation** – Victim compensation scheme under BNSS
- **Witness Protection** – Available in serious cases

**Law References:** BNS 2023, BNSS 2023, BSA 2023`
  },
  family: {
    keywords: ['divorce', 'marriage', 'custody', 'maintenance', 'alimony', 'child', 'adoption', 'domestic violence', 'dowry', 'wife', 'husband', 'family'],
    response: `**Family Laws in India:**

**1. Marriage**
- **Hindu Marriage Act, 1955** – Hindus, Buddhists, Jains, Sikhs
- **Special Marriage Act, 1954** – Inter-religion/civil marriages
- **Muslim Personal Law** – For Muslims
- Minimum age: 21 (male), 18 (female)

**2. Divorce**
- Grounds: Adultery, cruelty, desertion (2 years), mental illness, conversion
- **Mutual Consent Divorce** – After 6 months of separation
- Hindu: Under HMA 1955; Muslim: Talaq, Khula; Christian: Indian Divorce Act

**3. Maintenance/Alimony**
- **Section 125 CrPC (now BNSS)** – Applies to all religions
- Wife, children, parents can claim maintenance
- Court decides based on spouse's income and standard of living

**4. Child Custody**
- Best interest of child is paramount principle
- Mother usually gets custody of young children
- Father/Mother can apply for visitation rights

**5. Domestic Violence**
- **Protection of Women from DV Act, 2005**
- Covers physical, emotional, verbal, sexual, economic abuse
- Can get Protection Order, Residence Order & Monetary Relief

**6. Dowry**
- **Dowry Prohibition Act, 1961** – Giving/taking dowry is illegal
- IPC 498A (now BNS) – Cruelty by husband/in-laws
- Dowry death – BNS Section 80`
  }
};

// Detect legal category from query
function detectLegalCategory(query) {
  const q = query.toLowerCase();

  if (/consumer|refund|defect|product|service quality|seller|buyer|purchase|warranty/.test(q)) {
    return 'consumer_rights';
  }
  if (/property|land|house|flat|apartment|registry|tenant|landlord|rent|rera|builder/.test(q)) return 'property_law';
  if (/employ|salary|wages|fired|terminat|gratuity|pf|provident|esi|leave|maternity|labor|labour/.test(q)) return 'labor_law';
  if (/cyber|hack|online fraud|phishing|data breach|cybercrime|identity theft|internet/.test(q)) return 'cyber_law';
  if (/constitution|fundamental rights|article|freedom|equality|pil|writ|parliament/.test(q)) return 'constitutional_rights';
  if (/fir|police|arrest|bail|crime|theft|assault|murder|accused|bns|ipc|crpc/.test(q)) return 'criminal_law';
  if (/divorce|marriage|custody|maintenance|alimony|domestic violence|dowry|family/.test(q)) return 'family_law';

  return 'general';
}

// Map full category names to knowledge base keys
const CATEGORY_TO_KB = {
  consumer_rights: 'consumer_rights',
  property_law: 'property',
  labor_law: 'labor',
  cyber_law: 'cyber',
  constitutional_rights: 'constitutional',
  criminal_law: 'criminal',
  family_law: 'family',
  general: null
};

// Get knowledge base response for fallback
function getKnowledgeBaseResponse(query, category) {
  const kbKey = CATEGORY_TO_KB[category];
  if (kbKey && LEGAL_KNOWLEDGE_BASE[kbKey]) {
    return LEGAL_KNOWLEDGE_BASE[kbKey].response;
  }

  // Try keyword matching across all categories
  const q = query.toLowerCase();
  for (const [key, value] of Object.entries(LEGAL_KNOWLEDGE_BASE)) {
    if (value.keywords && value.keywords.some(kw => q.includes(kw))) {
      return value.response;
    }
  }

  return null;
}

// Main AI response generator
async function generateLegalResponse(userMessage, conversationHistory = [], userId = null) {
  const category = detectLegalCategory(userMessage);

  // Build system prompt for Indian legal context
  const systemPrompt = `You are VakilAI, an expert AI legal advisor specializing in Indian law. You provide clear, accurate, and helpful legal guidance to Indian citizens.

IMPORTANT GUIDELINES:
1. You ONLY answer questions related to Indian laws, regulations, and legal matters
2. Always cite relevant Indian laws, acts, and sections (e.g., Consumer Protection Act 2019, IPC, IT Act 2000)
3. Use simple, clear language – explain legal terms in plain English
4. Provide practical actionable steps users can take
5. Always mention relevant government portals/helplines where applicable
6. Include a brief disclaimer that this is informational guidance only, not formal legal advice
7. Structure responses with clear headings using **bold** formatting
8. For complex matters, recommend consulting a qualified advocate
9. Stay updated: India replaced IPC/CrPC with BNS/BNSS (effective July 1, 2024)
10. Be empathetic and supportive – legal issues cause stress

DETECTED LEGAL AREA: ${category}

If asked about non-Indian law topics, politely redirect to Indian legal context.
Always end responses with: "⚖️ *Disclaimer: This is informational guidance only and does not constitute formal legal advice. For serious legal matters, please consult a qualified advocate.*"`;

  // Build messages array with context memory
  const messages = [];

  // Add recent conversation history (last 10 messages for context)
  const recentHistory = conversationHistory.slice(-10);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role,
      content: msg.content
    });
  }

  // Add current message
  messages.push({ role: 'user', content: userMessage });

  // Try Groq if configured
  if (groqClient) {
    try {
      let augmentedSystemPrompt = systemPrompt;
      try {
        const relevantChunks = await retrieveRelevantChunks(userMessage);
        if (relevantChunks.length > 0) {
          const excerpts = relevantChunks
            .map(c => `- [${c.act}, ${c.section}] ${c.text}`)
            .join('\n');
          augmentedSystemPrompt += `\n\nRELEVANT LAW EXCERPTS (retrieved for this query — ground your answer in these where applicable, and cite the specific Act/Section):\n${excerpts}`;
        }
      } catch (ragError) {
        console.log('RAG retrieval skipped:', ragError.message);
      }

      const response = await groqClient.chat.completions.create({
        model: 'llama-3.1-8b-instant',  // ✅ Fixed: updated from decommissioned llama3-8b-8192
        messages: [
          { role: 'system', content: augmentedSystemPrompt },
          ...messages
        ],
        max_tokens: 1024,
        temperature: 0.3,
      });

      return {
        content: response.choices[0].message.content,
        category,
        source: 'groq'
      };
    } catch (error) {
      console.log('Groq error, falling back to knowledge base:', error.message);
    }
  }

  // Fallback to knowledge base
  const kbResponse = getKnowledgeBaseResponse(userMessage, category);

  if (kbResponse) {
    return {
      content: kbResponse + '\n\n⚖️ *Disclaimer: This is informational guidance only and does not constitute formal legal advice. For serious legal matters, please consult a qualified advocate.*',
      category,
      source: 'knowledge_base'
    };
  }

  // Generic response for unrecognized queries
  return {
    content: `I'm VakilAI, your Indian legal advisor. I can help you with:

**Areas I Cover:**
- 🛒 **Consumer Rights** – Refunds, defective products, e-commerce disputes
- 🏠 **Property Law** – Sale, registration, RERA, tenant/landlord issues
- 👷 **Labor Law** – PF, gratuity, wrongful termination, wages
- 💻 **Cyber Law** – Online fraud, hacking, data privacy
- ⚖️ **Constitutional Rights** – Fundamental rights, PILs, writs
- 🚔 **Criminal Law** – FIR, bail, rights of accused
- 👨‍👩‍👧 **Family Law** – Divorce, maintenance, custody, domestic violence

Please describe your legal issue in detail and I'll provide guidance based on relevant Indian laws.

⚖️ *Disclaimer: This is informational guidance only and does not constitute formal legal advice. For serious legal matters, please consult a qualified advocate.*`,
    category: 'general',
    source: 'default'
  };
}

module.exports = { generateLegalResponse, detectLegalCategory };