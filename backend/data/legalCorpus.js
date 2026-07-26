/**
 * Curated, section-level corpus of Indian legal provisions used for retrieval
 * (RAG) before calling the LLM. Each chunk is a self-contained, specific
 * provision — deliberately more granular than the category-level summaries
 * in services/aiService.js's LEGAL_KNOWLEDGE_BASE (which remains the
 * no-Groq fallback and is untouched by this corpus).
 */

const legalCorpus = [
  // ===== CONSUMER RIGHTS — Consumer Protection Act, 2019 =====
  {
    id: 'cp-1', category: 'consumer_rights', act: 'Consumer Protection Act, 2019', section: 'Section 2(9)',
    text: 'Section 2(9) of the Consumer Protection Act, 2019 defines six consumer rights: right to safety against hazardous goods/services, right to information about quality/quantity/price, right to choose among competitive options, right to be heard, right to seek redressal against unfair trade practices, and right to consumer education.'
  },
  {
    id: 'cp-2', category: 'consumer_rights', act: 'Consumer Protection Act, 2019', section: 'Sections 34-42',
    text: 'Sections 34-42 set up a three-tier Consumer Disputes Redressal Commission system: District Commission (claims up to Rs. 1 crore), State Commission (Rs. 1 crore to Rs. 10 crore), and National Commission (above Rs. 10 crore). Appeals move up the tiers, with a final appeal to the Supreme Court.'
  },
  {
    id: 'cp-3', category: 'consumer_rights', act: 'Consumer Protection Act, 2019', section: 'Section 69',
    text: 'Section 69 sets a limitation period of two years from the date the cause of action arose for filing a consumer complaint. The Commission may condone delay if the complainant shows sufficient cause, but complaints should ordinarily be filed promptly with all receipts and evidence preserved.'
  },
  {
    id: 'cp-4', category: 'consumer_rights', act: 'Consumer Protection (E-Commerce) Rules, 2020', section: 'Rule 5',
    text: 'The E-Commerce Rules, 2020 (framed under the 2019 Act) require e-commerce entities to appoint a grievance officer, acknowledge complaints within 48 hours, and resolve them within one month. Marketplaces must also display seller details, country of origin, and cannot engage in flash sales that limit consumer choice unfairly.'
  },
  {
    id: 'cp-5', category: 'consumer_rights', act: 'Consumer Protection Act, 2019', section: 'Section 17-21 (CCPA)',
    text: 'Sections 17-21 establish the Central Consumer Protection Authority (CCPA), empowered to investigate unfair trade practices and misleading advertisements on its own or on complaint, order recall of unsafe goods/services, and impose penalties up to Rs. 10 lakh (up to Rs. 50 lakh for repeat offences) on manufacturers or endorsers.'
  },
  {
    id: 'cp-6', category: 'consumer_rights', act: 'Consumer Protection Act, 2019', section: 'Sections 82-87 (Product Liability)',
    text: 'Chapter VI (Sections 82-87) introduces product liability: a manufacturer, seller, or service provider can be held liable for harm caused by a defective product or deficient service, including manufacturing defects, design defects, or inadequate warnings/instructions, even without proving negligence in some cases.'
  },

  // ===== PROPERTY LAW =====
  {
    id: 'pl-1', category: 'property_law', act: 'Transfer of Property Act, 1882', section: 'Section 54',
    text: 'Section 54 defines "sale" as a transfer of ownership for a price. For tangible immovable property worth Rs. 100 or more, the sale can be made only by a registered instrument — an unregistered sale deed does not legally transfer ownership, even if possession and payment have occurred.'
  },
  {
    id: 'pl-2', category: 'property_law', act: 'Registration Act, 1908', section: 'Sections 17 & 23',
    text: 'Section 17 makes registration of documents transferring immovable property compulsory. Section 23 requires the document to be presented for registration within four months of its execution (extendable by a further four months on payment of a fine), failing which registration cannot be validly done.'
  },
  {
    id: 'pl-3', category: 'property_law', act: 'Real Estate (Regulation and Development) Act, 2016', section: 'Section 18',
    text: 'Section 18 of RERA entitles a homebuyer to interest (at the rate prescribed, linked to SBI\'s highest MCLR + 2%) for every month of delay if a builder fails to hand over possession as per the agreement, or to a full refund with interest and compensation if the buyer withdraws from the project.'
  },
  {
    id: 'pl-4', category: 'property_law', act: 'Real Estate (Regulation and Development) Act, 2016', section: 'Section 14(3)',
    text: 'Section 14(3) makes the builder liable, without further charge, to rectify structural defects or defects in workmanship/quality brought to notice within five years of possession, and to compensate the buyer if the defect is not rectified within a reasonable time.'
  },
  {
    id: 'pl-5', category: 'property_law', act: 'Hindu Succession Act, 1956 (as amended 2005)', section: 'Section 6',
    text: 'Section 6, as amended in 2005, gives daughters equal coparcenary rights in ancestral Hindu joint family property — the same rights and liabilities as sons — by birth, regardless of whether the father was alive on the date the amendment came into force (subject to Supreme Court clarifications on partitions before 2005).'
  },
  {
    id: 'pl-6', category: 'property_law', act: 'State Rent Control Acts (e.g. Delhi Rent Control Act, 1958)', section: 'Eviction grounds',
    text: 'Rent control legislation (state-specific) permits eviction of a tenant only on specified grounds such as non-payment of rent, subletting without consent, misuse of premises, or the landlord\'s bona fide requirement — and only after due notice and, in contested cases, an order from the Rent Controller or civil court, not by the landlord\'s own action.'
  },

  // ===== LABOR LAW =====
  {
    id: 'll-1', category: 'labor_law', act: 'Employees\' Provident Funds & Miscellaneous Provisions Act, 1952', section: 'Section 6',
    text: 'Section 6 mandates that in covered establishments (20+ employees), the employer must contribute 12% of the employee\'s basic wages plus dearness allowance to the Provident Fund, matched by an equal 12% employee contribution (of which 8.33% of the employer\'s share goes to the Employees\' Pension Scheme).'
  },
  {
    id: 'll-2', category: 'labor_law', act: 'Payment of Gratuity Act, 1972', section: 'Section 4',
    text: 'Section 4 entitles an employee to gratuity after rendering continuous service of at least five years, calculated as (last drawn salary x 15 x number of years of service) / 26, payable within 30 days of it becoming due, and tax-free up to Rs. 20 lakh for private-sector employees.'
  },
  {
    id: 'll-3', category: 'labor_law', act: 'Maternity Benefit Act, 1961 (amended 2017)', section: 'Section 5',
    text: 'Section 5 entitles a woman employee to 26 weeks of paid maternity leave for her first two children (12 weeks for the third child onwards), and prohibits her dismissal or discharge during the period of such leave.'
  },
  {
    id: 'll-4', category: 'labor_law', act: 'Code on Wages, 2019', section: 'Section 17',
    text: 'Section 17 requires wages to be paid within a prescribed period — by the 7th of the following month for establishments with under 1000 employees, or the 10th for larger ones — and mandates payment through bank transfer, cheque, or electronic mode above a notified wage threshold.'
  },
  {
    id: 'll-5', category: 'labor_law', act: 'Sexual Harassment of Women at Workplace (POSH) Act, 2013', section: 'Section 4',
    text: 'Section 4 mandates every employer with 10 or more employees to constitute an Internal Committee to receive and inquire into complaints of sexual harassment at the workplace, with the inquiry to be completed within 90 days and action taken within 60 days of the report.'
  },
  {
    id: 'll-6', category: 'labor_law', act: 'Industrial Disputes Act, 1947 / Code on Industrial Relations, 2020', section: 'Retrenchment notice',
    text: 'An employer must ordinarily give an employee at least one month\'s notice (or wages in lieu) before termination or retrenchment, along with retrenchment compensation, and follow "last in, first out" principles for workmen retrenchment absent a valid reason to depart from it.'
  },

  // ===== CYBER LAW =====
  {
    id: 'cl-1', category: 'cyber_law', act: 'Information Technology Act, 2000', section: 'Section 66',
    text: 'Section 66 penalizes computer-related offences such as unauthorized access, hacking, or introducing viruses, with imprisonment up to three years, a fine up to Rs. 5 lakh, or both, where the act is done dishonestly or fraudulently as described under Section 43.'
  },
  {
    id: 'cl-2', category: 'cyber_law', act: 'Information Technology Act, 2000', section: 'Section 66C',
    text: 'Section 66C punishes identity theft — fraudulently or dishonestly using another person\'s electronic signature, password, or other unique identification feature — with imprisonment up to three years and a fine up to Rs. 1 lakh.'
  },
  {
    id: 'cl-3', category: 'cyber_law', act: 'Information Technology Act, 2000', section: 'Section 66D',
    text: 'Section 66D punishes cheating by personation using a computer resource or communication device (e.g. impersonation scams, fake profiles used to defraud) with imprisonment up to three years and a fine up to Rs. 1 lakh.'
  },
  {
    id: 'cl-4', category: 'cyber_law', act: 'Digital Personal Data Protection Act, 2023', section: 'Section 6-7',
    text: 'The DPDP Act, 2023 requires that personal data be processed only for a lawful purpose with the individual\'s free, specific, informed consent (or under specified "legitimate use" exceptions), and gives individuals the right to access, correct, and request erasure of their personal data held by a company.'
  },
  {
    id: 'cl-5', category: 'cyber_law', act: 'Information Technology Act, 2000', section: 'Section 43',
    text: 'Section 43 provides civil liability — compensation by way of damages — against anyone who without authorization accesses, downloads, introduces a virus into, or damages a computer, computer system, or network, independent of any criminal prosecution under Section 66.'
  },
  {
    id: 'cl-6', category: 'cyber_law', act: 'RBI Guidelines / IT Act practice', section: 'Golden Hour reporting',
    text: 'For online financial fraud, immediately calling the national Cyber Crime Helpline (1930) and the bank within the "Golden Hour" of the transaction significantly increases the chance of freezing/reversing the fraudulent transfer; RBI\'s limited-liability circular also caps a customer\'s liability if the fraud is reported within 3 working days of notification.'
  },

  // ===== CONSTITUTIONAL RIGHTS =====
  {
    id: 'cr-1', category: 'constitutional_rights', act: 'Constitution of India', section: 'Article 14',
    text: 'Article 14 guarantees equality before the law and equal protection of the laws to all persons (not just citizens) within India, prohibiting arbitrary discrimination while permitting reasonable classification that has a rational nexus to the object sought to be achieved.'
  },
  {
    id: 'cr-2', category: 'constitutional_rights', act: 'Constitution of India', section: 'Article 19',
    text: 'Article 19 guarantees six freedoms to citizens: speech and expression, peaceful assembly, forming associations, movement throughout India, residence anywhere in India, and practicing any profession or carrying on any occupation/trade/business — each subject to reasonable restrictions in the interest of public order, morality, sovereignty, etc.'
  },
  {
    id: 'cr-3', category: 'constitutional_rights', act: 'Constitution of India', section: 'Article 21',
    text: 'Article 21 guarantees the right to life and personal liberty, which courts have interpreted expansively over time to include the right to privacy, a clean environment, livelihood, health, education, a speedy trial, and dignity — making it one of the most litigated and broadly construed fundamental rights.'
  },
  {
    id: 'cr-4', category: 'constitutional_rights', act: 'Constitution of India', section: 'Article 32',
    text: 'Article 32 gives every person the right to directly approach the Supreme Court for enforcement of fundamental rights, and empowers the Court to issue writs — habeas corpus, mandamus, prohibition, certiorari, and quo warranto. Dr. Ambedkar described it as the "heart and soul" of the Constitution.'
  },
  {
    id: 'cr-5', category: 'constitutional_rights', act: 'Constitution of India', section: 'Article 226',
    text: 'Article 226 gives every High Court power to issue writs not only for enforcement of fundamental rights but also "for any other purpose" — a wider jurisdiction than Article 32 — making the High Court often the more practical first forum for constitutional and administrative-law grievances.'
  },
  {
    id: 'cr-6', category: 'constitutional_rights', act: 'Public Interest Litigation (judicial doctrine)', section: 'Locus standi relaxation',
    text: 'Through Public Interest Litigation, courts have relaxed the traditional requirement that only a directly affected person can sue — any public-spirited citizen or organisation can petition the High Court or Supreme Court (including by a simple letter in some cases) on behalf of those who cannot approach the court themselves.'
  },

  // ===== CRIMINAL LAW — BNS/BNSS/BSA 2023 (effective July 1, 2024) =====
  {
    id: 'crm-1', category: 'criminal_law', act: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023', section: 'Section 173',
    text: 'Section 173 BNSS (replacing CrPC Section 154) requires police to register an FIR for any information disclosing a cognizable offence; for certain offences it also allows preliminary inquiry (with senior officer approval) before registration where the case is unclear, but outright refusal to register a genuine cognizable-offence complaint is not permitted.'
  },
  {
    id: 'crm-2', category: 'criminal_law', act: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023', section: 'Section 58/187',
    text: 'BNSS requires an arrested person to be produced before the nearest Magistrate within 24 hours of arrest (excluding travel time), and mandates that the arrested person be informed of the grounds of arrest and their right to consult a lawyer of their choice.'
  },
  {
    id: 'crm-3', category: 'criminal_law', act: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023', section: 'Bail provisions',
    text: 'In a bailable offence, bail is a matter of right and must be granted by the police or magistrate on furnishing a bond. In a non-bailable offence, bail is discretionary and must be applied for before the Magistrate or Sessions Court; anticipatory bail (protection against arrest before it happens) can be sought from the Sessions Court or High Court.'
  },
  {
    id: 'crm-4', category: 'criminal_law', act: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023', section: 'Zero FIR',
    text: 'A "Zero FIR" can be filed at any police station regardless of where the offence occurred or which jurisdiction it falls under; the receiving station registers it with a temporary "zero" number and transfers it to the station with proper jurisdiction, ensuring no time is lost due to jurisdictional disputes, especially important in urgent cases like sexual assault.'
  },
  {
    id: 'crm-5', category: 'criminal_law', act: 'Bharatiya Nyaya Sanhita (BNS), 2023', section: 'Victim compensation',
    text: 'BNSS carries forward and strengthens the victim compensation scheme (originally under CrPC Section 357A) requiring every state to have a scheme to compensate victims of crime, particularly in cases where the offender is unidentified or unable to pay, or in cases of rape and acid attacks.'
  },
  {
    id: 'crm-6', category: 'criminal_law', act: 'Bharatiya Sakshya Adhiniyam (BSA), 2023', section: 'Electronic evidence',
    text: 'The BSA (replacing the Indian Evidence Act, 1872) expressly recognises electronic and digital records — including emails, server logs, and messages on communication devices — as admissible primary evidence, subject to a certificate establishing authenticity, reflecting the increasing role of digital evidence in prosecutions.'
  },

  // ===== FAMILY LAW =====
  {
    id: 'fl-1', category: 'family_law', act: 'Hindu Marriage Act, 1955', section: 'Section 13',
    text: 'Section 13 lists grounds on which either spouse may seek divorce: adultery, cruelty, desertion for two continuous years, conversion to another religion, unsoundness of mind, and other specified grounds — with additional grounds (e.g. non-resumption of cohabitation after judicial separation) available to a wife specifically.'
  },
  {
    id: 'fl-2', category: 'family_law', act: 'Hindu Marriage Act, 1955', section: 'Section 13B',
    text: 'Section 13B allows divorce by mutual consent where the parties have lived separately for at least one year and agree they cannot live together; a cooling-off period of six months between the first and second motion applies, though the Supreme Court has held courts may waive this period in appropriate cases.'
  },
  {
    id: 'fl-3', category: 'family_law', act: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023', section: 'Section 144 (maintenance)',
    text: 'This provision (continuing the earlier CrPC Section 125 scheme) allows a wife, children, or aged/infirm parents unable to maintain themselves to claim monthly maintenance from a person of adequate means, regardless of religion, decided by the Magistrate based on the paying spouse\'s income and the applicant\'s standard of living.'
  },
  {
    id: 'fl-4', category: 'family_law', act: 'Protection of Women from Domestic Violence Act, 2005', section: 'Sections 12, 18-20',
    text: 'An aggrieved woman can apply to a Magistrate under Section 12 for reliefs including a Protection Order (Section 18, restraining the abuser from further violence or contact), a Residence Order (Section 19, right to remain in the shared household), and Monetary Relief (Section 20, covering medical expenses, loss of earnings, and maintenance).'
  },
  {
    id: 'fl-5', category: 'family_law', act: 'Dowry Prohibition Act, 1961', section: 'Sections 3-4',
    text: 'Section 3 penalizes giving or taking dowry with imprisonment of at least five years and a fine of at least Rs. 15,000 or the value of the dowry, whichever is higher. Section 4 separately penalizes demanding dowry (even if none is actually given) with imprisonment up to two years and a fine.'
  },
  {
    id: 'fl-6', category: 'family_law', act: 'Hindu Marriage Act, 1955', section: 'Section 24',
    text: 'Section 24 allows either spouse, if they lack sufficient independent income to support themselves and the litigation, to apply for interim maintenance (maintenance pendente lite) and litigation expenses from the other spouse while divorce or matrimonial proceedings are ongoing.'
  },
];

module.exports = legalCorpus;
