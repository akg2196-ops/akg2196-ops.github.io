export type Purpose = 'INVESTOR' | 'MENTOR' | 'PEER' | 'RECRUIT' | 'PARTNER' | 'FOUNDER'
export type Stage = 'PRE_SEED' | 'SEED' | 'SERIES_A' | 'SERIES_B' | 'GROWTH' | 'PUBLIC'
export type CompanyStatus = 'MONITORING' | 'APPLIED' | 'INTERVIEWING' | 'PORTFOLIO' | 'PASSED'
export type Relevance = 'HIRING' | 'INVESTOR' | 'BUILDER' | 'CONNECTOR'
export type EventType = 'CONFERENCE' | 'DINNER' | 'MEETUP' | 'DEMO_DAY'
export type Category = 'ALL' | 'STARTUPS' | 'AI' | 'VENTURE' | 'POLICY'
export type Momentum = 'SURGING' | 'UP' | 'FLAT'

export interface Note {
  id: string
  contactId: string
  body: string
  meetingDate: string
  purpose: string
  createdAt: string
}

export interface Contact {
  id: string
  name: string
  companyId?: string | null
  company?: Company | null
  role: string
  email?: string | null
  linkedin?: string | null
  purpose: Purpose
  strength: number
  lastContact: string
  tags: string[]
  createdAt: string
  notes?: Note[]
  _count?: { notes: number }
}

export interface Company {
  id: string
  name: string
  website?: string | null
  description?: string | null
  sector: string
  stage: Stage
  status: CompanyStatus
  geography?: string | null
  createdAt: string
  todos?: Todo[]
  contacts?: Contact[]
  execs?: Exec[]
}

export interface Todo {
  id: string
  companyId: string
  label: string
  done: boolean
  createdAt: string
}

export interface Exec {
  id: string
  name: string
  title: string
  companyId: string
  company?: Company | null
  linkedin?: string | null
  relevance: Relevance
  headshot?: string | null
}

export interface Event {
  id: string
  name: string
  date: string
  location: string
  virtual: boolean
  type: EventType
  tags: string[]
  link?: string | null
  rsvp: boolean
}

export interface Article {
  id: string
  source: string
  title: string
  summary: string
  url: string
  publishedAt: string
  companyTags: string[]
  category: Category
  saved: boolean
}

export interface Trend {
  id: string
  rank: number
  companyName: string
  why: string
  sector: string
  momentum: Momentum
  metric: string
  link?: string | null
  spotlight: boolean
  updatedAt: string
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
