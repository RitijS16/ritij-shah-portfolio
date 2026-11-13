// All copy and facts on the site come from this file (sourced from Ritij's resumes
// and the lstm-text-generator repo). Edit here, not in the components.

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
    kind: 'Website · café & bakery brand, Saudi Arabia',
    url: 'https://sevn-cafe.vercel.app/',
    domain: 'sevn-cafe.vercel.app',
    desc: 'A bilingual website for a specialty coffee and bakery brand in Riyadh. Scrolling the home page pours a coffee from bean to cup, frame by frame. Behind it sit the menu with prices in SAR, ordering, table reservations, locations and franchise enquiries, in English and Arabic.',
    features: ['Scroll-to-pour film on the home page', 'English and Arabic', 'Menu priced in SAR, incl. VAT', 'Ordering, reservations and franchise enquiries', '“Seven rituals” picker'],
    tags: ['Next.js', 'React', 'Vercel'],
    frames: [['sevn-0', 'Bean'], ['sevn-1', 'Grind'], ['sevn-2', 'Extract'], ['sevn-3', 'Pour'], ['sevn-4', 'Serve']],
    mobile: 'sevn-mobile',
    tone: 'dark',
  },
  {
    id: 'gritfox',
    name: 'Grit Fox',
    kind: 'Website · branding studio',
    url: 'https://gritfox-website.vercel.app/',
    domain: 'gritfox-website.vercel.app',
    desc: 'The website for Grit Fox, a boutique branding studio for F&B, hospitality and FMCG brands. It opens on an oversized eye and a showreel, lists thirteen brand case studies, and has a playbook you explore letter by letter, rolling-number stats and a kickoff form that briefs the studio before the first call.',
    features: ['Showreel and animated intro', '13 brand case studies', 'Hover-or-tap A–F playbook', 'Rolling-number stats', 'Kickoff brief form'],
    tags: ['React', 'Vite', 'Lenis', 'Vercel'],
    frames: [['gritfox-0', 'Intro'], ['gritfox-1', 'Selected work'], ['gritfox-2', 'Playbook'], ['gritfox-3', 'Numbers']],
    mobile: 'gritfox-mobile',
    tone: 'light',
  },
]

export const lstm = {
  repo: 'https://github.com/RitijS16/lstm-text-generator',
  spec: [
    ['Input', '10 words, lowercased, punctuation stripped'],
    ['Embedding', '64 dimensions'],
    ['Recurrent', 'LSTM, 64 units'],
    ['Output', 'Softmax over the full vocabulary'],
    ['Training', '100,000 sequences · 90/10 split · Adam · early stopping'],
    ['Sampling', 'Temperature 0.8'],
  ],
  seeds: ['to be or not to be', 'the king', 'shall i compare thee'],
}

export const projects = [
  {
    id: 'finance',
    kind: 'Machine learning · LLM',
    title: 'Personal finance & EMI advisor',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'OpenAI'],
    desc: 'An AI-powered personal finance platform for expense tracking, EMI analysis, debt management, financial-health scoring and personalised recommendations. Random Forest and Isolation Forest models handle risk classification, expense prediction and anomaly detection, trained on 10,000+ synthetic financial profiles.',
    toy: 'emi',
  },
  {
    id: 'emotion',
    kind: 'Computer vision · deep learning',
    title: 'Facial emotion recognition',
    tags: ['Python', 'TensorFlow', 'OpenCV'],
    desc: 'A real-time app that reads faces from live video and classifies each one as happy, sad, angry or neutral with a convolutional neural network built in TensorFlow.',
    toy: 'face',
  },
  {
    id: 'shap',
    kind: 'Research internship · 2025',
    title: 'Cancer detection, explained',
    tags: ['Python', 'Machine learning', 'SHAP'],
    desc: "A cancer-detection model built for a PhD research project, covering data cleaning, feature engineering, feature selection and model evaluation. SHAP values show which features drive each prediction, so the model's decisions can be explained instead of taken on trust.",
  },
  {
    id: 'uber',
    kind: 'Data analysis',
    title: 'Uber data analysis',
    tags: ['Python', 'SQL', 'Pandas', 'Power BI'],
    desc: 'An analysis of 100,000+ trip records to find peak-hour demand, trip-duration trends and high-demand locations, presented as interactive Power BI reports for marketing decisions.',
  },
]

// Months are counted from March 2025 (index 0). `end` is exclusive.
export const timeline = { start: 'Mar 2025', months: 21, ticks: [[0, 'Mar 25'], [3, 'Jun'], [6, 'Sep'], [9, 'Dec'], [12, 'Mar 26'], [15, 'Jun'], [18, 'Sep']] }

export const roles = [
  {
    id: 'gritfox', short: 'Gritfox', title: 'AI & Technology Intern', org: 'Gritfox', when: 'Oct 2026 – now', where: 'Thane',
    start: 19, end: 21, now: true,
    points: [
      'Builds websites, ERP solutions and custom software for FMCG clients, from requirements to deployment.',
      'Develops ERP modules that digitise inventory, orders, distribution and billing.',
      'Adds AI features and AI-driven workflow automation to cut manual work in client software.',
    ],
  },
  {
    id: 'terabit', short: 'Terabit Support', title: 'Full Stack Developer Intern', org: 'Terabit Support', when: 'Jan – Jun 2026',
    start: 10, end: 16,
    points: [
      'Developed and deployed a responsive website for ISB with React.js and Django, built from reusable UI components.',
      'Designed the REST APIs between the React frontend and Django backend, with data validation and asynchronous requests.',
      'Worked with stakeholders on requirements and fixed integration issues along the way.',
    ],
  },
  {
    id: 'research', short: 'PhD research', title: 'Python & ML Research Intern', org: 'PhD research project', when: 'Jun – Aug 2025',
    start: 3, end: 6,
    points: [
      'Built a cancer-detection model in Python, from data cleaning and feature engineering to model evaluation.',
      'Used SHAP to explain predictions and surface the features that mattered most.',
    ],
  },
  {
    id: 'aftermath', short: 'Aftermath Ventures', title: 'Operations Executive', org: 'Aftermath Ventures', when: 'Mar 2025 – Jun 2026', where: 'Part-time',
    start: 0, end: 16,
    points: [
      'Ran end-to-end operations for large esports and technology events: logistics, on-ground teams and stakeholders.',
      'Handled scheduling, resource allocation and live incidents during high-pressure events.',
    ],
  },
]

export const about = {
  intro: "I'm Ritij, a Computer Science graduate from Mumbai. I work across the stack: React and Django on the web, Python and TensorFlow for machine learning, and ERP software for real businesses at Gritfox.",
  facts: [
    ['Education', 'B.Tech, Computer Science and Engineering, Bharati Vidyapeeth (Deemed to be University), Pune. 2022–2026, CGPA 8.2'],
    ['School', 'HSC (Science), PK Patil Junior College of Science. 2020–2022, 81%'],
    ['Leadership', 'Technical Secretary, Bharati Vidyapeeth, 2025–26. Received the “Excellence” award for organising the University Tech-Fest.'],
    ['Also', 'Esports representative for the Navi Mumbai region across several titles.'],
  ],
  skills: [
    ['Languages', 'Python, JavaScript, SQL, HTML, CSS'],
    ['Web', 'React.js, Django, REST APIs, ERP development, custom business software'],
    ['ML & data', 'TensorFlow, Scikit-learn, SHAP, Pandas, NumPy, Matplotlib, Seaborn'],
    ['Analysis', 'EDA, statistical analysis, A/B testing'],
    ['AI', 'AI-powered web development, generative AI, prompt engineering, workflow automation'],
    ['Databases', 'MySQL, PostgreSQL, MongoDB'],
    ['BI', 'Power BI, Tableau, Advanced Excel'],
    ['Tools', 'AWS, Linux, Git, GitHub'],
  ],
  marquee: ['Python', 'React.js', 'Django', 'TensorFlow', 'Scikit-learn', 'REST APIs', 'PostgreSQL', 'Power BI', 'SHAP', 'AWS'],
}
