import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean slate
  await prisma.note.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.todo.deleteMany()
  await prisma.exec.deleteMany()
  await prisma.company.deleteMany()
  await prisma.event.deleteMany()
  await prisma.article.deleteMany()
  await prisma.trend.deleteMany()

  // ── Companies ──────────────────────────────────────────────────────────────
  const anthropic = await prisma.company.create({
    data: {
      name: 'Anthropic',
      website: 'https://anthropic.com',
      description: 'AI safety company building reliable, interpretable AI systems. Creator of Claude.',
      sector: 'AI Infrastructure',
      stage: 'SERIES_B',
      status: 'PORTFOLIO',
      geography: 'San Francisco, CA',
    },
  })

  const vercel = await prisma.company.create({
    data: {
      name: 'Vercel',
      website: 'https://vercel.com',
      description: 'Frontend cloud platform that enables developers to build and deploy web applications at scale.',
      sector: 'Developer Tools',
      stage: 'SERIES_B',
      status: 'MONITORING',
      geography: 'San Francisco, CA',
    },
  })

  const linear = await prisma.company.create({
    data: {
      name: 'Linear',
      website: 'https://linear.app',
      description: 'Project management tool built for modern software teams. Loved for its speed and opinionated design.',
      sector: 'Developer Tools',
      stage: 'SERIES_A',
      status: 'MONITORING',
      geography: 'San Francisco, CA',
    },
  })

  const runway = await prisma.company.create({
    data: {
      name: 'Runway',
      website: 'https://runwayml.com',
      description: 'AI-powered creative tools for video generation, editing, and visual effects.',
      sector: 'AI / Creative',
      stage: 'SERIES_B',
      status: 'MONITORING',
      geography: 'New York, NY',
    },
  })

  const replit = await prisma.company.create({
    data: {
      name: 'Replit',
      website: 'https://replit.com',
      description: 'Browser-based collaborative IDE with AI coding assistance. Democratizing software creation.',
      sector: 'Developer Tools',
      stage: 'SERIES_B',
      status: 'INTERVIEWING',
      geography: 'San Francisco, CA',
    },
  })

  const brex = await prisma.company.create({
    data: {
      name: 'Brex',
      website: 'https://brex.com',
      description: 'Financial services and software for growing businesses. Corporate cards, expense management, and banking.',
      sector: 'Fintech',
      stage: 'GROWTH',
      status: 'APPLIED',
      geography: 'San Francisco, CA',
    },
  })

  const pikaLabs = await prisma.company.create({
    data: {
      name: 'Pika Labs',
      website: 'https://pika.art',
      description: 'AI video generation startup — turn text and images into cinematic clips in seconds.',
      sector: 'AI / Creative',
      stage: 'SEED',
      status: 'MONITORING',
      geography: 'Palo Alto, CA',
    },
  })

  const togetherAI = await prisma.company.create({
    data: {
      name: 'Together AI',
      website: 'https://together.ai',
      description: 'Cloud platform for running, fine-tuning, and deploying open-source AI models at scale.',
      sector: 'AI Infrastructure',
      stage: 'SERIES_A',
      status: 'MONITORING',
      geography: 'San Francisco, CA',
    },
  })

  // ── Todos ──────────────────────────────────────────────────────────────────
  await prisma.todo.createMany({
    data: [
      { companyId: anthropic.id, label: 'Reach out to recruiting team re: PM roles', done: true },
      { companyId: anthropic.id, label: 'Read Constitutional AI paper', done: false },
      { companyId: anthropic.id, label: 'Schedule informational with Sarah Chen', done: false },
      { companyId: vercel.id, label: 'Check out v0.dev generative UI demo', done: true },
      { companyId: vercel.id, label: 'Apply for DX Engineer role', done: false },
      { companyId: linear.id, label: 'Try Linear API for personal task tracker', done: false },
      { companyId: linear.id, label: 'Read their Figma design doc on speed', done: true },
      { companyId: runway.id, label: 'Test Gen-3 Alpha for project proposal', done: false },
      { companyId: runway.id, label: 'Watch founder talk at NeurIPS', done: false },
      { companyId: replit.id, label: 'Complete coding interview prep', done: false },
      { companyId: replit.id, label: 'Submit application for Growth PM role', done: true },
      { companyId: replit.id, label: 'Connect with recruiter Maya on LinkedIn', done: false },
      { companyId: brex.id, label: 'Prep answers for behavioral round', done: false },
      { companyId: brex.id, label: "Research Brex's expansion into SMB banking", done: true },
      { companyId: pikaLabs.id, label: 'Generate demo video for portfolio', done: false },
      { companyId: togetherAI.id, label: 'Benchmark Llama 3.1 vs GPT-4o latency', done: false },
      { companyId: togetherAI.id, label: 'Read their inference optimization blog post', done: true },
    ],
  })

  // ── Execs ──────────────────────────────────────────────────────────────────
  await prisma.exec.createMany({
    data: [
      {
        name: 'Dario Amodei',
        title: 'CEO & Co-Founder',
        companyId: anthropic.id,
        linkedin: 'https://linkedin.com/in/dario-amodei-3934ba',
        relevance: 'INVESTOR',
      },
      {
        name: 'Chris Lattner',
        title: 'CTO',
        companyId: anthropic.id,
        linkedin: 'https://linkedin.com/in/chris-lattner',
        relevance: 'BUILDER',
      },
      {
        name: 'Guillermo Rauch',
        title: 'CEO',
        companyId: vercel.id,
        linkedin: 'https://linkedin.com/in/guillermo-rauch',
        relevance: 'BUILDER',
      },
      {
        name: 'Karri Saarinen',
        title: 'CEO & Co-Founder',
        companyId: linear.id,
        linkedin: 'https://linkedin.com/in/karri-saarinen',
        relevance: 'BUILDER',
      },
      {
        name: 'Amjad Masad',
        title: 'CEO & Co-Founder',
        companyId: replit.id,
        linkedin: 'https://linkedin.com/in/amjadmasad',
        relevance: 'HIRING',
      },
      {
        name: 'Pedro Franceschi',
        title: 'CEO & Co-Founder',
        companyId: brex.id,
        linkedin: 'https://linkedin.com/in/pedrofranceschi',
        relevance: 'CONNECTOR',
      },
    ],
  })

  // ── Contacts ────────────────────────────────────────────────────────────────
  const sarah = await prisma.contact.create({
    data: {
      name: 'Sarah Chen',
      companyId: anthropic.id,
      role: 'Head of Product',
      email: 'sarah.chen@anthropic.com',
      linkedin: 'https://linkedin.com/in/sarahchen',
      purpose: 'MENTOR',
      strength: 4,
      lastContact: new Date('2024-11-15'),
      tags: JSON.stringify(['ai', 'product', 'former-google']),
    },
  })

  const marcus = await prisma.contact.create({
    data: {
      name: 'Marcus Webb',
      companyId: vercel.id,
      role: 'Engineering Manager',
      email: 'marcus@vercel.com',
      linkedin: 'https://linkedin.com/in/marcuswebb',
      purpose: 'PEER',
      strength: 3,
      lastContact: new Date('2024-12-02'),
      tags: JSON.stringify(['devtools', 'frontend', 'next.js']),
    },
  })

  const priya = await prisma.contact.create({
    data: {
      name: 'Priya Nair',
      role: 'Partner',
      email: 'priya@sequoiacap.com',
      linkedin: 'https://linkedin.com/in/priyanair',
      purpose: 'INVESTOR',
      strength: 2,
      lastContact: new Date('2024-10-28'),
      tags: JSON.stringify(['vc', 'sequoia', 'b2b-saas']),
    },
  })

  const alex = await prisma.contact.create({
    data: {
      name: 'Alex Rivera',
      companyId: replit.id,
      role: 'Senior Product Manager',
      email: 'alex.r@replit.com',
      linkedin: 'https://linkedin.com/in/alexrivera',
      purpose: 'RECRUIT',
      strength: 5,
      lastContact: new Date('2024-12-10'),
      tags: JSON.stringify(['pm', 'developer-tools', 'referral']),
    },
  })

  const david = await prisma.contact.create({
    data: {
      name: 'David Park',
      role: 'CEO & Co-Founder',
      email: 'david@vaultai.io',
      linkedin: 'https://linkedin.com/in/davidpark',
      purpose: 'FOUNDER',
      strength: 4,
      lastContact: new Date('2024-11-30'),
      tags: JSON.stringify(['ai', 'founder', 'yc-w24']),
    },
  })

  const jasmine = await prisma.contact.create({
    data: {
      name: 'Jasmine Okonkwo',
      role: 'Principal',
      email: 'jokonkwo@a16z.com',
      linkedin: 'https://linkedin.com/in/jasmineokonkwo',
      purpose: 'INVESTOR',
      strength: 3,
      lastContact: new Date('2024-12-05'),
      tags: JSON.stringify(['vc', 'a16z', 'consumer', 'fintech']),
    },
  })

  const tom = await prisma.contact.create({
    data: {
      name: 'Tom Kowalski',
      companyId: linear.id,
      role: 'Staff Engineer',
      email: 'tom@linear.app',
      linkedin: 'https://linkedin.com/in/tomkowalski',
      purpose: 'PEER',
      strength: 3,
      lastContact: new Date('2024-11-08'),
      tags: JSON.stringify(['engineering', 'typescript', 'design-systems']),
    },
  })

  const mei = await prisma.contact.create({
    data: {
      name: 'Mei Zhang',
      companyId: brex.id,
      role: 'Product Lead, Banking',
      email: 'mei.zhang@brex.com',
      linkedin: 'https://linkedin.com/in/meizhang',
      purpose: 'RECRUIT',
      strength: 4,
      lastContact: new Date('2024-12-08'),
      tags: JSON.stringify(['fintech', 'pm', 'banking']),
    },
  })

  const ryan = await prisma.contact.create({
    data: {
      name: 'Ryan Osei',
      role: 'Director of AI Research',
      email: 'ryan@togetherai.com',
      companyId: togetherAI.id,
      linkedin: 'https://linkedin.com/in/ryanosei',
      purpose: 'PARTNER',
      strength: 2,
      lastContact: new Date('2024-10-15'),
      tags: JSON.stringify(['ml', 'research', 'open-source']),
    },
  })

  const nina = await prisma.contact.create({
    data: {
      name: 'Nina Johansson',
      role: 'Policy Lead',
      email: 'nina@techpolicy.org',
      linkedin: 'https://linkedin.com/in/ninajohansson',
      purpose: 'PARTNER',
      strength: 2,
      lastContact: new Date('2024-11-20'),
      tags: JSON.stringify(['policy', 'ai-regulation', 'dc']),
    },
  })

  const chris = await prisma.contact.create({
    data: {
      name: 'Chris Tanaka',
      companyId: runway.id,
      role: 'Head of Growth',
      email: 'chris@runwayml.com',
      linkedin: 'https://linkedin.com/in/christanaka',
      purpose: 'PEER',
      strength: 3,
      lastContact: new Date('2024-12-01'),
      tags: JSON.stringify(['ai', 'growth', 'video']),
    },
  })

  const elena = await prisma.contact.create({
    data: {
      name: 'Elena Vasquez',
      role: 'Founder Partner',
      email: 'elena@firstround.com',
      linkedin: 'https://linkedin.com/in/elenavasquez',
      purpose: 'MENTOR',
      strength: 5,
      lastContact: new Date('2024-12-12'),
      tags: JSON.stringify(['vc', 'first-round', 'mentor']),
    },
  })

  // ── Notes ───────────────────────────────────────────────────────────────────
  await prisma.note.createMany({
    data: [
      {
        contactId: sarah.id,
        body: 'Met at SFTech Summit. She runs PM for Claude Enterprise. Mentioned they are hiring senior PMs with AI background. Wants to do a follow-up coffee chat in January.',
        meetingDate: new Date('2024-11-15'),
        purpose: 'Networking / Informational',
      },
      {
        contactId: sarah.id,
        body: 'Follow-up over Zoom. She shared the product roadmap vision for 2025 — big push on tool use and agentic workflows. Gave me contact for their head of recruiting.',
        meetingDate: new Date('2024-12-01'),
        purpose: 'Informational Interview',
      },
      {
        contactId: marcus.id,
        body: 'Connected via mutual friend Jake. Works on the Vercel Edge Runtime team. Said they are expanding the DX team in Q1. Gave me tips on tailoring my resume for Vercel culture.',
        meetingDate: new Date('2024-12-02'),
        purpose: 'Networking',
      },
      {
        contactId: alex.id,
        body: 'Warm intro through Columbia alumni network. Alex is a PM on the Ghostwriter (AI coding) team. Interview process is 4 rounds: screen, take-home, 3x onsite. Timeline is ~6 weeks.',
        meetingDate: new Date('2024-12-05'),
        purpose: 'Referral Conversation',
      },
      {
        contactId: alex.id,
        body: 'Second chat. Alex sent my resume to the hiring manager. Said to expect a recruiter screen next week. Huge help.',
        meetingDate: new Date('2024-12-10'),
        purpose: 'Follow-up',
      },
      {
        contactId: david.id,
        body: 'Met at YC Demo Day. David is building AI-native document management. Raised $2M pre-seed. Smart founder — looking for product and biz dev help. Could be an advisor role.',
        meetingDate: new Date('2024-11-30'),
        purpose: 'Demo Day Connection',
      },
      {
        contactId: elena.id,
        body: 'Intro from Professor Martinez. Elena is an incredible mentor — spent 90 min going through my career goals. Advised me to focus on companies with strong PM mentorship cultures. Will meet monthly.',
        meetingDate: new Date('2024-12-12'),
        purpose: 'Mentorship',
      },
      {
        contactId: mei.id,
        body: 'Phone screen for PM role at Brex. Focused on product sense and metrics. She seemed impressed with my fintech experience. Moving to take-home case study.',
        meetingDate: new Date('2024-12-08'),
        purpose: 'Interview',
      },
      {
        contactId: jasmine.id,
        body: 'Panel at a16z Future event. She focuses on fintech and consumer. Exchanged cards. Not a great time to raise (told me upfront) but happy to give feedback on pitch decks.',
        meetingDate: new Date('2024-12-05'),
        purpose: 'Event Networking',
      },
      {
        contactId: nina.id,
        body: 'Georgetown AI Policy Forum. She leads AI Act compliance research. Interesting perspective on the regulatory divergence between EU and US. Great contact for understanding the policy landscape.',
        meetingDate: new Date('2024-11-20'),
        purpose: 'Conference',
      },
    ],
  })

  // ── Events ─────────────────────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      {
        name: 'SV Summit: The AI-Native Company',
        date: new Date('2025-01-15'),
        location: 'Fort Mason Center, San Francisco',
        virtual: false,
        type: 'CONFERENCE',
        tags: JSON.stringify(['ai', 'startups', 'enterprise']),
        link: 'https://svsummit.com',
        rsvp: true,
      },
      {
        name: 'Founders & Operators Dinner (SF)',
        date: new Date('2025-01-22'),
        location: 'Spruce Restaurant, San Francisco',
        virtual: false,
        type: 'DINNER',
        tags: JSON.stringify(['founders', 'operators', 'invite-only']),
        link: 'https://fodinners.com',
        rsvp: false,
      },
      {
        name: 'Latent Space Demo Day — Winter 2025',
        date: new Date('2025-02-05'),
        location: 'Virtual',
        virtual: true,
        type: 'DEMO_DAY',
        tags: JSON.stringify(['ai', 'demo-day', 'yc', 'open-source']),
        link: 'https://latent.space/demo-day',
        rsvp: true,
      },
      {
        name: 'NYC Tech Week: Product x AI',
        date: new Date('2025-02-18'),
        location: 'Venue TBD, New York',
        virtual: false,
        type: 'MEETUP',
        tags: JSON.stringify(['product', 'ai', 'nyc']),
        link: 'https://nytechweek.com',
        rsvp: false,
      },
      {
        name: 'Y Combinator W25 Demo Day',
        date: new Date('2025-03-20'),
        location: 'Craneway Pavilion, San Francisco',
        virtual: false,
        type: 'DEMO_DAY',
        tags: JSON.stringify(['yc', 'startups', 'seed', 'demo-day']),
        link: 'https://ycombinator.com/demo-day',
        rsvp: false,
      },
    ],
  })

  // ── Articles ────────────────────────────────────────────────────────────────
  await prisma.article.createMany({
    data: [
      {
        source: 'techcrunch.com',
        title: 'Anthropic raises $4B from Amazon, deepening cloud AI partnership',
        summary: 'The AI safety startup secured a massive funding round that will fund compute, safety research, and expansion of the Claude model family. Amazon becomes a key cloud partner with AWS integration commitments.',
        url: 'https://techcrunch.com/anthropic-amazon-4b',
        publishedAt: new Date('2024-12-10T09:00:00Z'),
        companyTags: JSON.stringify(['Anthropic']),
        category: 'VENTURE',
        saved: true,
      },
      {
        source: 'theverge.com',
        title: `Vercel's v0 AI UI generator hits 1M users in under 90 days`,
        summary: `Vercel's generative UI tool v0 reached a significant milestone, proving that AI-assisted frontend development has found strong product-market fit among indie developers and enterprise teams alike.`,
        url: 'https://theverge.com/vercel-v0-1m-users',
        publishedAt: new Date('2024-12-08T14:30:00Z'),
        companyTags: JSON.stringify(['Vercel']),
        category: 'AI',
        saved: false,
      },
      {
        source: 'bloomberg.com',
        title: 'Brex eyes profitability as it pivots hard into enterprise banking',
        summary: 'The corporate card startup is quietly repositioning as a full-stack financial platform for mid-market companies, cutting burn rate and targeting cash flow positivity by Q3 2025.',
        url: 'https://bloomberg.com/brex-enterprise-pivot',
        publishedAt: new Date('2024-12-07T11:00:00Z'),
        companyTags: JSON.stringify(['Brex']),
        category: 'STARTUPS',
        saved: false,
      },
      {
        source: 'wired.com',
        title: `The EU AI Act's compliance deadline is closer than you think`,
        summary: 'With key provisions kicking in February 2025, US-headquartered AI companies face mounting legal exposure. Legal teams are scrambling; startups often have no plan at all.',
        url: 'https://wired.com/eu-ai-act-deadline',
        publishedAt: new Date('2024-12-06T08:00:00Z'),
        companyTags: JSON.stringify([]),
        category: 'POLICY',
        saved: true,
      },
      {
        source: 'semafor.com',
        title: 'Together AI closes $106M Series A to scale open-source model infrastructure',
        summary: 'The inference platform raised a large round led by Salesforce Ventures to expand its model serving capacity and add fine-tuning tools, betting that enterprises prefer open models for sensitive workloads.',
        url: 'https://semafor.com/together-ai-series-a',
        publishedAt: new Date('2024-12-05T10:00:00Z'),
        companyTags: JSON.stringify(['Together AI']),
        category: 'VENTURE',
        saved: false,
      },
      {
        source: 'reuters.com',
        title: `Pika Labs' video generation model outperforms Sora on creative benchmarks`,
        summary: `Independent evaluators found Pika 2.0 produced more temporally consistent footage than OpenAI's Sora in creative prompt categories, giving the startup a competitive edge heading into 2025.`,
        url: 'https://reuters.com/pika-vs-sora-benchmark',
        publishedAt: new Date('2024-12-04T16:00:00Z'),
        companyTags: JSON.stringify(['Pika Labs']),
        category: 'AI',
        saved: false,
      },
      {
        source: 'theinformation.com',
        title: `Replit's Ghostwriter is the sleeper AI coding tool winning over enterprise devs`,
        summary: `While Cursor and GitHub Copilot dominate headlines, Replit's in-browser AI is quietly landing Fortune 500 engineering teams who want a zero-setup coding environment with AI built in from the ground up.`,
        url: 'https://theinformation.com/replit-ghostwriter-enterprise',
        publishedAt: new Date('2024-12-03T09:30:00Z'),
        companyTags: JSON.stringify(['Replit']),
        category: 'STARTUPS',
        saved: true,
      },
      {
        source: 'axios.com',
        title: 'VC funding rebounds in Q4 2024 — AI dominates deal flow at 61%',
        summary: 'After a two-year dry spell, venture funding picked up meaningfully in the final quarter of 2024. AI-adjacent deals commanded a majority of dollars deployed, with infrastructure and enterprise applications leading.',
        url: 'https://axios.com/vc-funding-q4-2024',
        publishedAt: new Date('2024-12-02T12:00:00Z'),
        companyTags: JSON.stringify(['Anthropic', 'Together AI']),
        category: 'VENTURE',
        saved: false,
      },
      {
        source: 'arstechnica.com',
        title: `Runway's Gen-3 Alpha can now edit existing videos frame-by-frame with prompts`,
        summary: `The latest update to Runway's flagship video model introduces surgical editing capabilities — users can select regions of footage and transform them with natural language, without re-generating the whole clip.`,
        url: 'https://arstechnica.com/runway-gen3-editing',
        publishedAt: new Date('2024-12-01T17:00:00Z'),
        companyTags: JSON.stringify(['Runway']),
        category: 'AI',
        saved: false,
      },
      {
        source: 'platformer.news',
        title: 'Linear is slowly becoming the operating system for startup teams',
        summary: 'What started as a fast issue tracker has grown into a company-wide work management platform with docs, roadmaps, and now an AI triage layer. It is finding stickiness far beyond engineering.',
        url: 'https://platformer.news/linear-operating-system',
        publishedAt: new Date('2024-11-30T10:00:00Z'),
        companyTags: JSON.stringify(['Linear']),
        category: 'STARTUPS',
        saved: true,
      },
    ],
  })

  // ── Trends ─────────────────────────────────────────────────────────────────
  await prisma.trend.createMany({
    data: [
      {
        rank: 1,
        companyName: 'Anthropic',
        why: 'Claude 3.5 Sonnet benchmark dominance and $4B Amazon deal signal it is the enterprise AI default',
        sector: 'AI Infrastructure',
        momentum: 'SURGING',
        metric: '$4B investment round',
        link: 'https://anthropic.com',
        spotlight: true,
      },
      {
        rank: 2,
        companyName: 'Perplexity AI',
        why: 'Answer engine reaching 10M DAU; advertisers piling in; Google antitrust creates opening',
        sector: 'AI / Search',
        momentum: 'SURGING',
        metric: '10M DAU, $520M raised',
        link: 'https://perplexity.ai',
        spotlight: true,
      },
      {
        rank: 3,
        companyName: 'Poolside AI',
        why: `Enterprise code generation with own training infra — betting enterprises won't trust OpenAI`,
        sector: 'AI / Dev Tools',
        momentum: 'SURGING',
        metric: '$500M Series B',
        link: 'https://poolside.ai',
        spotlight: true,
      },
      {
        rank: 4,
        companyName: 'Together AI',
        why: 'Cheapest inference for Llama 3 / Mistral; enterprise open-source trend plays perfectly into their thesis',
        sector: 'AI Infrastructure',
        momentum: 'UP',
        metric: '$106M Series A',
        link: 'https://together.ai',
        spotlight: false,
      },
      {
        rank: 5,
        companyName: 'Vercel',
        why: 'v0 generative UI hit 1M users; AI-native frontend dev becoming a category of its own',
        sector: 'Developer Tools',
        momentum: 'UP',
        metric: '1M v0 users in 90 days',
        link: 'https://vercel.com',
        spotlight: false,
      },
      {
        rank: 6,
        companyName: 'Pika Labs',
        why: 'Pika 2.0 outperforming Sora on key benchmarks; TikTok-native distribution advantage',
        sector: 'AI / Creative',
        momentum: 'UP',
        metric: 'Outperformed Sora on 3/5 benchmarks',
        link: 'https://pika.art',
        spotlight: false,
      },
      {
        rank: 7,
        companyName: 'Linear',
        why: 'Category expansion beyond eng; now competing with Notion and Jira simultaneously',
        sector: 'Developer Tools',
        momentum: 'UP',
        metric: '~$35M ARR, default tool in 60% of YC cos',
        link: 'https://linear.app',
        spotlight: false,
      },
      {
        rank: 8,
        companyName: 'Replit',
        why: 'Ghostwriter landing F500; AI IDE category exploding with new entrants validating market',
        sector: 'Developer Tools',
        momentum: 'FLAT',
        metric: '~20M registered users',
        link: 'https://replit.com',
        spotlight: false,
      },
      {
        rank: 9,
        companyName: 'Brex',
        why: 'Strong cash position, profitable path, but growth story less clear after Carta comparisons',
        sector: 'Fintech',
        momentum: 'FLAT',
        metric: '$500M ARR run rate',
        link: 'https://brex.com',
        spotlight: false,
      },
      {
        rank: 10,
        companyName: 'Runway',
        why: 'Gen-3 Alpha update exciting but Sora pressure and Pika competition narrowing their moat window',
        sector: 'AI / Creative',
        momentum: 'FLAT',
        metric: '$141M raised total',
        link: 'https://runwayml.com',
        spotlight: false,
      },
    ],
  })

  console.log('✅ Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
