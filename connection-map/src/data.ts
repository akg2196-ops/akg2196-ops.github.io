export type Company = {
  id: string
  name: string
  roles: { title: string; url: string; track: 'Growth' | 'Product'; eligible: boolean }[]
  applicationDeadline?: string
  notes?: string
}

export type Person = {
  id: string
  name: string
  currentCompany: string
  role: string
  previousCompanies: string[]
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

export type SelectedNode =
  | { kind: 'company'; data: Company }
  | { kind: 'person'; data: Person }

// ── Seed data ──────────────────────────────────────────────────────────────

export const companies: Company[] = [
  {
    id: 'c-notion',
    name: 'Notion',
    roles: [
      {
        title: 'Associate Product Manager',
        url: 'https://www.notion.so/careers',
        track: 'Product',
        eligible: true,
      },
    ],
    applicationDeadline: 'Rolling',
    notes: 'Strong PM culture, APM program well-regarded. Airtable-competitor angle.',
  },
  {
    id: 'c-figma',
    name: 'Figma',
    roles: [
      {
        title: 'Growth PM — Activation',
        url: 'https://www.figma.com/careers',
        track: 'Growth',
        eligible: true,
      },
    ],
    applicationDeadline: 'Jul 15, 2026',
    notes: 'Looking for someone who can own top-of-funnel experiments.',
  },
  {
    id: 'c-stripe',
    name: 'Stripe',
    roles: [
      {
        title: 'Product Manager, Payments',
        url: 'https://stripe.com/jobs',
        track: 'Product',
        eligible: true,
      },
      {
        title: 'Growth PM — Developer Activation',
        url: 'https://stripe.com/jobs',
        track: 'Growth',
        eligible: false,
      },
    ],
    applicationDeadline: 'Aug 1, 2026',
    notes: 'Growth role requires 3+ yrs exp — not eligible yet. Core PM role looks good.',
  },
  {
    id: 'c-linear',
    name: 'Linear',
    roles: [
      {
        title: 'Product Manager',
        url: 'https://linear.app/careers',
        track: 'Product',
        eligible: true,
      },
    ],
    notes: 'Small team, high bar. Warm intro essentially required.',
  },
  {
    id: 'c-vercel',
    name: 'Vercel',
    roles: [
      {
        title: 'Growth PM — PLG',
        url: 'https://vercel.com/careers',
        track: 'Growth',
        eligible: true,
      },
    ],
    applicationDeadline: 'Jul 30, 2026',
    notes: 'Strong PLG motion. Growth team works closely with eng.',
  },
]

export const people: Person[] = [
  {
    id: 'p-alex',
    name: 'Alex Chen',
    currentCompany: 'Notion',
    role: 'Senior Product Manager',
    previousCompanies: ['Asana', 'Google'],
    university: 'Stanford',
    howWeMet: 'Met at ProductCon 2025 — had a great conversation about PLG metrics.',
    backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
  },
  {
    id: 'p-priya',
    name: 'Priya Sharma',
    currentCompany: 'Figma',
    role: 'Growth Lead',
    previousCompanies: ['Dropbox'],
    university: 'Columbia',
    howWeMet: 'Columbia alumni network — connected via the CS+PM Slack.',
    backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
  },
  {
    id: 'p-jordan',
    name: 'Jordan Kim',
    currentCompany: 'Stripe',
    role: 'PM II, Developer Experience',
    previousCompanies: ['Twilio', 'Plaid'],
    university: 'MIT',
    howWeMet: "Former intern manager at a mutual contact's company. Intro'd by Priya.",
    backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
  },
  {
    id: 'p-maya',
    name: 'Maya Patel',
    currentCompany: 'Linear',
    role: 'Head of Product',
    previousCompanies: ['Intercom'],
    university: 'Columbia',
    howWeMet: 'Columbia alumni — overlapped at SEAS Career Fair 2024.',
    backlinks: [
      { label: 'LinkedIn', url: 'https://linkedin.com' },
      { label: 'Twitter/X', url: 'https://x.com' },
    ],
  },
  {
    id: 'p-sam',
    name: 'Sam Rivera',
    currentCompany: 'Vercel',
    role: 'Growth Engineer',
    previousCompanies: ['Netlify', 'Gatsby'],
    university: 'Columbia',
    howWeMet: 'Reached out cold on LinkedIn after their talk on edge functions.',
    backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
  },
  {
    id: 'p-nina',
    name: 'Nina Osei',
    currentCompany: 'Google',
    role: 'Senior APM',
    previousCompanies: ['Figma'],
    university: 'Yale',
    howWeMet: 'Met through the PM Accelerator community. Good friend.',
    backlinks: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
  },
]

export const connections: Connection[] = [
  {
    id: 'e1',
    personId: 'p-alex',
    companyId: 'c-notion',
    relationship: 'Current employee — can refer directly',
  },
  {
    id: 'e2',
    personId: 'p-priya',
    companyId: 'c-figma',
    relationship: 'Current Growth Lead — direct intro',
  },
  {
    id: 'e3',
    personId: 'p-jordan',
    companyId: 'c-stripe',
    relationship: 'Current PM — knows the hiring manager',
  },
  {
    id: 'e4',
    personId: 'p-maya',
    companyId: 'c-linear',
    relationship: 'Head of Product — warm intro required',
  },
  {
    id: 'e5',
    personId: 'p-sam',
    companyId: 'c-vercel',
    relationship: 'Current employee — Growth team adjacent',
  },
  {
    id: 'e6',
    personId: 'p-nina',
    companyId: 'c-figma',
    relationship: 'Former employee 2022–2024 — alumni network',
  },
  {
    id: 'e7',
    personId: 'p-alex',
    companyId: 'c-stripe',
    relationship: 'Worked there 2019–2021 — knows culture well',
  },
  {
    id: 'e8',
    personId: 'p-priya',
    companyId: 'c-notion',
    relationship: 'Close friends with Notion PM lead',
  },
]

// ── Layout positions ────────────────────────────────────────────────────────
// Companies: spread across the top; People: below in two rows

const COMPANY_Y = 80
const PERSON_Y_1 = 360
const PERSON_Y_2 = 560

export const companyPositions: Record<string, { x: number; y: number }> = {
  'c-notion':  { x: 60,   y: COMPANY_Y },
  'c-figma':   { x: 320,  y: COMPANY_Y },
  'c-stripe':  { x: 590,  y: COMPANY_Y },
  'c-linear':  { x: 860,  y: COMPANY_Y },
  'c-vercel':  { x: 1100, y: COMPANY_Y },
}

export const personPositions: Record<string, { x: number; y: number }> = {
  'p-alex':   { x: 100,  y: PERSON_Y_1 },
  'p-priya':  { x: 340,  y: PERSON_Y_1 },
  'p-jordan': { x: 580,  y: PERSON_Y_1 },
  'p-maya':   { x: 820,  y: PERSON_Y_1 },
  'p-sam':    { x: 1060, y: PERSON_Y_1 },
  'p-nina':   { x: 460,  y: PERSON_Y_2 },
}
