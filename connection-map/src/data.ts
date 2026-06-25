// ── Types ──────────────────────────────────────────────────────────────────

export type Role = {
  id: string
  title: string
  url?: string
  track: 'Growth' | 'Product' | 'Other'
  eligible: boolean
}

export type Company = {
  id: string
  name: string
  tier: 'S' | 'A'
  roles: Role[]
  applicationDeadline?: string
  notes?: string
}

export type Person = {
  id: string
  name: string
  currentCompany?: string
  role?: string
  previousCompanies?: string[]
  university?: string
  howWeMet?: string
  backlinks?: { label: string; url: string }[]
}

export type Connection = {
  id: string
  personId: string
  companyId: string
  relationship: string
}

export type AppData = {
  companies: Company[]
  people: Person[]
  connections: Connection[]
}

// ── Seed companies ──────────────────────────────────────────────────────────

const CAREERS = {
  openai: 'https://openai.com/careers',
  anthropic: 'https://anthropic.com/careers',
  google: 'https://careers.google.com',
  meta: 'https://metacareers.com',
  microsoft: 'https://careers.microsoft.com',
  amazon: 'https://amazon.jobs',
  apple: 'https://apple.com/careers',
  stripe: 'https://stripe.com/jobs',
  nvidia: 'https://nvidia.com/en-us/about-nvidia/careers/',
  elevenlabs: 'https://jobs.elevenlabs.io',
  perplexity: 'https://jobs.ashbyhq.com/perplexity-ai',
  figma: 'https://figma.com/careers',
  salesforce: 'https://careers.salesforce.com',
  intuit: 'https://jobs.intuit.com',
  coinbase: 'https://coinbase.com/careers',
  cursor: 'https://anysphere.inc',
  adobe: 'https://adobe.com/careers',
  ramp: 'https://ramp.com/careers',
}

export const defaultData: AppData = {
  companies: [
    // ── S-tier ──────────────────────────────────────────────────────────
    {
      id: 'c-openai',
      name: 'OpenAI',
      tier: 'S',
      roles: [
        { id: 'r-openai-1', title: 'Product Manager', url: CAREERS.openai, track: 'Product', eligible: true },
        { id: 'r-openai-2', title: 'Growth PM', url: CAREERS.openai, track: 'Growth', eligible: true },
      ],
      notes: 'GTM/BD/Product teams. Know Arielle (Marketing) and Karen (PR).',
    },
    {
      id: 'c-anthropic',
      name: 'Anthropic',
      tier: 'S',
      roles: [
        { id: 'r-anthropic-1', title: 'Product Manager', url: CAREERS.anthropic, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-google',
      name: 'Google',
      tier: 'S',
      roles: [
        { id: 'r-google-1', title: 'Associate Product Manager', url: CAREERS.google, track: 'Product', eligible: true },
        { id: 'r-google-2', title: 'Growth PM', url: CAREERS.google, track: 'Growth', eligible: true },
      ],
      notes: 'Strong APM program. Multiple warm connections via David Krane, Cheveene, Ari Troper.',
    },
    {
      id: 'c-meta',
      name: 'Meta',
      tier: 'S',
      roles: [
        { id: 'r-meta-1', title: 'Rotational Product Manager (RPM)', url: CAREERS.meta, track: 'Product', eligible: true },
      ],
      notes: 'Mani Dhillon was Senior PM at Meta — strong connection.',
    },
    {
      id: 'c-microsoft',
      name: 'Microsoft',
      tier: 'S',
      roles: [
        { id: 'r-microsoft-1', title: 'Product Manager', url: CAREERS.microsoft, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-amazon',
      name: 'Amazon',
      tier: 'S',
      roles: [
        { id: 'r-amazon-1', title: 'Product Manager', url: CAREERS.amazon, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-apple',
      name: 'Apple',
      tier: 'S',
      roles: [
        { id: 'r-apple-1', title: 'Product Manager', url: CAREERS.apple, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-stripe',
      name: 'Stripe',
      tier: 'S',
      roles: [
        { id: 'r-stripe-1', title: 'Associate Product Manager', url: CAREERS.stripe, track: 'Product', eligible: true },
        { id: 'r-stripe-2', title: 'Product Manager, Payments', url: CAREERS.stripe, track: 'Product', eligible: true },
      ],
      notes: 'Has APM program. Heather Friedland knows a VP there.',
    },
    {
      id: 'c-nvidia',
      name: 'NVIDIA',
      tier: 'S',
      roles: [
        { id: 'r-nvidia-1', title: 'Product Manager', url: CAREERS.nvidia, track: 'Product', eligible: true },
      ],
    },
    // ── A-tier ──────────────────────────────────────────────────────────
    {
      id: 'c-elevenlabs',
      name: 'Eleven Labs',
      tier: 'A',
      roles: [
        { id: 'r-elevenlabs-1', title: 'Product Manager', url: CAREERS.elevenlabs, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-perplexity',
      name: 'Perplexity',
      tier: 'A',
      roles: [
        { id: 'r-perplexity-1', title: 'Product Manager, Growth', url: CAREERS.perplexity, track: 'Growth', eligible: true },
      ],
    },
    {
      id: 'c-figma',
      name: 'Figma',
      tier: 'A',
      roles: [
        { id: 'r-figma-1', title: 'Growth PM — Activation', url: CAREERS.figma, track: 'Growth', eligible: true },
        { id: 'r-figma-2', title: 'Product Manager', url: CAREERS.figma, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-salesforce',
      name: 'Salesforce',
      tier: 'A',
      roles: [
        { id: 'r-salesforce-1', title: 'Associate Product Manager', url: CAREERS.salesforce, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-intuit',
      name: 'Intuit',
      tier: 'A',
      roles: [
        { id: 'r-intuit-1', title: 'Associate Product Manager (APM)', url: CAREERS.intuit, track: 'Product', eligible: true },
      ],
      notes: 'Has APM program for new grads. Mani Dhillon is VP Product here.',
    },
    {
      id: 'c-coinbase',
      name: 'Coinbase',
      tier: 'A',
      roles: [
        { id: 'r-coinbase-1', title: 'Product Manager', url: CAREERS.coinbase, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-cursor',
      name: 'Cursor',
      tier: 'A',
      roles: [
        { id: 'r-cursor-1', title: 'Product Manager', url: CAREERS.cursor, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-adobe',
      name: 'Adobe',
      tier: 'A',
      roles: [
        { id: 'r-adobe-1', title: 'Product Manager', url: CAREERS.adobe, track: 'Product', eligible: true },
      ],
    },
    {
      id: 'c-ramp',
      name: 'Ramp',
      tier: 'A',
      roles: [
        { id: 'r-ramp-1', title: 'Product Manager', url: CAREERS.ramp, track: 'Product', eligible: true },
      ],
      notes: 'Omri, Amnon, and Alex are all currently at Ramp.',
    },
  ],

  people: [
    {
      id: 'p-amir',
      name: 'Amir Konigsberg',
      university: 'Columbia',
      howWeMet: 'Chabad / network',
    },
    {
      id: 'p-joey',
      name: 'Joey Zwillinger',
      howWeMet: 'Network — introduced me to Shopify (not in target list)',
    },
    {
      id: 'p-arielle',
      name: 'Arielle Mokhtazarian',
      currentCompany: 'OpenAI',
      role: 'Marketing',
      howWeMet: 'Chabad / network',
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-karen',
      name: 'Karen Toro',
      currentCompany: 'OpenAI',
      role: 'Public Relations',
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-cheveene',
      name: 'Cheveene',
      currentCompany: 'Google',
      role: 'Wojcicki Family Philanthropy',
      howWeMet: 'Connected me to Ari Troper',
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-aritroper',
      name: 'Ari Troper',
      currentCompany: 'Google',
      role: 'Software Engineer, DeepMind',
      howWeMet: 'Cheveene connection — son of senior Google engineer',
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-davidkrane',
      name: 'David Krane',
      currentCompany: 'Google',
      role: 'CEO, Google Ventures',
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-arikrane',
      name: 'Ari Krane',
      currentCompany: 'Google',
      role: 'Student / Intern',
      howWeMet: "David Krane's son",
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-heather',
      name: 'Heather Friedland',
      currentCompany: 'Poshmark',
      role: 'Chief Product Officer',
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-mani',
      name: 'Mani Dhillon',
      currentCompany: 'Intuit',
      role: 'VP Product',
      previousCompanies: ['Meta'],
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-omri',
      name: 'Omri Remez',
      currentCompany: 'Ramp',
      role: 'Business Development',
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-amnon',
      name: 'Amnon Scharia',
      currentCompany: 'Ramp',
      role: 'Business Development',
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
    {
      id: 'p-alexg',
      name: 'Alex Goddjin',
      currentCompany: 'Ramp',
      role: 'Product Manager (Internal AI)',
      backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
    },
  ],

  connections: [
    {
      id: 'e-arielle-openai',
      personId: 'p-arielle',
      companyId: 'c-openai',
      relationship: 'Marketing at OpenAI — can connect to GTM/BD/Product teams',
    },
    {
      id: 'e-karen-openai',
      personId: 'p-karen',
      companyId: 'c-openai',
      relationship: 'Public Relations at OpenAI',
    },
    {
      id: 'e-cheveene-google',
      personId: 'p-cheveene',
      companyId: 'c-google',
      relationship: 'Google employee — Wojcicki Family Philanthropy',
    },
    {
      id: 'e-aritroper-google',
      personId: 'p-aritroper',
      companyId: 'c-google',
      relationship: 'SWE at DeepMind/Google — strong internal network',
    },
    {
      id: 'e-davidkrane-google',
      personId: 'p-davidkrane',
      companyId: 'c-google',
      relationship: 'CEO of Google Ventures — senior Google insider',
    },
    {
      id: 'e-arikrane-google',
      personId: 'p-arikrane',
      companyId: 'c-google',
      relationship: "David Krane's son — Google connection",
    },
    {
      id: 'e-heather-stripe',
      personId: 'p-heather',
      companyId: 'c-stripe',
      relationship: 'Knows a VP at Stripe; Stripe has APM program',
    },
    {
      id: 'e-mani-meta',
      personId: 'p-mani',
      companyId: 'c-meta',
      relationship: 'Former Senior PM at Meta',
    },
    {
      id: 'e-mani-intuit',
      personId: 'p-mani',
      companyId: 'c-intuit',
      relationship: 'VP Product at Intuit — direct hiring manager network',
    },
    {
      id: 'e-omri-ramp',
      personId: 'p-omri',
      companyId: 'c-ramp',
      relationship: 'Business Development at Ramp',
    },
    {
      id: 'e-amnon-ramp',
      personId: 'p-amnon',
      companyId: 'c-ramp',
      relationship: 'Business Development at Ramp',
    },
    {
      id: 'e-alexg-ramp',
      personId: 'p-alexg',
      companyId: 'c-ramp',
      relationship: 'PM (Internal AI) at Ramp — product team connection',
    },
  ],
}

// ── Default node positions ──────────────────────────────────────────────────
// Tier rows: S=y:60, A=y:300 | People rows: y:560, y:740

const SY = 60
const AY = 300
const PY1 = 560
const PY2 = 740
const CX = 230 // company column spacing
const PX = 250 // person column spacing

export const defaultPositions: Record<string, { x: number; y: number }> = {
  // S-tier
  'c-openai':     { x: 20 + 0 * CX, y: SY },
  'c-anthropic':  { x: 20 + 1 * CX, y: SY },
  'c-google':     { x: 20 + 2 * CX, y: SY },
  'c-meta':       { x: 20 + 3 * CX, y: SY },
  'c-microsoft':  { x: 20 + 4 * CX, y: SY },
  'c-amazon':     { x: 20 + 5 * CX, y: SY },
  'c-apple':      { x: 20 + 6 * CX, y: SY },
  'c-stripe':     { x: 20 + 7 * CX, y: SY },
  'c-nvidia':     { x: 20 + 8 * CX, y: SY },
  // A-tier
  'c-elevenlabs': { x: 20 + 0 * CX, y: AY },
  'c-perplexity': { x: 20 + 1 * CX, y: AY },
  'c-figma':      { x: 20 + 2 * CX, y: AY },
  'c-salesforce': { x: 20 + 3 * CX, y: AY },
  'c-intuit':     { x: 20 + 4 * CX, y: AY },
  'c-coinbase':   { x: 20 + 5 * CX, y: AY },
  'c-cursor':     { x: 20 + 6 * CX, y: AY },
  'c-adobe':      { x: 20 + 7 * CX, y: AY },
  'c-ramp':       { x: 20 + 8 * CX, y: AY },
  // People row 1
  'p-amir':       { x: 20 + 0 * PX, y: PY1 },
  'p-joey':       { x: 20 + 1 * PX, y: PY1 },
  'p-arielle':    { x: 20 + 2 * PX, y: PY1 },
  'p-karen':      { x: 20 + 3 * PX, y: PY1 },
  'p-cheveene':   { x: 20 + 4 * PX, y: PY1 },
  'p-aritroper':  { x: 20 + 5 * PX, y: PY1 },
  'p-davidkrane': { x: 20 + 6 * PX, y: PY1 },
  // People row 2
  'p-arikrane':   { x: 100 + 0 * PX, y: PY2 },
  'p-heather':    { x: 100 + 1 * PX, y: PY2 },
  'p-mani':       { x: 100 + 2 * PX, y: PY2 },
  'p-omri':       { x: 100 + 3 * PX, y: PY2 },
  'p-amnon':      { x: 100 + 4 * PX, y: PY2 },
  'p-alexg':      { x: 100 + 5 * PX, y: PY2 },
}
