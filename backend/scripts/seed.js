/**
 * Seed script – populates LegalTopics collection with Indian law reference data
 * Run: node scripts/seed.js
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/law_advisor';

const legalTopicSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  lawReference: { type: String, required: true },
  keyPoints: [String],
  keywords: [{ type: String, lowercase: true }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const LegalTopic = mongoose.model('LegalTopic', legalTopicSchema);

const SEED_DATA = [
  {
    topic: 'Consumer Protection Rights',
    category: 'consumer_rights',
    description: 'Rights of consumers under Consumer Protection Act, 2019 – covers product defects, service deficiencies, unfair trade practices, and e-commerce disputes.',
    lawReference: 'Consumer Protection Act, 2019',
    keyPoints: [
      'Right to Safety – Protection from hazardous goods',
      'Right to Information – Know quality, quantity and price',
      'Right to Redressal – Compensation via Consumer Forums',
      'District Commission – Claims up to ₹1 crore',
      'File online: edaakhil.nic.in | Helpline: 1915'
    ],
    keywords: ['consumer', 'refund', 'defective product', 'misleading advertisement', 'unfair trade practice', 'e-commerce', 'amazon', 'flipkart']
  },
  {
    topic: 'Property Registration & Transfer',
    category: 'property_law',
    description: 'Laws governing sale, purchase, registration and transfer of immovable property in India.',
    lawReference: 'Transfer of Property Act 1882, Registration Act 1908',
    keyPoints: [
      'Mandatory registration under Registration Act 1908',
      'Sale deed must be on stamp paper (state-specific duty)',
      'Registration within 4 months of execution',
      'Title verification via encumbrance certificate',
      'Power of Attorney for NRI property transactions'
    ],
    keywords: ['property', 'sale deed', 'registry', 'stamp duty', 'title', 'land registration', 'immovable property']
  },
  {
    topic: 'RERA – Real Estate Regulation',
    category: 'property_law',
    description: 'Protection for homebuyers against builder delays, quality defects and fund diversion under RERA 2016.',
    lawReference: 'Real Estate (Regulation and Development) Act, 2016',
    keyPoints: [
      'Builder must register project with state RERA authority',
      'Delay in possession → interest @ SBI MCLR + 2%',
      'Structural defects within 5 years – builder must rectify',
      'File complaints at state RERA portal',
      'Homebuyer can withdraw investment with interest if aggrieved'
    ],
    keywords: ['builder', 'flat', 'apartment', 'rera', 'possession delay', 'real estate', 'housing project', 'homebuyer']
  },
  {
    topic: 'Employee Provident Fund (EPF)',
    category: 'labor_law',
    description: 'Mandatory retirement savings scheme for employees in establishments with 20+ employees.',
    lawReference: 'Employees Provident Fund & Miscellaneous Provisions Act, 1952',
    keyPoints: [
      'Employee: 12% of basic salary; Employer: 12% (8.33% to EPS, 3.67% to EPF)',
      'UAN number – universal account for PF portability',
      'Withdraw after 2 months of unemployment',
      'Grievance: epfigms.epfindia.gov.in',
      'Employer non-deposit is a criminal offence'
    ],
    keywords: ['pf', 'provident fund', 'epf', 'uan', 'retirement savings', 'employer contribution', 'pf withdrawal']
  },
  {
    topic: 'Gratuity Rights',
    category: 'labor_law',
    description: 'Retirement benefit payable after 5 years of continuous service under Payment of Gratuity Act.',
    lawReference: 'Payment of Gratuity Act, 1972',
    keyPoints: [
      'Eligible after 5 years continuous service',
      'Formula: (Last drawn salary × 15 × Years) ÷ 26',
      'Max gratuity: ₹20 lakhs',
      'Must be paid within 30 days of leaving service',
      'Tax-free up to ₹20 lakhs for private employees'
    ],
    keywords: ['gratuity', 'retirement benefit', 'long service', 'severance', '5 years service']
  },
  {
    topic: 'Maternity Benefits',
    category: 'labor_law',
    description: 'Paid maternity leave and protection for working women under Maternity Benefit Act.',
    lawReference: 'Maternity Benefit Act, 1961 (amended 2017)',
    keyPoints: [
      '26 weeks paid leave for first 2 children',
      '12 weeks for 3rd child onwards',
      'Crèche facility mandatory in establishments with 50+ employees',
      'Cannot be dismissed during maternity leave',
      'Work from home option post maternity leave'
    ],
    keywords: ['maternity leave', 'pregnancy', 'working mother', 'maternity benefit', 'crèche', 'delivery leave']
  },
  {
    topic: 'IT Act & Cyber Crimes',
    category: 'cyber_law',
    description: 'Digital offences, penalties and remedies under Information Technology Act 2000 and DPDP Act 2023.',
    lawReference: 'IT Act 2000, IT Amendment Act 2008, Digital Personal Data Protection Act 2023',
    keyPoints: [
      'Hacking (Sec 66): Up to 3 years + ₹5 lakh fine',
      'Identity theft (Sec 66C): Up to 3 years + ₹1 lakh fine',
      'Cyber stalking / harassment – IT Act + BNS provisions',
      'Report at cybercrime.gov.in | Helpline: 1930',
      'Report financial fraud within "Golden Hour" to bank'
    ],
    keywords: ['hacking', 'cyber fraud', 'data breach', 'online scam', 'phishing', 'cybercrime', 'identity theft', 'online harassment']
  },
  {
    topic: 'Fundamental Rights – Indian Constitution',
    category: 'constitutional_rights',
    description: 'Basic rights guaranteed to all Indian citizens under Part III (Articles 12-35) of the Constitution.',
    lawReference: 'Constitution of India, Part III (Articles 12-35)',
    keyPoints: [
      'Art. 14 – Equality before law',
      'Art. 19 – Freedom of speech, movement, profession',
      'Art. 21 – Right to life and personal liberty (broadest right)',
      'Art. 32 – Right to approach Supreme Court (Heart of Constitution)',
      'Writs: Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo Warranto'
    ],
    keywords: ['fundamental rights', 'equality', 'freedom', 'article 19', 'article 21', 'right to life', 'habeas corpus', 'pil']
  },
  {
    topic: 'FIR & Criminal Procedure (BNSS 2023)',
    category: 'criminal_law',
    description: 'Rights, procedures and remedies under Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023, replacing CrPC.',
    lawReference: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 (effective July 1, 2024)',
    keyPoints: [
      'Police cannot refuse to register FIR for cognizable offence',
      'Zero FIR – file at any police station regardless of jurisdiction',
      'Arrested person must be produced before Magistrate within 24 hours',
      'Right to know grounds of arrest and consult lawyer',
      'If police refuses FIR – approach Superintendent of Police or Magistrate'
    ],
    keywords: ['fir', 'police complaint', 'arrest', 'bail', 'zero fir', 'cognizable offence', 'bnss', 'crpc', 'magistrate']
  },
  {
    topic: 'Domestic Violence Protection',
    category: 'family_law',
    description: 'Comprehensive protection for women against physical, emotional, economic and sexual abuse.',
    lawReference: 'Protection of Women from Domestic Violence Act, 2005',
    keyPoints: [
      'Covers physical, emotional, verbal, sexual and economic abuse',
      'Can apply for Protection Order (stops abuser from contacting)',
      'Residence Order (right to live in shared household)',
      'Monetary Relief for medical expenses, loss of earnings',
      'File complaint with Protection Officer or Police Station'
    ],
    keywords: ['domestic violence', 'abuse', 'husband', 'in-laws', 'protection order', 'residence order', 'emotional abuse', 'economic abuse']
  },
  {
    topic: 'Hindu Divorce Laws',
    category: 'family_law',
    description: 'Grounds for divorce, mutual consent procedure and rights under Hindu Marriage Act 1955.',
    lawReference: 'Hindu Marriage Act, 1955',
    keyPoints: [
      'Grounds: Cruelty, adultery, desertion (2 years), mental disorder, leprosy, conversion',
      'Mutual consent divorce after 6-month separation',
      'Interim maintenance pendente lite during proceedings',
      'Permanent alimony based on income and standard of living',
      'Irretrievable breakdown ground added by Supreme Court'
    ],
    keywords: ['divorce', 'separation', 'alimony', 'maintenance', 'mutual consent', 'cruelty', 'Hindu marriage', 'matrimonial']
  },
  {
    topic: 'Child Custody Laws',
    category: 'family_law',
    description: 'Legal principles and procedures for child custody and visitation rights in India.',
    lawReference: 'Hindu Minority and Guardianship Act 1956, Guardians and Wards Act 1890',
    keyPoints: [
      'Best interest of child is paramount consideration',
      'Mother usually gets custody of children below 5 years',
      'Father is natural guardian of minor sons and unmarried daughters',
      'Non-custodial parent has visitation rights',
      'Joint custody possible by mutual agreement'
    ],
    keywords: ['child custody', 'visitation rights', 'guardianship', 'minor child', 'custody battle', 'parental rights']
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await LegalTopic.deleteMany({});
    console.log('🗑  Cleared existing legal topics');

    // Insert seed data
    const inserted = await LegalTopic.insertMany(SEED_DATA);
    console.log(`✅ Seeded ${inserted.length} legal topics`);

    console.log('\nTopics seeded:');
    inserted.forEach(t => console.log(`  • ${t.topic} (${t.category})`));

  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Done. Database connection closed.');
  }
}

seed();
