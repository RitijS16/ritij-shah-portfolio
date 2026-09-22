import React from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Home,
  UserRound,
  Wrench,
  FolderKanban,
  BriefcaseBusiness,
  Trophy,
  Menu,
  X,
  Code2,
  Database,
  BrainCircuit,
  BarChart3,
  Download,
  Send,
  ExternalLink,
} from "lucide-react";
import "./index.css";

const skills = [
  "Python", "React.js", "Django", "JavaScript", "REST APIs",
  "SQL", "PostgreSQL", "MySQL", "Pandas", "NumPy",
  "TensorFlow", "Power BI", "Matplotlib", "AWS", "Linux",
];

const projects = [
  {
    title: "Facial Emotion Recognition",
    type: "COMPUTER VISION",
    description: "Real-time facial emotion recognition using a CNN model with TensorFlow.",
    tags: ["Python", "TensorFlow", "CNN"],
    icon: BrainCircuit,
  },
  {
    title: "Uber Data Analysis",
    type: "DATA ANALYSIS",
    description: "Analyzed 100K+ Uber trip records to identify demand, duration and location trends.",
    tags: ["Python", "Pandas", "Power BI"],
    icon: BarChart3,
  },
  {
    title: "ISB Website",
    type: "WEB DEVELOPMENT",
    description: "Responsive website work during my Full Stack internship using React, Django and REST APIs.",
    tags: ["React", "Django", "REST API"],
    icon: Code2,
  },
];

const experience = [
  {
    period: "JAN 2026 — JUN 2026",
    company: "Terabit Support",
    role: "Full Stack Intern",
    description: "Built a responsive ISB website with React.js and Django, reusable UI components, REST APIs, validation and asynchronous operations.",
  },
  {
    period: "JUN 2025 — AUG 2025",
    company: "PHD Project",
    role: "Python Intern",
    description: "Worked on cancer-detection research with preprocessing, feature engineering, predictive modeling, SHAP and model evaluation.",
  },
  {
    period: "MAR 2025 — JUN 2026",
    company: "Aftermath Ventures",
    role: "Operations Executive",
    description: "Handled operations for esports and technology events, coordinating logistics, resources, schedules and stakeholders.",
  },
];

const navItems = [
  ["Home", "home", Home],
  ["About", "about", UserRound],
  ["Skills", "skills", Wrench],
  ["Projects", "projects", FolderKanban],
  ["Experience", "experience", BriefcaseBusiness],
  ["Achievements", "achievements", Trophy],
  ["Contact", "contact", Mail],
];

function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      <aside className={`portfolio-sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span>RS</span><i />
        </div>

        <nav className="sidebar-nav">
          {navItems.map(([label, id, Icon], index) => (
            <a
              href={`#${id}`}
              key={id}
              className={index === 0 ? "sidebar-link active" : "sidebar-link"}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-socials">
          <a href="https://github.com/RitijS16?tab=repositories" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a>
          <a href="https://www.linkedin.com/in/ritij-shah" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
          <a href="mailto:shahritij2004@gmail.com" aria-label="Email"><Mail size={19} /></a>
        </div>

        <div className="sidebar-footer">
          <span>LET'S</span>
          <strong>BUILD<br />SOMETHING<br />GREAT.</strong>
        </div>
      </aside>

      <button className="mobile-menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </>
  );
}

function TopNav() {
  return (
    <header className="top-nav">
      <div className="top-nav-links">
        {["Home", "About", "Skills", "Projects", "Experience", "Achievements", "Contact"].map((item, index) => (
          <a key={item} className={index === 0 ? "top-link active" : "top-link"} href={`#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
      </div>
      <a className="connect-button" href="#contact">
        <Send size={15} />
        Let's Connect
      </a>
    </header>
  );
}

function Avatar() {
  return (
    <div className="avatar-scene" aria-hidden="true">
      <div className="avatar-ring ring-one" />
      <div className="avatar-ring ring-two" />
      <div className="avatar-glow" />
      <div className="avatar-code-badge"><Code2 size={23} /></div>

      <div className="avatar">
        <div className="avatar-hair" />
        <div className="avatar-head">
          <div className="avatar-ear left" />
          <div className="avatar-ear right" />
          <div className="avatar-glasses">
            <span /><span /><b />
          </div>
          <div className="avatar-nose" />
          <div className="avatar-mouth" />
        </div>
        <div className="avatar-neck" />
        <div className="avatar-hoodie">
          <div className="hoodie-string left" />
          <div className="hoodie-string right" />
          <span className="hoodie-logo">{}</span>
        </div>
      </div>

      <div className="avatar-note">Better<br />solutions<br />everyday.</div>
      <div className="avatar-bracket">{"< />"}</div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><Icon size={23} /></div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="dashboard-hero">
      <div className="hero-copy">
        <p className="eyebrow">// HELLO, I'M</p>
        <h1>RITIJ<br /><span>SHAH</span></h1>
        <p className="role-line">Full Stack Developer <b>|</b> Python Developer <b>|</b> Data Enthusiast</p>
        <p className="hero-description">
          I build scalable web applications, work with data, and explore AI to solve real-world problems.
          Passionate about creating clean, efficient and impactful digital solutions.
        </p>

        <div className="hero-actions">
          <a href="#projects" className="gradient-button">View My Work <ArrowUpRight size={18} /></a>
          <a href="https://github.com/RitijS16?tab=repositories" target="_blank" rel="noreferrer" className="outline-button">
            <Github size={17} /> GitHub
          </a>
        </div>

        <div className="hero-mini-stats">
          <div><strong>3+</strong><span>Work Experiences</span></div>
          <div><strong>4+</strong><span>Projects Completed</span></div>
          <div><strong>8.2</strong><span>CGPA (B.Tech)</span></div>
        </div>

        <div className="tech-stack-strip">
          <p>// TECH STACK</p>
          <div className="stack-icons">
            {["PY", "⚛", "DJ", "SQL", "DB", "AWS", "TW"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>

        <blockquote>
          “Turning ideas into impactful digital solutions.”
          <small>— RITIJ SHAH</small>
        </blockquote>
      </div>

      <div className="hero-main">
        <div className="hero-intro">
          <p className="eyebrow">// BUILDING DIGITAL SOLUTIONS</p>
          <h2>Clean Code<br /><span>Real Impact</span></h2>
          <p>Computer Science graduate with hands-on experience in full-stack development, data analysis and AI/ML. I love building products that make a difference.</p>
          <div className="availability"><i /> Available for Opportunities</div>
        </div>

        <Avatar />

        <div className="floating-word-list">Ideas<br />Code<br />Build<br />Learn<br />Repeat</div>

        <div className="stats-grid">
          <StatCard icon={Code2} value="4+" label="Projects Completed" />
          <StatCard icon={BriefcaseBusiness} value="3+" label="Work Experiences" />
          <StatCard icon={Trophy} value="2026" label="B.Tech Graduate" />
          <StatCard icon={BrainCircuit} value="AI" label="Data & ML" />
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ kicker, title, action }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function About() {
  return (
    <section id="about" className="content-section">
      <SectionHeading kicker="// ABOUT ME" title="A developer who likes to build." />
      <div className="about-grid">
        <div className="about-panel">
          <span className="panel-number">01</span>
          <h3>Full-stack mindset.</h3>
          <p>I enjoy working across the stack — from responsive React interfaces to Django backends, APIs and databases.</p>
        </div>
        <div className="about-panel">
          <span className="panel-number">02</span>
          <h3>Data + AI curiosity.</h3>
          <p>My projects and internship work include computer vision, machine learning, data analysis and explainable AI.</p>
        </div>
        <div className="about-panel wide">
          <span className="panel-number">03</span>
          <h3>Builder beyond code.</h3>
          <p>Alongside technology, I've worked on large-scale esports and technology events, managing operations, people, logistics and live execution.</p>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="content-section">
      <SectionHeading kicker="// TECH STACK" title="Tools I work with." />
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <motion.div key={skill} className="skill-card" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.025 }}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{skill}</strong>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="content-section">
      <SectionHeading
        kicker="// FEATURED PROJECTS"
        title="Selected work."
        action={<a className="view-all" href="https://github.com/RitijS16?tab=repositories" target="_blank" rel="noreferrer">View All Projects <ArrowUpRight size={16} /></a>}
      />

      <div className="projects-grid">
        {projects.map((project, index) => {
          const Icon = project.icon;
          return (
            <motion.article key={project.title} className="project-tile" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <div className="project-visual">
                <div className={`project-visual-art art-${index + 1}`}>
                  <Icon size={54} />
                  <span>{project.type}</span>
                </div>
              </div>
              <div className="project-content">
                <div className="project-title-row">
                  <div><span className="project-type">{project.type}</span><h3>{project.title}</h3></div>
                  <span className="project-arrow"><ArrowUpRight size={19} /></span>
                </div>
                <p>{project.description}</p>
                <div className="tag-row">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                <a href="https://github.com/RitijS16?tab=repositories" target="_blank" rel="noreferrer" className="project-github"><Github size={14} /> View on GitHub</a>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="content-section">
      <SectionHeading kicker="// EXPERIENCE TIMELINE" title="Where I've worked." />
      <div className="experience-track">
        {experience.map((item, index) => (
          <motion.article key={item.company} className="experience-item" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }}>
            <span className="experience-dot" />
            <p>{item.period}</p>
            <h3>{item.company}</h3>
            <strong>{item.role}</strong>
            <span>{item.description}</span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Achievements() {
  return (
    <section id="achievements" className="achievement-strip">
      <div>
        <p className="eyebrow">// BEYOND CODE</p>
        <h2>Leadership & execution.</h2>
      </div>
      <div className="achievement-metrics">
        <span><strong>75+</strong> EVENTS</span>
        <span><strong>15K+</strong> PARTICIPANTS</span>
        <span><strong>3M+</strong> VIEWS</span>
        <span><strong>60+</strong> CREW LED</span>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <p className="eyebrow">// LET'S CONNECT</p>
      <h2>LET'S BUILD<br /><span>SOMETHING REAL.</span></h2>
      <p>Open to opportunities in full-stack development, Python, data and AI.</p>
      <div className="contact-actions">
        <a href="mailto:shahritij2004@gmail.com" className="gradient-button"><Mail size={17} /> Get In Touch</a>
        <a href="https://www.linkedin.com/in/ritij-shah" target="_blank" rel="noreferrer" className="outline-button"><Linkedin size={17} /> LinkedIn</a>
        <a href="https://github.com/RitijS16?tab=repositories" target="_blank" rel="noreferrer" className="outline-button"><Github size={17} /> GitHub</a>
      </div>
    </section>
  );
}

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="portfolio-shell">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="portfolio-page">
        <TopNav />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Achievements />
          <Contact />
        </main>
        <footer className="portfolio-footer">
          <span>© 2026 RITIJ SHAH</span>
          <span>REACT · DJANGO · PYTHON · DATA · AI</span>
        </footer>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
