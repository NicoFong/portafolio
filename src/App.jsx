import { useState, useEffect, useRef } from "react";

const PROFILE_IMG = "/perfil.png";
// Framer Motion stubs (inline animation via CSS)
function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >  
      {children}
    </div>
  );
}

// ── CURSOR GLOW ──────────────────────────────────────────────
function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        left: pos.x - 200, top: pos.y - 200,
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        transition: "left 0.1s ease, top 0.1s ease",
      }}
    />
  );
}

// ── PARTICLES ─────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: "rgba(139,92,246,0.6)",
            animation: `float ${p.dur}s ${p.delay}s infinite ease-in-out alternate`,
          }}
        />
      ))}
      <style>{`@keyframes float { from { transform: translateY(0px) scale(1); opacity:0.4 } to { transform: translateY(-20px) scale(1.3); opacity:0.9 } }`}</style>
    </div>
  );
}

// ── GRID BACKGROUND ───────────────────────────────────────────
function GridBg() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `
        linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
      maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)",
    }} />
  );
}

// ── LOADING SCREEN ────────────────────────────────────────────
function LoadingScreen({ onDone }) {
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    const t1 = setTimeout(() => setOpacity(0), 1400);
    const t2 = setTimeout(() => onDone(), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#09090B",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 10000, opacity, transition: "opacity 0.5s ease",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", fontFamily: "Inter, sans-serif" }}>
          NF<span style={{ color: "#3b82f6" }}>.</span>
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 6, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i === 0 ? "#3b82f6" : i === 1 ? "#8b5cf6" : "#06b6d4",
              animation: `bounce 1s ${i * 0.2}s infinite ease-in-out alternate`,
            }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes bounce { from { transform: translateY(0) } to { transform: translateY(-12px) } }`}</style>
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    const r = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", r);
    return () => {
      window.removeEventListener("scroll", h);
      window.removeEventListener("resize", r);
    };
  }, []);

  const links = ["inicio", "sobre-mí", "skills", "proyectos", "contacto"];
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 5%",
      background: scrolled ? "rgba(9,9,11,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.4s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 64,
    }}>
      <span style={{ fontWeight: 800, fontSize: 20, color: "#fff", fontFamily: "Inter, sans-serif", letterSpacing: 1, cursor: "pointer" }}
        onClick={() => scrollTo("inicio")}>
        NF<span style={{ color: "#3b82f6" }}>.</span>
      </span>

      {isMobile ? (
        <button onClick={() => setOpen(!open)} style={{
          background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer"
        }}>
          {open ? "✕" : "☰"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 32 }}>
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.55)", fontSize: 14, fontFamily: "Inter, sans-serif",
              textTransform: "capitalize", transition: "color 0.2s",
              padding: "4px 0",
            }}
              onMouseEnter={(e) => e.target.style.color = "#fff"}
              onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.55)"}
            >{l.replace("-", " ")}</button>
          ))}
        </div>
      )}

      {isMobile && open && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 24, zIndex: 101
        }}>
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: "none", border: "none", color: "#fff", fontSize: 20,
              fontFamily: "Inter, sans-serif", textTransform: "capitalize",
              padding: "8px 0"
            }}
              onMouseEnter={(e) => e.target.style.color = "#3b82f6"}
              onMouseLeave={(e) => e.target.style.color = "#fff"}
            >{l.replace("-", " ")}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── HERO ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="inicio" style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "visible", padding: "80px 5% 0",
    }}>
      <GridBg />
      {/* Radial blur accents */}
      <div style={{ position: "absolute", top: "15%", left: "10%", width: "40vw", height: "40vw", maxWidth: "200px", maxHeight: "200px", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "8%", width: "30vw", height: "30vw", maxWidth: "150px", maxHeight: "150px", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 60 }}>
        {/* Text */}
        <div style={{ flex: "1 1 340px", minWidth: 280 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 99,
            border: "1px solid rgba(59,130,246,0.3)",
            background: "rgba(59,130,246,0.08)",
            marginBottom: 24,
            animation: "fadeDown 0.7s ease both",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e" }} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "Inter, sans-serif" }}>Disponible para trabajar</span>
          </div>

          <h1 style={{
            fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem, 5vw, 4rem)",
            lineHeight: 1.1, margin: "0 0 8px",
            animation: "fadeDown 0.7s 0.1s ease both",
          }}>
            <span style={{ color: "#fff" }}>Nicolas </span>
            <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Fong</span>
          </h1>

          <h2 style={{
            fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "rgba(255,255,255,0.5)", margin: "0 0 20px",
            animation: "fadeDown 0.7s 0.2s ease both",
          }}>Full Stack Developer</h2>

          <p style={{
            color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.75, maxWidth: 480,
            fontFamily: "Inter, sans-serif", margin: "0 0 36px",
            animation: "fadeDown 0.7s 0.3s ease both",
          }}>
            Desarrollador Full Stack con 1 año de experiencia construyendo aplicaciones modernas y experiencias web atractivas con React y Node.js.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 44, animation: "fadeDown 0.7s 0.4s ease both" }}>
            <GlowBtn onClick={() => document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth" })}>
              Ver proyectos
            </GlowBtn>
            <GlowBtn ghost onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}>
              Contactarme
            </GlowBtn>
            <a href="https://github.com/NicoFong" target="_blank" rel="noreferrer">
              <GlowBtn ghost style={{ padding: "10px 16px" }}>
                <GithubIcon size={18} />
              </GlowBtn>
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, animation: "fadeDown 0.7s 0.5s ease both" }}>
            {[
              { n: "1+", label: "Año de experiencia" },
              { n: "2", label: "Proyectos destacados" },
              { n: "React & Node.js", label: "Stack principal" },
            ].map(({ n, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Inter, sans-serif" }}>{label}</div>
              </div>
            ))}
          </div>

          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 20, fontFamily: "Inter, sans-serif", animation: "fadeDown 0.7s 0.6s ease both" }}>
            📍 Medellín, Colombia
          </p>
        </div>

        {/* Photo */}
        <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center", animation: "fadeDown 0.9s 0.2s ease both" }}>
          <div style={{ position: "relative" }}>
            {/* Halo rings */}
            <div style={{ position: "absolute", inset: -20, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)", animation: "pulse 3s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1.5px solid rgba(59,130,246,0.35)" }} />
            <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: "1px solid rgba(139,92,246,0.2)" }} />
            <img
              src={PROFILE_IMG}
              alt="Nicolas Fong"
              style={{
                width: 260, height: 260, borderRadius: "50%", objectFit: "cover",
                display: "block", position: "relative", zIndex: 1,
                boxShadow: "0 0 40px rgba(59,130,246,0.35), 0 20px 60px rgba(0,0,0,0.6)",
                animation: "float 5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        animation: "fadeDown 1s 1s ease both",
      }}>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "Inter, sans-serif", letterSpacing: 2 }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(59,130,246,0.6), transparent)" }} />
      </div>

      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-12px) } }
        @keyframes pulse { 0%,100% { transform:scale(1); opacity:0.6 } 50% { transform:scale(1.08); opacity:1 } }
      `}</style>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────
function About() {
  return (
    <section id="sobre-mí" style={{ padding: "120px 5%", position: "relative" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <SectionLabel>01 · Sobre mí</SectionLabel>
          <h2 style={headingStyle}>Quién soy</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.85, fontFamily: "Inter, sans-serif" }}>
            Soy un desarrollador Full Stack apasionado por crear interfaces modernas y aplicaciones funcionales. Tengo experiencia trabajando con HTML, CSS, JavaScript, React, Node.js, Tailwind CSS y Bootstrap. Disfruto construir experiencias visuales atractivas mientras continúo aprendiendo nuevas tecnologías y mejorando mis habilidades.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ── SKILLS ────────────────────────────────────────────────────
const skillGroups = [
  {
    title: "Frontend",
    color: "#3b82f6",
    skills: [
      { name: "HTML5", icon: "🌐" }, { name: "CSS3", icon: "🎨" },
      { name: "JavaScript", icon: "⚡" }, { name: "React", icon: "⚛️" },
      { name: "Tailwind CSS", icon: "💨" }, { name: "Bootstrap", icon: "🅱️" },
    ],
  },
  {
    title: "Backend",
    color: "#8b5cf6",
    skills: [{ name: "Node.js", icon: "🟩" }],
  },
  {
    title: "Herramientas",
    color: "#06b6d4",
    skills: [
      { name: "Git", icon: "🔀" }, { name: "GitHub", icon: "🐙" }, { name: "VS Code", icon: "💻" },
    ],
  },
];

function SkillCard({ name, icon, color }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "18px 20px", borderRadius: 14,
        background: hov ? `rgba(${color === "#3b82f6" ? "59,130,246" : color === "#8b5cf6" ? "139,92,246" : "6,182,212"},0.12)` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? color + "66" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(12px)",
        transition: "all 0.25s ease",
        transform: hov ? "translateY(-4px)" : "none",
        display: "flex", alignItems: "center", gap: 12,
        cursor: "default",
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ color: hov ? "#fff" : "rgba(255,255,255,0.65)", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14 }}>{name}</span>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" style={{ padding: "120px 5%", position: "relative" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>02 · Skills</SectionLabel>
          <h2 style={{ ...headingStyle, textAlign: "center" }}>Tecnologías que uso</h2>
        </FadeIn>
        {skillGroups.map(({ title, color, skills }, gi) => (
          <FadeIn key={title} delay={gi * 0.1}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 3, height: 22, borderRadius: 2, background: color }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "rgba(255,255,255,0.7)", fontSize: 15 }}>{title}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {skills.map((s) => <SkillCard key={s.name} {...s} color={color} />)}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── PROJECTS ──────────────────────────────────────────────────
const projects = [
  {
    title: "AI ChatBot",
    desc: "Aplicación de chatbot con inteligencia artificial enfocada en brindar una experiencia conversacional fluida y moderna.",
    tags: ["React", "JavaScript", "CSS", "Node.js"],
    demo: "https://chatbot-ai-1-1j58.onrender.com/",
    repo: "https://github.com/NicoFong/ChatBot-AI",
    color: "#3b82f6",
    emoji: "🤖",
  },
  {
    title: "AgilShop",
    desc: "Landing page moderna y responsive con una experiencia visual atractiva y una navegación intuitiva.",
    tags: ["HTML", "CSS", "JavaScript"],
    demo: "https://agilshop-one.vercel.app/",
    repo: "https://github.com/NicoFong/Landing-page-Agilshop",
    color: "#8b5cf6",
    emoji: "🛍️",
  },
];

function ProjectCard({ title, desc, tags, demo, repo, color, emoji }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 20,
        border: `1px solid ${hov ? color + "55" : "rgba(255,255,255,0.07)"}`,
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        padding: 32,
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-8px)" : "none",
        boxShadow: hov ? `0 24px 60px ${color}22` : "none",
        cursor: "default",
      }}
    >
      {/* Mock preview */}
      <div style={{
        height: 160, borderRadius: 12, marginBottom: 24,
        background: `linear-gradient(135deg, ${color}22, rgba(139,92,246,0.12))`,
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 56, position: "relative", overflow: "hidden",
      }}>
        {emoji}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 70%, ${color}18, transparent 60%)` }} />
      </div>

      <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 10 }}>{title}</h3>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, fontFamily: "Inter, sans-serif", marginBottom: 18 }}>{desc}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {tags.map((t) => (
          <span key={t} style={{
            fontSize: 12, fontFamily: "Inter, sans-serif", padding: "4px 10px", borderRadius: 99,
            background: `${color}18`, border: `1px solid ${color}44`, color: color,
          }}>{t}</span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <a href={demo} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
          <GlowBtn style={{ width: "100%", justifyContent: "center" }}>Ver demo</GlowBtn>
        </a>
        <a href={repo} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
          <GlowBtn ghost style={{ width: "100%", justifyContent: "center" }}>Código fuente</GlowBtn>
        </a>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="proyectos" style={{ padding: "120px 5%", position: "relative" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>03 · Proyectos</SectionLabel>
          <h2 style={{ ...headingStyle, textAlign: "center" }}>Trabajo destacado</h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 28, marginTop: 16 }}>
          {projects.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.15}>
              <ProjectCard {...p} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── EXPERIENCE ────────────────────────────────────────────────
function Experience() {
  return (
    <section id="experiencia" style={{ padding: "80px 5%", position: "relative" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>04 · Experiencia</SectionLabel>
          <h2 style={{ ...headingStyle, textAlign: "center" }}>Trayectoria</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div style={{
            marginTop: 32, padding: 32, borderRadius: 18,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)", display: "flex", gap: 24,
          }}>
            <div style={{ flex: "0 0 auto" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💼</div>
            </div>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>Full Stack Developer</div>
              <div style={{ color: "#3b82f6", fontSize: 13, fontFamily: "Inter, sans-serif", marginBottom: 10 }}>2025 – Presente · 1 año</div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.75, fontFamily: "Inter, sans-serif" }}>
                1 año de experiencia desarrollando aplicaciones web modernas, interfaces responsivas y soluciones enfocadas en la experiencia del usuario utilizando tecnologías actuales como React y Node.js.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────
const contacts = [
  { icon: "✉️", label: "Email", value: "nicofongg@gmail.com", href: "mailto:nicofongg@gmail.com", color: "#3b82f6" },
  { icon: "💬", label: "WhatsApp", value: "+57 317 291 3531", href: "https://wa.me/573172913531", color: "#22c55e" },
  { icon: "🐙", label: "GitHub", value: "github.com/NicoFong", href: "https://github.com/NicoFong", color: "#8b5cf6" },
  { icon: "📍", label: "Ubicación", value: "Medellín, Colombia", href: null, color: "#06b6d4" },
];

function Contact() {
  return (
    <section id="contacto" style={{ padding: "120px 5%", position: "relative" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>05 · Contacto</SectionLabel>
          <h2 style={{ ...headingStyle, textAlign: "center" }}>Trabajemos juntos</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 15, marginBottom: 52 }}>
            ¿Tienes un proyecto en mente? Estoy disponible y con ganas de colaborar.
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {contacts.map(({ icon, label, value, href, color }, i) => (
            <FadeIn key={label} delay={i * 0.08}>
              <ContactCard icon={icon} label={label} value={value} href={href} color={color} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon, label, value, href, color }) {
  const [hov, setHov] = useState(false);
  const inner = (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "26px 24px", borderRadius: 16,
        background: hov ? `${color}12` : "rgba(255,255,255,0.03)",
        border: `1px solid ${hov ? color + "55" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(12px)",
        transition: "all 0.25s ease",
        transform: hov ? "translateY(-4px)" : "none",
        cursor: href ? "pointer" : "default",
        display: "flex", alignItems: "center", gap: 16,
        textDecoration: "none",
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Inter, sans-serif", marginBottom: 3, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
        <div style={{ color: hov ? "#fff" : "rgba(255,255,255,0.75)", fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none" }}>{inner}</a> : inner;
}

// ── FOOTER ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding: "40px 5%", textAlign: "center",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
        Nicolas Fong © 2026
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.15)", fontSize: 12, marginTop: 6 }}>
        Construyendo experiencias digitales modernas.
      </div>
    </footer>
  );
}

// ── BACK TO TOP ───────────────────────────────────────────────
function BackTop() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const h = () => setVis(window.scrollY > 500);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return vis ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed", bottom: 32, right: 32, zIndex: 200,
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px rgba(59,130,246,0.4)",
        color: "#fff", fontSize: 20,
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1) translateY(-2px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >↑</button>
  ) : null;
}

// ── SHARED COMPONENTS ─────────────────────────────────────────
const headingStyle = {
  fontFamily: "Inter, sans-serif", fontWeight: 800,
  fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#fff",
  margin: "8px 0 20px", lineHeight: 1.2,
};

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
      color: "#3b82f6", letterSpacing: "0.14em", textTransform: "uppercase",
      textAlign: "center", marginBottom: 10,
    }}>{children}</div>
  );
}

function GlowBtn({ children, ghost, onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 22px", borderRadius: 10,
        background: ghost ? "transparent" : hov ? "linear-gradient(135deg,#2563eb,#7c3aed)" : "linear-gradient(135deg,#3b82f6,#8b5cf6)",
        border: ghost ? "1px solid rgba(255,255,255,0.15)" : "none",
        color: ghost ? (hov ? "#fff" : "rgba(255,255,255,0.7)") : "#fff",
        fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14,
        cursor: "pointer", transition: "all 0.22s ease",
        display: "inline-flex", alignItems: "center", gap: 8,
        boxShadow: !ghost && hov ? "0 8px 24px rgba(59,130,246,0.4)" : "none",
        transform: hov ? "translateY(-1px)" : "none",
        ...style,
      }}
    >{children}</button>
  );
}

function GithubIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ background: "#09090B", minHeight: "100vh", width: "100vw", overflowX: "hidden", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html {
          scroll-behavior: smooth;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }
        body {
          margin: 0;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          background: #09090B;   /* mismo tono que el contenedor raíz */
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #09090B; }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.4); border-radius:3px; }
        a { text-decoration: none; color: inherit; }
      `}</style>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <CursorGlow />
      <Particles />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
      </main>
      <BackTop />
    </div>
  );
}
