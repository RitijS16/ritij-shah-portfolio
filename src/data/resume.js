// All copy and facts on the site come from this file (sourced from Ritij's resumes,
// the lstm-text-generator repo and the two live sites). Keep lines short.

export const person = {
  name: 'Ritij Shah',
  role: 'AI & full-stack developer',
  city: 'Mumbai',
  email: 'shahritij2004@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/ritij-shah',
    github: 'https://github.com/RitijS16',
  },
}

// Shipped websites. Stack labels were read from the live builds.
export const sites = [
  {
    id: 'sevn',
    name: 'SEVN Cafe & Bakehaus',
    kind: 'Café & bakery · Riyadh',
    url: 'https://sevn-cafe.vercel.app/',
    domain: 'sevn-cafe.vercel.app',
    desc: 'Bilingual café site where a coffee pours as you scroll.',
    tags: ['Next.js', 'React', 'English + Arabic'],
    frames: [['sevn-0', 'Bean'], ['sevn-1', 'Grind'], ['sevn-2', 'Extract'], ['sevn-3', 'Pour'], ['sevn-4', 'Serve']],
    mobile: 'sevn-mobile',
  },
  {
    id: 'gritfox',
    name: 'Grit Fox',
    kind: 'Branding studio',
    url: 'https://gritfox-website.vercel.app/',
    domain: 'gritfox-website.vercel.app',
    desc: 'Studio site with a showreel, 13 case studies and a hands-on playbook.',
    tags: ['React', 'Vite', 'Lenis'],
    frames: [['gritfox-0', 'Intro'], ['gritfox-1', 'Work'], ['gritfox-2', 'Playbook'], ['gritfox-3', 'Numbers']],
    mobile: 'gritfox-mobile',
  },
]

export const lstm = {
  repo: 'https://github.com/RitijS16/lstm-text-generator',
  flow: [['10 words', 'input'], ['Embedding', '64'], ['LSTM', '64 units'], ['Softmax', 'vocab'], ['Next word', 't = 0.8']],
  seeds: ['to be or not to be', 'the king', 'shall i compare thee'],
}

export const projects = [
  {
    id: 'finance',
    kind: 'ML · LLM',
    title: 'Finance & EMI advisor',
    tags: ['Scikit-learn', 'OpenAI'],
    desc: 'Expense tracking, EMI analysis and risk scoring with Random Forest and Isolation Forest.',
    toy: 'emi',
  },
  {
    id: 'emotion',
    kind: 'Computer vision',
    title: 'Facial emotion recognition',
    tags: ['TensorFlow', 'OpenCV'],
    desc: 'A real-time CNN that reads happy, sad, angry or neutral from live video.',
    toy: 'face',
  },
  {
    id: 'shap',
    kind: 'Research · 2025',
    title: 'Explainable cancer detection',
    tags: ['Python', 'SHAP'],
    desc: 'A detection model whose every prediction is explained with SHAP.',
  },
  {
    id: 'uber',
    kind: 'Data',
    title: 'Uber data analysis',
    tags: ['SQL', 'Power BI'],
    desc: '100K+ trips mapped to peak hours and hotspots.',
  },
]

// Months are counted from March 2025 (index 0). `end` is exclusive.
export const timeline = { start: 'Mar 2025', months: 21, ticks: [[0, 'Mar 25'], [3, 'Jun'], [6, 'Sep'], [9, 'Dec'], [12, 'Mar 26'], [15, 'Jun'], [18, 'Sep']] }

export const roles = [
  { id: 'gritfox', short: 'Gritfox', title: 'AI & Technology Intern', org: 'Gritfox', when: 'Oct 2026 – now', start: 19, end: 21, now: true,
    line: 'Websites, ERP modules and AI automation for FMCG clients.' },
  { id: 'terabit', short: 'Terabit Support', title: 'Full Stack Developer Intern', org: 'Terabit Support', when: 'Jan – Jun 2026', start: 10, end: 16,
    line: "Shipped ISB's website on React and Django, APIs included." },
  { id: 'research', short: 'PhD research', title: 'Python & ML Research Intern', org: 'PhD research project', when: 'Jun – Aug 2025', start: 3, end: 6,
    line: 'Cancer-detection model with SHAP explainability.' },
  { id: 'aftermath', short: 'Aftermath Ventures', title: 'Operations Executive', org: 'Aftermath Ventures', when: 'Mar 2025 – Jun 2026', start: 0, end: 16,
    line: 'Ran operations for large esports and tech events.' },
]

export const about = {
  intro: 'CS graduate from Mumbai, working across React, Django and machine learning.',
  badges: [
    ['B.Tech CSE', 'Bharati Vidyapeeth · CGPA 8.2'],
    ['Technical Secretary', '“Excellence” award, Tech-Fest'],
    ['Esports rep', 'Navi Mumbai region'],
  ],
  skills: [
    ['Code', ['Python', 'JavaScript', 'SQL', 'HTML', 'CSS']],
    ['Web', ['React', 'Django', 'REST APIs', 'ERP']],
    ['AI & ML', ['TensorFlow', 'Scikit-learn', 'SHAP', 'Pandas', 'NumPy', 'GenAI']],
    ['Data', ['PostgreSQL', 'MySQL', 'MongoDB', 'Power BI', 'Tableau']],
    ['Cloud', ['AWS', 'Linux', 'Git']],
  ],
  marquee: ['Python', 'React', 'Django', 'TensorFlow', 'Scikit-learn', 'REST APIs', 'PostgreSQL', 'Power BI', 'SHAP', 'AWS'],
}
