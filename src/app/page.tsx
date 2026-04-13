"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

const Background3D = dynamic(() => import("@/components/Background3D"), {
  ssr: false,
  loading: () => <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)', zIndex: 0
  }} />,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("AI");

  const containerRef = useRef<HTMLDivElement>(null);


  const projects = [
    {
      title: "Hospital Management System",
      description: "Full-stack hospital management web application with patient registration, doctor dashboards, appointment scheduling, and admin controls. Built with a React frontend and Django REST backend.",
      category: "Web",
      tech: ["React", "Django", "REST API", "Docker"],
      github: "https://github.com/Sudarshan-DevOp/Hospital_frontend",
      github2: "https://github.com/Sudarshan-DevOp/Hospital_Backend"
    },
    {
      title: "Medi Chat App (Gen AI)",
      description: "LLM-based application with fine-tuning using LLAMA, LoRA, and QLoRA. AI-powered chat with scalable backend.",
      category: "AI",
      tech: ["Flask", "Docker", "Kubernetes", "LLAMA", "LoRA"],
      github: "https://github.com/Sudarshan-DevOp/medi-chat-ai"
    },
    {
      title: "Traffic Intelligence Detection System",
      description: "AI/ML system to detect roadside speed boards and estimate vehicle speed.",
      category: "AI",
      tech: ["CNN", "Flask", "Deep Learning"],
      github: "https://github.com/Sudarshan-DevOp/Traffic-Intelligence-Detection-System"
    },
    {
      title: "YouTube Video Explainer",
      description: "Agentic AI that analyzes YouTube videos and explains them in a simplified way.",
      category: "AI",
      tech: ["Crew AI", "Flask"],
      github: "https://github.com/Sudarshan-DevOp/Video_Explain_Agent "
    }
  ];

  type ProjectType = { title: string; description: string; category: string; tech: string[]; github: string; github2?: string; };
  const filteredProjects = projects.filter((p: ProjectType) =>
    p.category === projectFilter || p.tech.includes(projectFilter)
  );



  useEffect(() => {
    const textArray = [
      "Software Developer",
    ];
    let charIndex = 0;
    let arrayIndex = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const type = () => {
      const currentWord = textArray[arrayIndex];
      const isComplete = !isDeleting && charIndex === currentWord.length;
      const isDeleted = isDeleting && charIndex === 0;

      if (isComplete) {
        setIsTyping(false);
        isDeleting = true;
        timer = setTimeout(type, 2000); // pause at end
      } else if (isDeleted) {
        setIsTyping(false);
        isDeleting = false;
        arrayIndex = (arrayIndex + 1) % textArray.length;
        timer = setTimeout(type, 500); // pause before tying next
      } else {
        setIsTyping(true);
        charIndex += isDeleting ? -1 : 1;
        setTypedText(currentWord.substring(0, charIndex));
        timer = setTimeout(type, isDeleting ? 50 : 100);
      }
    };

    timer = setTimeout(type, 1000);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    // Hero Avatar float
    gsap.to(".avatar-shape", {
      y: -15,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 3,
    });

    // Animate Hero Content
    const tl = gsap.timeline();
    tl.fromTo(
      ".hero-left",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }
    ).fromTo(
      ".hero-right > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
      "-=0.5"
    );

    // Fade up animation for sections
    const sections = gsap.utils.toArray([".about-section", ".skills-section", ".experience-section", ".education-section", ".projects-section", ".contact-section"]);

    sections.forEach((section: unknown) => {
      const el = section as HTMLElement;
      gsap.fromTo(
        el.querySelectorAll(".section-title, .box-card, .timeline-item, .skills-category, .project-card, .contact-item"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    // Stats Banner Scroll Animation
    gsap.fromTo(
      ".stat-item",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".stats-banner",
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );

  }, { scope: containerRef });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "experience", "education", "projects", "contact"];
      const scrollY = window.pageYOffset;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollY >= el.offsetTop - 200) {
          setActiveTab(section);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <div ref={containerRef}>
      <Suspense fallback={null}>
        <Background3D />
      </Suspense>
      <div className="background-effects">
        <div className="glow-orb left"></div>
        <div className="glow-orb right"></div>
      </div>

      <div className="app-container">
        <header className="navbar">
          <a href="#" className="logo">
            Sudarshan<span>.</span>
          </a>
          <nav className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
            <a href="#home" className={activeTab === "home" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="#about" className={activeTab === "about" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#skills" className={activeTab === "skills" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
            <a href="#experience" className={activeTab === "experience" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Experience</a>
            <a href="#education" className={activeTab === "education" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Education</a>
            <a href="#projects" className={activeTab === "projects" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
            <a href="#contact" className={activeTab === "contact" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Contact</a>

            {/* Mobile Only CV button */}
            <a href="/SudarshanShrivastava.pdf" className="btn primary-btn mobile-cv-btn" style={{ marginTop: '1rem', display: 'none' }}>
              Download CV <i className="fas fa-download"></i>
            </a>
          </nav>
          <div className="nav-actions">
            <a href="/SudarshanShrivastava.pdf" className="btn primary-btn">
              Download CV <i className="fas fa-download"></i>
            </a>
          </div>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </header>

        <main>
          {/* Hero Section */}
          <section id="home" className="hero">
            <div className="hero-left">
              <div className="avatar-container">
                <div className="avatar-shape">
                  <Image
                    src="/terminal_profile.png"
                    alt="Sudarshan Shrivastava"
                    width={500}
                    height={600}
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="hero-right">
              <p className="greeting">Hello, I&apos;m</p>
              <h1 className="name">Sudarshan Shrivastava</h1>
              <h2 className="title">
                I&apos;m a <span className="highlight typed-text">{typedText}</span>
                <span className={`cursor ${isTyping ? "" : "blink"}`}>&nbsp;</span>
              </h2>

              <p className="bio">
                Passionate Fullstack Software Developer focused on building high-quality, high-performance applications with excellent user experience. Open to collaboration and opportunities.
              </p>

              <div className="social-links">
                <a href="https://github.com/Sudarshan-DevOp" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                <a href="mailto:sudarshanshrivastava7@gmail.com"><i className="fas fa-envelope"></i></a>
              </div>

              <div className="hero-cta">
                <a href="#contact" className="btn primary-btn btn-solid">Contact Me</a>
                <a href="#projects" className="btn secondary-btn btn-outline">View Projects</a>
              </div>
            </div>
          </section>

          {/* Stats Banner */}
          <section className="stats-banner">
            <div className="stat-item">
              <h3>1+</h3>
              <p>Years of<br />Experience</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>4+</h3>
              <p>Projects<br />Completed</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>5</h3>
              <p>Technologies<br />Mastered</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>3</h3>
              <p>Certifications<br />Earned</p>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="about-section">
            <div className="section-title">
              <h2>About <span>Me</span></h2>
            </div>
            <div className="about-content box-card">
              <i className="fas fa-quote-left quote-icon"></i>
              <p>
                Hello!! I am Sudarshan Shrivastava, a tech enthusiast from Gwalior, MP. I am deeply passionate about exploring new technologies, solving complex problems, and building innovative software solutions.
              </p>
              <p>
                My expertise spans Python, fullstack development (React.js, Django, Flask), AI/ML integration, and DevOps practices. I enjoy pushing the boundaries of what&apos;s possible with agentic AI and robust application architectures.
              </p>
              <div className="highlight-box">
                <p><strong>Driven by curiosity, powered by code. Always eager to build something amazing!</strong></p>
              </div>
              <div className="about-tags">
                <span className="tag">Ex-NCC Cadet</span>
                <span className="tag">Basketball Player</span>
                <span className="tag">English & Hindi</span>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="skills-section">
            <div className="section-title">
              <h2>Technical <span>Skills</span></h2>
            </div>
            <div className="skills-container box-card">
              <div className="skills-category">
                <h3>Languages & Fundamentals</h3>
                <div className="skills-grid">
                  <div className="skill-card"><i className="fab fa-python"></i> Python</div>
                  <div className="skill-card"><i className="fas fa-database"></i> SQL</div>
                  <div className="skill-card"><i className="fas fa-code"></i> DSA</div>
                </div>
              </div>
              <div className="skills-category">
                <h3>Frontend Development</h3>
                <div className="skills-grid">
                  <div className="skill-card"><i className="fab fa-react"></i> React.js</div>
                  <div className="skill-card"><i className="fas fa-mobile-alt"></i> Flutter</div>
                </div>
              </div>
              <div className="skills-category">
                <h3>Backend Development</h3>
                <div className="skills-grid">
                  <div className="skill-card"><i className="fab fa-python"></i> Django</div>
                  <div className="skill-card"><i className="fab fa-python"></i> Flask</div>
                  <div className="skill-card"><i className="fas fa-server"></i> REST APIs</div>
                </div>
              </div>
              <div className="skills-category">
                <h3>Databases</h3>
                <div className="skills-grid">
                  <div className="skill-card"><i className="fas fa-leaf"></i> MongoDB</div>
                  <div className="skill-card"><i className="fas fa-fire"></i> Firebase</div>
                  <div className="skill-card"><i className="fas fa-database"></i> Supabase</div>
                </div>
              </div>
              <div className="skills-category">
                <h3>DevOps & Cloud</h3>
                <div className="skills-grid">
                  <div className="skill-card"><i className="fab fa-aws"></i> AWS</div>
                  <div className="skill-card"><i className="fab fa-docker"></i> Docker</div>
                  <div className="skill-card"><i className="fas fa-dharmachakra"></i> Kubernetes</div>
                  <div className="skill-card"><i className="fas fa-infinity"></i> CI/CD</div>
                </div>
              </div>
              <div className="skills-category">
                <h3>AI / ML</h3>
                <div className="skills-grid">
                  <div className="skill-card"><i className="fas fa-brain"></i> Machine Learning</div>
                  <div className="skill-card"><i className="fas fa-brain"></i> Deep Learning</div>
                  <div className="skill-card"><i className="fas fa-robot"></i> LLMs</div>
                  <div className="skill-card"><i className="fas fa-network-wired"></i> Langchain</div>
                </div>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="experience-section">
            <div className="section-title">
              <h2>My <span>Experience</span></h2>
            </div>
            <div className="timeline">
              {/* AI Intern */}
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content box-card">
                  <div className="timeline-header">
                    <h3>AI Intern</h3>
                    <div className="timeline-company">
                      Nickelfox <i className="fas fa-robot text-cyan"></i>
                    </div>
                    <span className="timeline-date">Mar 2026 - Present</span>
                  </div>
                  <p>Working on advanced AI solutions, model fine-tuning, and integrating agentic functionalities into comprehensive applications.</p>
                </div>
              </div>

              {/* Developer Intern */}
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content box-card">
                  <div className="timeline-header">
                    <h3>Application Developer Intern</h3>
                    <div className="timeline-company">
                      Dinfinity Educeng LLP <i className="fas fa-code text-cyan"></i>
                    </div>
                    <span className="timeline-date">Aug 2024 - Nov 2024</span>
                  </div>
                  <p>Developed full-stack web solutions, optimized API performance, and contributed to interactive end-user features.</p>
                </div>
              </div>

            </div>
          </section>

          {/* Education Section */}
          <section id="education" className="education-section">
            <div className="section-title">
              <h2>My <span>Education & Certifications</span></h2>
            </div>
            <div className="timeline">
              {/* Education */}
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content box-card">
                  <div className="timeline-header">
                    <h3>B.Tech in Computer Science Engineering</h3>
                    <div className="timeline-company">
                      Institute of Technology and Management, Gwalior, M.P. <i className="fas fa-graduation-cap text-cyan"></i>
                    </div>
                    <span className="timeline-date">Nov 2021 - May 2025</span>
                  </div>
                  <p>Coursework in Data Structures, Algorithms, Web Development, and Deep Learning.</p>
                </div>
              </div>

              {/* Certifications */}
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content box-card">
                  <div className="timeline-header">
                    <h3>Certifications</h3>
                    <div className="timeline-company">
                      Professional Development <i className="fas fa-certificate text-cyan"></i>
                    </div>
                  </div>
                  <ul style={{ listStyleType: 'disc', color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>AWS Cloud Foundation</li>
                    <li>Python Web Development (ICT)</li>
                    <li>DevOps on AWS</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="projects-section">
            <div className="section-title">
              <h2>Featured <span>Projects</span></h2>
            </div>

            <div className="project-filters">
              {['AI', 'Web', 'DevOps'].map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${projectFilter === filter ? 'active' : ''}`}
                  onClick={() => setProjectFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="project-grid">
              {filteredProjects.map((project: ProjectType, idx: number) => (
                <div className="project-card" key={idx}>
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <div className="project-tags">
                      {project.tech.map((t: string, i: number) => <span key={i}>{t}</span>)}
                    </div>
                    <p>{project.description}</p>
                    <div className="project-links">
                      <a href={project.github} target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> {project.github2 ? 'Frontend' : 'Source Code'}</a>
                      {project.github2 && (
                        <a href={project.github2} target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> Backend</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="contact-section">
            <div className="section-title">
              <h2>Get In <span>Touch</span></h2>
            </div>

            <div className="contact-container">
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                <div className="contact-info">
                  <h3>Email Me</h3>
                  <a href="mailto:sudarshanshrivastava7@gmail.com">sudarshanshrivastava7@gmail.com</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
                <div className="contact-info">
                  <h3>Call Me</h3>
                  <p>+91 9827763713</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div className="contact-info">
                  <h3>Location</h3>
                  <p>A-7 New Vivekanand Colony, Gwalior, MP, India</p>
                </div>
              </div>

            </div>
          </section>
        </main>

        <footer>
          <p>
            &copy; {new Date().getFullYear()} Sudarshan Shrivastava. Designed with <span style={{ color: "red" }}>❤</span> and custom code.
          </p>
        </footer>
      </div>
    </div>
  );
}
