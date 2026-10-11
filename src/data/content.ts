/**
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE.
 *  Edit this file to update the website — no component changes needed.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Chao-Hsu Chen',
  shortName: 'Chao-Hsu',
  school: 'University of Toronto',
  program: 'CS × MScAC',
  location: 'Toronto, Canada',
  tagline: 'AI researcher driven by the belief that AI should not just be intelligent, but make a real difference in people’s lives.',
  focus: ['Human–AI Interaction', 'Multi-Agent Systems', 'Applied ML'],
  email: 'chaohsu.chen@mail.utoronto.ca',
  links: {
    github: 'https://github.com/chaohsuchen',
    linkedin: 'https://www.linkedin.com/in/chao-hsu-victor-chen-60a4702bb',
    scholar: '', // add a Google Scholar URL to show it
    cv: '', // e.g. '/cv.pdf' (put the file in /public)
  },
}

/** Short dated updates shown on the home page. Newest first. */
export const news: { when: string; text: string; tag?: 'paper' | 'award' | 'job' | 'school' }[] = [
  { when: 'Now', text: 'Researching unrecoverability in autonomous driving at UofT.', tag: 'paper' },
  { when: 'Sep 2026', text: 'Started the MSc in Applied Computing (MScAC) at the University of Toronto.', tag: 'school' },
  { when: 'Sep 2026', text: 'Teaching Software Design tutorials (Java, OOD, Git, testing) at UofT.', tag: 'job' },
  { when: '2026', text: 'Dr. Ei, my multi-agent clinical decision support system, appeared at ACM CHI 2026 (Extended Abstracts). First author.', tag: 'paper' },
  { when: '2025', text: 'Won 3rd place at Logitech InnoX, a global hackathon for Logitech employees, with an AI eye-tracking system.', tag: 'award' },
  { when: 'Jun 2025', text: 'Graduated from National Tsing Hua University with a B.S. in Computer Science.', tag: 'school' },
  { when: 'Mar 2025', text: 'Joined Logitech as an AI Tools Intern, building a cross-team AI collaboration platform.', tag: 'job' },
  { when: 'Oct 2024', text: 'Champion at the Logitech Hackathon, then 2nd place at the Mei-Chu Hackathon final (220+ participants).', tag: 'award' },
]

export const about = {
  headline: 'The human in the loop',
  paragraphs: [
    "I'm Chao-Hsu Chen, an MScAC student in Computer Science at the University of Toronto. Before Toronto I studied CS at National Tsing Hua University in Taiwan, with an exchange semester at Tsinghua University in Beijing.",
    'Most of my work sits where AI agents meet real people. I built Dr. Ei, a multi-agent assistant that helps clinicians weigh evidence, and tested it with 25 doctors at Taichung Veterans General Hospital. I also helped build TAI, a university-scale AI teaching assistant that more than 1,000 students used.',
    'What keeps me going is a simple question: is someone’s day actually better because of this? Lower cognitive load for a doctor, a better exam score for a student, less waiting between engineering teams. That is the kind of AI I want to build.',
  ],
  principles: [
    {
      title: 'Augment, don’t replace',
      body: 'Dr. Ei never makes the diagnosis. It lays out the evidence so the clinician can decide with more confidence.',
      who: 'human' as const,
    },
    {
      title: 'Agents as teammates',
      body: 'Several specialised agents that explain themselves beat one black box. Collaboration is a design problem as much as a modelling one.',
      who: 'ai1' as const,
    },
    {
      title: 'Measure real lives',
      body: 'Benchmarks are a proxy. I care about the 5-point exam gain, the 70% less coordination time, and the doctor who feels less tired.',
      who: 'ai2' as const,
    },
  ],
  facts: [
    { k: 'Based in', v: 'Toronto, CA' },
    { k: 'Studying', v: 'MScAC · UofT' },
    { k: 'Previously', v: 'NTHU · Taiwan' },
    { k: 'Focus', v: 'Human × AI' },
  ],
  skills: {
    inner: ['Python', 'Java', 'LangChain', 'Vector DBs'],
    outer: ['Multi-Agent', 'RAG', 'Fine-tuning', 'Prompting', 'User Studies', 'HCI'],
  },
  education: [
    {
      when: '2026 — now',
      what: 'MSc in Applied Computing (MScAC), Computer Science',
      where: 'University of Toronto',
      logo: '/logos/uoft.png',
      note: '',
    },
    {
      when: '2021 — 2025',
      what: 'B.S. in Computer Science',
      where: 'National Tsing Hua University, Taiwan',
      logo: '/logos/nthu.svg',
      note: 'GPA 3.85 / 4.3 (4.3 / 4.3 final year) · Academic Achievement Award, top 5% of CS',
    },
    {
      when: '2023 — 2024',
      what: 'Exchange Student, Computer Science and Technology',
      where: 'Tsinghua University, Beijing',
      logo: '/logos/thu.svg',
      note: '',
    },
  ],
}

export type Project = {
  title: string
  subtitle: string
  status: 'completed' | 'ongoing'
  venue: string
  year: string
  role: string
  firstAuthor?: boolean
  oneLiner: string
  description: string
  stats: { n: string; label: string }[]
  tags: string[]
  human: string // what the human does in the loop
  agent: string // what the agent does in the loop
  image?: { src: string; alt: string; caption: string }
  links?: { label: string; href: string; kind: 'paper' | 'video' | 'code' }[]
  linkNote?: string
}

/** Current work, shown at the top of the Research page. */
export const ongoing: { title: string; where: string; oneLiner: string; tags: string[] }[] = [
  {
    title: 'Unrecoverability in Autonomous Driving',
    where: 'University of Toronto',
    oneLiner: 'When does a self-driving system reach a state it can no longer recover from, and can we see it coming early enough to act?',
    tags: ['Autonomous Driving', 'Safety', 'Decision-Making'],
  },
]

export const research: Project[] = [
  {
    title: 'Dr. Ei',
    subtitle: 'Multi-Agent Clinical Decision Support',
    status: 'completed',
    venue: 'ACM CHI 2026 · Extended Abstracts',
    year: '2025 — 2026',
    role: 'First author',
    firstAuthor: true,
    oneLiner: 'A team of AI agents that helps clinicians weigh evidence. The doctor makes the call.',
    description:
      'A human-centred, multi-agent clinical decision support system designed to make clinician–AI interaction more interpretable. Validated in the real world with clinicians at Taichung Veterans General Hospital: its evidence-centred workflow reduced cognitive effort and improved clinician confidence.',
    stats: [
      { n: '25', label: 'clinicians in the field study' },
      { n: '↓', label: 'cognitive effort' },
      { n: '↑', label: 'clinician confidence' },
    ],
    tags: ['Multi-Agent', 'Healthcare', 'HAI', 'Field Study'],
    human: 'Clinician decides',
    agent: 'Agents gather & explain evidence',
    image: {
      src: '/images/dr-ei-architecture.jpg',
      alt: 'Dr. Ei architecture: in stage 1 a delegator agent routes urodynamic, MRI and NCV/EMG data to specialist AI models whose results a summarizer agent combines; in stage 2 the clinician talks with conversational agents for each modality while a supervisor agent selects who responds.',
      caption: 'Stage 1 integrates evidence from VUDS, MRI and NCV/EMG specialist agents. Stage 2 lets the clinician question each agent directly.',
    },
    links: [{ label: 'Read the paper', href: 'https://dl.acm.org/doi/10.1145/3772363.3798870', kind: 'paper' }],
    linkNote: 'The ACM page has the full paper, more details and a video presentation.',
  },
  {
    title: 'TAI',
    subtitle: 'Taiwan’s first university-scale AI teaching assistant',
    status: 'completed',
    venue: 'NTHU · Physics & Computer Science',
    year: '2024 — 2026',
    role: 'AI Teaching Research Assistant',
    oneLiner: 'An AI TA that a thousand students actually learned with.',
    description:
      'Designed and evaluated TAI, an AI teaching assistant platform serving NTHU courses. Led human–AI interaction studies comparing RAG, fine-tuning and prompt-engineering approaches, and measured the effect on real learning outcomes.',
    stats: [
      { n: '1,000+', label: 'students served' },
      { n: '+5.1', label: 'avg. exam points (p < 0.01)' },
      { n: '3', label: 'approaches compared: RAG, FT, prompting' },
    ],
    tags: ['Education', 'RAG', 'Fine-tuning', 'User Study'],
    human: 'Students learn & ask',
    agent: 'Tutors with course knowledge',
    image: {
      src: '/images/tai-depth-vs-score.webp',
      alt: 'Scatter plot of exam score against the proportion of in-depth interaction in dialogue, coloured by usage and depth group, with a regression line (r = 0.135, p > 0.05).',
      caption: 'Exam score vs. share of in-depth dialogue with TAI, grouped by usage and depth (r = 0.135, p > 0.05).',
    },
    links: [{ label: 'Watch the video', href: 'https://www.youtube.com/watch?v=BeKVkNX6fns', kind: 'video' }],
  },
]

export type Job = {
  role: string
  org: string
  team?: string
  when: string
  where: string
  points: string[]
  stack: string[]
}

export const jobs: Job[] = [
  {
    role: 'Software Design Teaching Assistant',
    org: 'University of Toronto',
    team: 'Department of Computer Science',
    when: 'Sep 2026 — now',
    where: 'Toronto, ON',
    points: [
      'Lead tutorials on Java, object-oriented design, Git, testing, debugging and collaborative development.',
      'Guide students on software engineering practice, code quality and design.',
    ],
    stack: ['Java', 'OOD', 'Git', 'Testing'],
  },
  {
    role: 'AI Tools Intern',
    org: 'Logitech',
    team: 'ME–CMF Innovation Team',
    when: 'Mar 2025 — Feb 2026',
    where: 'Taiwan',
    points: [
      'Designed and deployed a cross-department AI collaboration platform connecting EE, ME and CMF engineering teams.',
      'Automated material data crawling and retrieval, improving data-access efficiency by 40%.',
      'Adopted by 20+ engineers, cutting cross-team coordination time by over 70%.',
    ],
    stack: ['LLM Agents', 'RAG', 'Automation'],
  },
  {
    role: 'AI Teaching Research Assistant',
    org: 'National Tsing Hua University',
    team: 'Departments of Physics & Computer Science',
    when: 'Aug 2024 — Feb 2026',
    where: 'Hsinchu, Taiwan',
    points: [
      'Built and evaluated TAI, Taiwan’s first university-scale AI teaching assistant, used by 1,000+ students.',
      'Led human–AI interaction research on RAG, fine-tuning and prompt engineering.',
      'Platform users improved by 5.1 exam points on average (p < 0.01).',
    ],
    stack: ['RAG', 'Fine-tuning', 'User Studies'],
  },
  {
    role: 'LLM Application Intern',
    org: 'CoreTech System (Moldex3D)',
    team: 'R&D Department',
    when: 'Jul 2024 — Sep 2024',
    where: 'Taiwan',
    points: [
      'Built a customer-service chatbot with LangChain and a vector database to automate technical inquiries.',
      'Supported 10,000+ documents in 5+ languages for global customer service.',
    ],
    stack: ['LangChain', 'Vector DB', 'Multilingual'],
  },
]

export type Contest = {
  name: string
  result: string
  year: string
  blurb: string
  field?: number // number of participants, for the stats row
  tier: 'gold' | 'silver' | 'bronze' | 'star'
}

export const contests: Contest[] = [
  {
    name: 'Logitech InnoX Hackathon',
    result: '3rd Place',
    year: '2025',
    blurb: 'A global hackathon open only to Logitech employees. I led the team designing an AI eye-tracking system to understand how people use Logitech products. Hundreds of participants worldwide.',
    field: 200, // "hundreds" of participants; 200 is a safe lower bound for the stats row
    tier: 'bronze',
  },
  {
    name: 'Logitech Hackathon · Mei-Chu Preliminary',
    result: 'Champion',
    year: 'Oct 2024',
    blurb: 'Led the team building a multi-persona AI dialogue platform. 40+ participants.',
    field: 40,
    tier: 'gold',
  },
  {
    name: 'Mei-Chu Hackathon Final',
    result: '2nd Place',
    year: 'Oct 2024',
    blurb: 'Taiwan’s largest campus hackathon. We grew the idea into a human-centred multi-agent prototype. 220+ participants.',
    field: 220,
    tier: 'silver',
  },
  {
    name: 'SDG Open Hack · Tsinghua University',
    result: '2nd Place',
    year: 'Nov 2023',
    blurb: 'A VR cognitive assistant for Alzheimer’s memory training, built in Beijing. 100+ participants.',
    field: 100,
    tier: 'silver',
  },
  {
    name: 'Fintech80 Global Challenge',
    result: 'Innovation Award',
    year: 'Oct 2023',
    blurb: 'An LLM-powered finance app that automates data-analysis workflows. Teams from 8 universities worldwide.',
    tier: 'star',
  },
  {
    name: 'NTHU Computer Science',
    result: 'Academic Achievement',
    year: 'Fall 2024',
    blurb: 'Awarded to the top 5% of students in the CS department.',
    tier: 'star',
  },
]

export const extras: string[] = [
  'NTHU International Youth Ambassador (2024 — 2025)',
  'Google Cybersecurity Certificate (2024)',
  'Representative Contestant, Big Data Association, Tsinghua University (2023)',
  'NVIDIA DLI Certificate (2023)',
]

// Questions people can ask "the agents" on the Contact page.
export const faq: { q: string; a: string; links?: { label: string; href: string }[] }[] = [
  {
    q: 'What does Chao-Hsu work on?',
    a: 'Human–AI interaction: multi-agent systems that work with people, from clinicians to students to engineers, and make their days measurably better.',
  },
  {
    q: 'What is Dr. Ei?',
    a: 'A multi-agent clinical decision support system. Agents gather and explain evidence, the clinician decides. Tested with 25 clinicians and published at CHI 2026 (Extended Abstracts).',
  },
  {
    q: 'What is TAI?',
    a: 'Taiwan’s first university-scale AI teaching assistant, used by 1,000+ students at NTHU. Users scored 5.1 points higher on exams on average.',
  },
  {
    q: 'Why the little robots?',
    a: 'That’s us! Two AI agents holding hands with a human. It’s Chao-Hsu’s research philosophy drawn as a picture: humans and agents, better together.',
  },
  {
    q: 'How do I reach Chao-Hsu?',
    a: 'Email works best, or LinkedIn. Chao-Hsu is always happy to talk about human-centred AI, agents and research collaborations.',
    links: [
      { label: profile.email, href: `mailto:${profile.email}` },
      { label: 'LinkedIn', href: profile.links.linkedin },
    ],
  },
]
