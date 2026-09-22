import React from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Mail,
  ExternalLink,
  Code2,
  Database,
  Brain,
  Trophy,
  Menu,
  X,
  Terminal,
  Sparkles,
  Cpu,
  Layers,
} from "lucide-react";

import "./index.css";

/* =========================
   DATA
========================= */

const skills = [
  "Python",
  "Django",
  "React.js",
  "JavaScript",
  "REST APIs",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "Pandas",
  "NumPy",
  "TensorFlow",
  "Power BI",
  "Matplotlib",
  "AWS",
  "Linux",
];

const projects = [
  {
    title: "Facial Emotion Recognition",
    type: "AI / COMPUTER VISION",
    desc: "Real-time facial emotion recognition application using computer vision and a CNN model built with TensorFlow.",
    tech: ["Python", "TensorFlow", "CNN", "Computer Vision"],
    icon: Brain,
    link: "https://github.com/RitijS16?tab=repositories",
  },
  {
    title: "Uber Data Analysis",
    type: "DATA ANALYTICS",
    desc: "Analyzed 100K+ Uber trip records to identify peak-hour demand, trip-duration trends and high-demand locations.",
    tech: ["Python", "Pandas", "SQL", "Power BI"],
    icon: Database,
    link: "https://github.com/RitijS16?tab=repositories",
  },
  {
    title: "NLP Movie Recommender",
    type: "MACHINE LEARNING",
    desc: "Personalized movie recommendation system using similarity and correlation techniques to improve recommendations.",
    tech: ["Python", "NLP", "Cosine Similarity", "ML"],
    icon: Code2,
    link: "https://github.com/RitijS16?tab=repositories",
  },
  {
    title: "Student Database System",
    type: "DATABASE / SOFTWARE",
    desc: "Application for managing student academics, attendance, exams, registration, courses and grade reporting.",
    tech: ["Python", "SQL", "Database"],
    icon: Layers,
    link: "https://github.com/RitijS16?tab=repositories",
  },
];

const experience = [
  {
    year: "2026",
    role: "Full Stack Intern",
    company: "Terabit Support",
    text: "Developed and deployed a responsive ISB website using React.js and Django. Integrated RESTful APIs, request handling, validation and asynchronous operations.",
  },
  {
    year: "2025",
    role: "Python Intern",
    company: "PHD Project",
    text: "Worked on cancer-detection research using Python, focusing on data preprocessing, feature engineering, model evaluation and SHAP-based interpretability.",
  },
  {
    year: "2025–26",
    role: "Operations Executive",
    company: "Aftermath Ventures",
    text: "Led end-to-end operations for large-scale esports and technology events, coordinating logistics, resources, schedules and stakeholders.",
  },
];

/* =========================
   NAVIGATION
========================= */

function Nav() {
  const [open, setOpen] = React.useState(false);

  const links = [
    "About",
    "Skills",
    "Experience",
    "Projects",
    "Contact",
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <a
          href="#home"
          className="text-lg font-black tracking-tight"
        >
          R<span className="text-white/30">.</span>SHAH
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link"
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden rounded-full border border-white/15 px-4 py-2 text-xs font-medium transition hover:bg-white hover:text-black md:block"
        >
          Let's Talk
        </a>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {open && (
        <div className="mobile-menu border-t border-white/10 px-6 pb-5 md:hidden">
          {links.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block py-3 text-white/60"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* =========================
   FLOATING ORB
========================= */

function FloatingOrb({ className }) {
  return (
    <motion.div
      className={`absolute rounded-full bg-white/10 blur-3xl ${className}`}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -25, 25, 0],
        scale: [1, 1.15, 0.9, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* =========================
   HERO GRAPHIC
========================= */

function HeroGraphic() {
  return (
    <div className="hero-graphic relative mx-auto hidden h-[450px] w-[450px] lg:block">

      <motion.div
        className="absolute inset-12 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute inset-24 rounded-full border border-white/10"
        animate={{ rotate: -360 }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute inset-[135px] rounded-full border border-white/20"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-white/20 bg-white/[0.04] backdrop-blur-xl"
        animate={{
          rotate: [0, 3, -3, 0],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-center">
          <Terminal
            className="mx-auto mb-2"
            size={26}
          />

          <span className="font-mono text-xs text-white/50">
            DEV_MODE
          </span>
        </div>
      </motion.div>

      <motion.div
        className="absolute left-4 top-28 h-3 w-3 rounded-full bg-white"
        animate={{
          x: [0, 30, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute right-8 top-20 h-2 w-2 rounded-full bg-white/70"
        animate={{
          y: [0, 35, 0],
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute bottom-20 left-20 h-2 w-2 rounded-full bg-white/60"
        animate={{
          x: [0, -25, 0],
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />

      <div className="absolute left-10 top-10 font-mono text-[10px] text-white/20">
        PYTHON
      </div>

      <div className="absolute bottom-12 right-5 font-mono text-[10px] text-white/20">
        REACT / DJANGO
      </div>

      <div className="absolute right-0 top-1/2 font-mono text-[10px] text-white/20">
        AI + DATA
      </div>

    </div>
  );
}

/* =========================
   HERO
========================= */

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
    >

      <FloatingOrb className="left-[10%] top-[20%] h-72 w-72" />

      <FloatingOrb className="right-[5%] top-[40%] h-96 w-96" />

      <div className="absolute inset-0 grid-lines opacity-50" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pb-20 pt-32 lg:grid-cols-[1.15fr_.85fr]">

        <div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-3"
          >

            <span className="status-dot" />

            <span className="font-mono text-xs tracking-[0.2em] text-white/40">
              AVAILABLE FOR OPPORTUNITIES
            </span>

          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 font-mono text-xs text-white/30"
          >
            MUMBAI · INDIA
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.7,
            }}
            className="hero-title"
          >
            Ritij
            <br />
            <span>Shah.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-7 flex flex-wrap gap-2"
          >
            <span className="hero-chip">FULL-STACK</span>
            <span className="hero-chip">PYTHON</span>
            <span className="hero-chip">DATA & AI</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-xl font-semibold text-white/65 sm:text-2xl"
          >
            Full-Stack Developer
            <span className="mx-2 text-white/20">
              ·
            </span>
            Python
            <span className="mx-2 text-white/20">
              ·
            </span>
            Data & AI
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 max-w-xl text-base leading-8 text-white/40 sm:text-lg"
          >
            Computer Science graduate building web applications,
            Python-based solutions and data-driven products using
            React, Django, SQL and machine learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-9 flex flex-wrap gap-3"
          >

            <a
              href="#projects"
              className="primary-button"
            >
              Explore Projects
              <ArrowUpRight size={16} />
            </a>

            <a
              href="#contact"
              className="secondary-button"
            >
              Let's Connect
            </a>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 grid max-w-xl grid-cols-3 gap-3"
          >
            <div className="hero-stat">
              <strong>3+</strong>
              <span>Experiences</span>
            </div>
            <div className="hero-stat">
              <strong>4</strong>
              <span>Featured Projects</span>
            </div>
            <div className="hero-stat">
              <strong>2026</strong>
              <span>Graduate</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            className="mt-6 flex items-center gap-6"
          >

            <a
              href="https://github.com/RitijS16?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="social-link"
              aria-label="GitHub"
              title="GitHub"
            >
              <Code2 size={18} />
            </a>

            <a
              href="https://www.linkedin.com/in/ritij-shah"
              target="_blank"
              rel="noreferrer"
              className="social-link"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <ExternalLink size={18} />
            </a>

            <a
              href="mailto:shahritij7841@gmail.com"
              className="social-link"
              aria-label="Email"
              title="Email"
            >
              <Mail size={18} />
            </a>

          </motion.div>

        </div>

        <HeroGraphic />

      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >

        <span className="font-mono text-[9px] tracking-[0.3em] text-white/20">
          SCROLL
        </span>

        <div className="h-10 w-px bg-gradient-to-b from-white/30 to-transparent" />

      </motion.div>

    </section>
  );
}

/* =========================
   SECTION TITLE
========================= */

function SectionTitle({
  number,
  label,
  title,
}) {
  return (
    <div className="mb-14 grid gap-6 md:grid-cols-[.5fr_1.5fr]">

      <p className="font-mono text-xs tracking-[0.25em] text-white/25">
        {number} / {label}
      </p>

      <h2 className="section-title">
        {title}
      </h2>

    </div>
  );
}

/* =========================
   ABOUT
========================= */

function About() {
  return (
    <section
      id="about"
      className="border-y border-white/10 py-28"
    >

      <div className="mx-auto max-w-7xl px-6">

        <SectionTitle
          number="01"
          label="ABOUT"
          title="I build, analyze, and solve."
        />

        <div className="grid gap-10 md:grid-cols-2">

          <div className="glass-card p-8">

            <Terminal
              className="mb-6 text-white/50"
              size={25}
            />

            <p className="text-lg leading-8 text-white/55">
              My background sits at the intersection of software
              development, data and AI. I enjoy turning ideas into
              functional applications and using data to understand
              problems and build better solutions.
            </p>

          </div>

          <div className="glass-card p-8">

            <Cpu
              className="mb-6 text-white/50"
              size={25}
            />

            <p className="text-lg leading-8 text-white/55">
              I've worked with React and Django on a real website,
              researched explainable AI, developed Python-based
              applications and built analytical projects using
              Python, SQL and Power BI.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

/* =========================
   SKILLS
========================= */

function Skills() {
  return (
    <section
      id="skills"
      className="py-28"
    >

      <div className="mx-auto max-w-7xl px-6">

        <SectionTitle
          number="02"
          label="STACK"
          title="Tools I work with."
        />

        <div className="flex flex-wrap gap-3">

          {skills.map((skill, index) => (

            <motion.div
              key={skill}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.035,
              }}
              whileHover={{
                y: -5,
                scale: 1.04,
              }}
              className="skill-pill"
            >
              {skill}
            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}

/* =========================
   EXPERIENCE
========================= */

function Experience() {
  return (
    <section
      id="experience"
      className="border-y border-white/10 py-28"
    >

      <div className="mx-auto max-w-7xl px-6">

        <SectionTitle
          number="03"
          label="EXPERIENCE"
          title="Where I've worked."
        />

        <div className="relative ml-2 border-l border-white/10 md:ml-10">

          {experience.map((item, index) => (

            <motion.article
              key={item.role}
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.15,
              }}
              className="timeline-item"
            >

              <div className="timeline-dot" />

              <div className="glass-card p-7 md:p-9">

                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">

                  <div>

                    <p className="mb-2 font-mono text-xs tracking-widest text-white/30">
                      {item.year}
                    </p>

                    <h3 className="text-2xl font-bold">
                      {item.role}
                    </h3>

                    <p className="mt-1 text-white/40">
                      {item.company}
                    </p>

                  </div>

                  <Sparkles
                    size={20}
                    className="text-white/20"
                  />

                </div>

                <p className="max-w-3xl leading-8 text-white/45">
                  {item.text}
                </p>

              </div>

            </motion.article>

          ))}

        </div>

      </div>

    </section>
  );
}

/* =========================
   PROJECT CARD
========================= */

function ProjectCard({
  project,
  index,
}) {

  const Icon = project.icon;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
      }}
      whileHover={{
        y: -8,
      }}
      className="project-card group"
    >

      <div className="project-number">
        0{index + 1}
      </div>

      <div className="project-icon">
        <Icon size={25} />
      </div>

      <p className="mt-8 font-mono text-[10px] tracking-[0.25em] text-white/30">
        {project.type}
      </p>

      <h3 className="mt-3 text-2xl font-bold">
        {project.title}
      </h3>

      <p className="mt-4 leading-7 text-white/40">
        {project.desc}
      </p>

      <div className="mt-7 flex flex-wrap gap-2">

        {project.tech.map((tech) => (

          <span
            key={tech}
            className="tech-tag"
          >
            {tech}
          </span>

        ))}

      </div>

      <div className="mt-8 flex gap-4">

        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="project-link"
        >
          GitHub
          <ArrowUpRight size={14} />
        </a>

        <a
          href="#contact"
          className="project-link"
        >
          Details
          <ExternalLink size={14} />
        </a>

      </div>

    </motion.article>
  );
}

/* =========================
   PROJECTS
========================= */

function Projects() {
  return (
    <section
      id="projects"
      className="py-28"
    >

      <div className="mx-auto max-w-7xl px-6">

        <SectionTitle
          number="04"
          label="SELECTED WORK"
          title="Things I've built."
        />

        <div className="mb-10 flex items-center justify-between gap-4">
          <p className="max-w-2xl text-sm leading-7 text-white/35">
            A selection of projects across computer vision, analytics,
            machine learning and software development.
          </p>
          <a
            href="https://github.com/RitijS16?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:border-white/25 hover:text-white sm:inline-flex"
          >
            View all repositories <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {projects.map((project, index) => (

            <ProjectCard
              key={project.title}
              project={project}
              index={index}
            />

          ))}

        </div>

      </div>

    </section>
  );
}

/* =========================
   BEYOND CODE
========================= */

function BeyondCode() {
  return (
    <section className="border-y border-white/10 py-14">

      <div className="mx-auto max-w-7xl px-6">

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">

          <div className="flex items-center gap-4">

            <Trophy
              size={20}
              className="text-white/30"
            />

            <div>

              <p className="font-mono text-[10px] tracking-[0.25em] text-white/25">
                BEYOND CODE
              </p>

              <p className="mt-1 text-sm text-white/35">
                Leadership & event experience
              </p>

            </div>

          </div>

          <div className="flex flex-wrap justify-center gap-6 font-mono text-xs text-white/30">

            <span>75+ EVENTS</span>

            <span>15K+ PARTICIPANTS</span>

            <span>3M+ VIEWS</span>

            <span>60+ CREW LED</span>

          </div>

        </div>

      </div>

    </section>
  );
}

/* =========================
   CONTACT
========================= */

function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-32"
    >

      <div className="absolute inset-0 grid-lines opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6">

        <div className="contact-card glass-card overflow-hidden p-10 text-center md:p-20">

          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
          >

            <Sparkles
              className="mx-auto text-white/40"
              size={28}
            />

          </motion.div>

          <p className="mt-7 font-mono text-xs tracking-[0.3em] text-white/25">
            05 / CONTACT
          </p>

          <h2 className="contact-title">
            Let's build
            <br />
            something.
          </h2>

          <p className="mx-auto mt-6 max-w-xl leading-7 text-white/40">
            Looking for opportunities in full-stack development,
            Python, data or AI.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">

            <a
              href="mailto:shahritij7841@gmail.com"
              className="primary-button"
            >
              <Mail size={16} />
              Email Me
            </a>

            <a
              href="https://www.linkedin.com/in/ritij-shah"
              target="_blank"
              rel="noreferrer"
              className="secondary-button"
            >
              <ExternalLink size={16} />
              LinkedIn
            </a>

            <a
              href="https://github.com/RitijS16?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="secondary-button"
            >
              <Code2 size={16} />
              GitHub
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}

/* =========================
   APP
========================= */

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">

      <Nav />

      <main>

        <Hero />

        <About />

        <Skills />

        <Experience />

        <Projects />

        <BeyondCode />

        <Contact />

      </main>

      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 py-8 text-xs text-white/25 sm:flex-row">

          <span>
            © 2026 Ritij Shah
          </span>

          <span className="font-mono">
            REACT · TAILWIND · FRAMER MOTION
          </span>

        </div>

      </footer>

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <App />
);