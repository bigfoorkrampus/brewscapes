"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tea {
  id: string;
  name: string;
  origin: string;
  benefit: string;
  steepTime: string;
  temperature: string;
  note: string;
  tag: string;
  image: string;
  color: string;
  textColor: string;
}

interface Benefit {
  icon: string;
  title: string;
  body: string;
}

interface BrewStep {
  step: number;
  title: string;
  body: string;
  detail: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TEAS: Tea[] = [
  {
    id: "chamomile",
    name: "Roman Chamomile",
    origin: "Egypt",
    benefit: "Sleep & calm",
    steepTime: "5–7 min",
    temperature: "90 °C",
    note: "Apple-blossom sweetness with a honeyed finish",
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1636406519300-e37e44598da8?q=80&w=1600&auto=format&fit=crop",
    color: "#f5efd4",
    textColor: "#5c4a1e",
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha Root",
    origin: "India",
    benefit: "Stress relief",
    steepTime: "8–10 min",
    temperature: "95 °C",
    note: "Earthy and warming with a subtle nutty depth",
    tag: "Adaptogen",
    image:
      "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=1600&auto=format&fit=crop",
    color: "#e8dfc8",
    textColor: "#4a3820",
  },
  {
    id: "tulsi",
    name: "Tulsi Holy Basil",
    origin: "India",
    benefit: "Immunity boost",
    steepTime: "5–6 min",
    temperature: "85 °C",
    note: "Clove-like spice softened by peppery florals",
    tag: "Sacred herb",
    image:
      "https://images.unsplash.com/photo-1625205745194-765af7e4b47b?q=80&w=1600&auto=format&fit=crop",
    color: "#dce8d4",
    textColor: "#2a4020",
  },
  {
    id: "elderflower",
    name: "Elderflower & Mint",
    origin: "Scandinavia",
    benefit: "Digestion",
    steepTime: "4–5 min",
    temperature: "80 °C",
    note: "Bright citrus lift with a cool, lingering finish",
    tag: "Seasonal",
    image:
      "https://images.unsplash.com/photo-1596344084757-b83f2081da8b?q=80&w=1600&auto=format&fit=crop",
    color: "#e4ecd8",
    textColor: "#344a28",
  },
  {
    id: "reishi",
    name: "Reishi Mushroom",
    origin: "Japan",
    benefit: "Longevity",
    steepTime: "10–15 min",
    temperature: "98 °C",
    note: "Rich umami warmth with a faint bitter edge",
    tag: "Functional",
    image:
      "https://images.unsplash.com/photo-1608060563275-a60fb5027f8d?q=80&w=1600&auto=format&fit=crop",
    color: "#dfd4c8",
    textColor: "#3e2e24",
  },
  {
    id: "hibiscus",
    name: "Wild Hibiscus",
    origin: "West Africa",
    benefit: "Heart health",
    steepTime: "5–7 min",
    temperature: "100 °C",
    note: "Cranberry-tart brightness with a rose petal bloom",
    tag: "Antioxidant",
    image:
      "https://images.unsplash.com/photo-1567990989224-6441e1483ac8?q=80&w=1600&auto=format&fit=crop",
    color: "#f0d8d8",
    textColor: "#5c2020",
  },
];

const BENEFITS: Benefit[] = [
  {
    icon: "🌙",
    title: "Deeper sleep",
    body: "Certain herbs modulate GABA receptors, easing the mind into restorative sleep within 30 minutes of brewing.",
  },
  {
    icon: "🌿",
    title: "Reduced cortisol",
    body: "Adaptogens like ashwagandha and tulsi are clinically shown to lower morning cortisol levels over four weeks.",
  },
  {
    icon: "🫁",
    title: "Gut harmony",
    body: "Bitters and carminatives in elderflower and peppermint support digestive enzyme production after meals.",
  },
  {
    icon: "🧠",
    title: "Mental clarity",
    body: "L-theanine in green and white teas promotes alpha-wave activity — calm alertness without caffeine anxiety.",
  },
  {
    icon: "🛡️",
    title: "Immune defence",
    body: "Elderberry and echinacea blends contain polyphenols that arm the body's innate immune response.",
  },
  {
    icon: "❤️",
    title: "Cardiovascular care",
    body: "Hibiscus and hawthorn compounds measurably reduce systolic blood pressure within eight weeks of daily use.",
  },
];

const BREW_STEPS: BrewStep[] = [
  {
    step: 1,
    title: "Source the herb",
    body: "Single-origin, whole-leaf botanicals preserve the essential oils responsible for taste and efficacy.",
    detail: "Look for a harvest date, not just a 'best before'.",
  },
  {
    step: 2,
    title: "Control the water",
    body: "Temperature is the single most important variable in extraction. Boiling water destroys delicate volatile compounds.",
    detail: "Use filtered water for a clean mineral baseline.",
  },
  {
    step: 3,
    title: "Time the steep",
    body: "Under-steeping wastes the herb; over-steeping releases astringent tannins. Set a timer — every minute counts.",
    detail: "Cover your cup while steeping to trap aromatic steam.",
  },
  {
    step: 4,
    title: "Drink with intention",
    body: "The ritual of preparation is itself therapeutic. Slow down. Notice the colour, the steam, the first sip.",
    detail: "Morning teas are best drunk before eating for full absorption.",
  },
];

// ─── Easing helpers ───────────────────────────────────────────────────────────

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut, delay },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Small reusable atoms ─────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.6875rem",
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--color-olive)",
        marginBottom: "0.5rem",
      }}
    >
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-serif, Georgia, serif)",
        fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
        color: "var(--color-forest)",
        textWrap: "balance",
      }}
    >
      {children}
    </h2>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Teas", "Wellness", "Brewing", "Journal"];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOut }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        background: scrolled
          ? "rgba(245,240,232,0.88)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        boxShadow: scrolled
          ? "0 1px 0 0 rgba(28,36,25,0.08)"
          : "none",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-xl, 1280px)",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "4.5rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              background: "var(--color-forest)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            🍃
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "var(--color-forest)",
              letterSpacing: "-0.02em",
            }}
          >
            Brewscapes
          </span>
        </Link>

        {/* Desktop links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
          aria-label="Primary"
          className="hide-mobile"
        >
          {links.map((l) => (
            <Link
              key={l}
              href={`#${l.toLowerCase()}`}
              className="nav-link"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              {l}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href="#newsletter"
            className="btn btn-primary btn-sm hide-mobile"
          >
            Start brewing
          </Link>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="show-mobile"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              color: "var(--color-forest)",
            }}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <rect
                x="0"
                y="0"
                width="22"
                height="2"
                rx="1"
                fill="currentColor"
                style={{
                  transform: menuOpen
                    ? "translateY(7px) rotate(45deg)"
                    : "none",
                  transformOrigin: "center",
                  transition: "transform 0.25s ease",
                }}
              />
              <rect
                x="0"
                y="7"
                width="22"
                height="2"
                rx="1"
                fill="currentColor"
                style={{
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity 0.2s ease",
                }}
              />
              <rect
                x="0"
                y="14"
                width="22"
                height="2"
                rx="1"
                fill="currentColor"
                style={{
                  transform: menuOpen
                    ? "translateY(-7px) rotate(-45deg)"
                    : "none",
                  transformOrigin: "center",
                  transition: "transform 0.25s ease",
                }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{
              overflow: "hidden",
              background: "rgba(245,240,232,0.97)",
              borderTop: "1px solid var(--color-border-soft)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              style={{
                padding: "1.25rem clamp(1.25rem, 5vw, 3rem) 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              {links.map((l) => (
                <Link
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "0.75rem 0",
                    fontWeight: 500,
                    color: "var(--color-forest)",
                    textDecoration: "none",
                    fontSize: "1rem",
                    borderBottom: "1px solid var(--color-border-soft)",
                  }}
                >
                  {l}
                </Link>
              ))}
              <Link
                href="#newsletter"
                className="btn btn-primary"
                onClick={() => setMenuOpen(false)}
                style={{ marginTop: "1rem", textAlign: "center" }}
              >
                Start brewing
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(160deg, #2d4a2a 0%, #3d5e3a 45%, #556038 100%)",
      }}
    >
      {/* Parallax background image */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-10%",
          y,
          opacity: 0.18,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1615205597144-5c7c885291d2?q=80&w=2000&auto=format&fit=crop"
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </motion.div>

      {/* Grain texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          pointerEvents: "none",
        }}
      />

      {/* Soft radial highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 65% 50%, rgba(168,184,154,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "var(--container-xl, 1280px)",
          margin: "0 auto",
          padding: "7rem clamp(1.25rem, 5vw, 3rem) 5rem",
          width: "100%",
          opacity,
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.15 }}
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-sage-light, #c4d4b8)",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "2rem",
                height: "1.5px",
                background: "var(--color-sage-light, #c4d4b8)",
              }}
            />
            Ancient wisdom, modern science
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: easeOut, delay: 0.25 }}
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#f5f0e8",
              marginBottom: "1.75rem",
              textWrap: "balance",
            }}
          >
            Discover the
            <br />
            <em
              style={{
                fontStyle: "italic",
                color: "var(--color-sage-light, #c4d4b8)",
              }}
            >
              healing power
            </em>
            <br />
            of tea
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.4 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              lineHeight: 1.7,
              color: "rgba(245,240,232,0.75)",
              marginBottom: "2.5rem",
              maxWidth: "520px",
            }}
          >
            From Himalayan ashwagandha to African hibiscus — explore curated
            single-origin herbs, expert brewing guides, and the science of
            plant-based wellness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.55 }}
            style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}
          >
            <Link
              href="#teas"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 2rem",
                background: "#f5f0e8",
                color: "var(--color-forest, #2d4a2a)",
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 8px 28px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.25)";
              }}
            >
              Explore the collection
              <span style={{ fontSize: "1rem" }}>→</span>
            </Link>
            <Link
              href="#wellness"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 2rem",
                background: "rgba(255,255,255,0.1)",
                color: "#f5f0e8",
                border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: "9999px",
                fontWeight: 500,
                fontSize: "0.9rem",
                textDecoration: "none",
                backdropFilter: "blur(8px)",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.18)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.25)";
              }}
            >
              Learn the science
            </Link>
          </motion.div>

          {/* Social proof ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            style={{
              marginTop: "3.5rem",
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "120+", label: "Herbal varieties" },
              { value: "48 hrs", label: "Sourced to door" },
              { value: "50k+", label: "Wellness members" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  style={{
                    fontFamily: "var(--font-serif, Georgia, serif)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#f5f0e8",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(245,240,232,0.55)",
                    marginTop: "0.2rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          color: "rgba(245,240,232,0.45)",
          fontSize: "0.65rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{ fontSize: "0.875rem" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}

// ─── Tea showcase strip ───────────────────────────────────────────────────────

function TeaShowcase() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState<string>("chamomile");
  const activeTea = TEAS.find((t) => t.id === active)!;

  return (
    <section
      id="teas"
      ref={ref}
      style={{
        padding: "var(--space-section, 6rem) 0",
        background: "var(--color-surface, #faf7f2)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-xl, 1280px)",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "3.5rem",
          }}
        >
          <div>
            <motion.div variants={fadeUp}>
              <Eyebrow>The Collection</Eyebrow>
            </motion.div>
            <motion.div variants={fadeUp}>
              <SectionHeading>
                Six herbs.
                <br />
                Infinite healing.
              </SectionHeading>
            </motion.div>
          </div>
          <motion.p
            variants={fadeUp}
            style={{
              maxWidth: "380px",
              color: "var(--color-ink-soft, #3a4636)",
              lineHeight: 1.7,
              fontSize: "0.9375rem",
            }}
          >
            Every blend is sourced direct from small-scale farms, third-party
            tested for purity, and packed within 72 hours of arrival.
          </motion.p>
        </motion.div>

        {/* Selector tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
          role="tablist"
          aria-label="Select tea"
        >
          {TEAS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "9999px",
                border: "1.5px solid",
                borderColor:
                  active === t.id
                    ? "var(--color-forest, #2d4a2a)"
                    : "var(--color-border, #d0c8b0)",
                background:
                  active === t.id
                    ? "var(--color-forest, #2d4a2a)"
                    : "transparent",
                color:
                  active === t.id
                    ? "#f5f0e8"
                    : "var(--color-ink-soft, #3a4636)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: "0.01em",
              }}
            >
              {t.name}
            </button>
          ))}
        </motion.div>

        {/* Active tea card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTea.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: easeOut }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
              borderRadius: "1.5rem",
              overflow: "hidden",
              background: activeTea.color,
              boxShadow: "var(--shadow-xl, 0 16px 48px rgba(28,36,25,0.14))",
              minHeight: "480px",
            }}
          >
            {/* Image */}
            <div style={{ position: "relative", minHeight: "320px" }}>
              <Image
                src={activeTea.image}
                alt={activeTea.name}
                fill
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to right, ${activeTea.color}40, transparent)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  left: "1.25rem",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.3rem 0.875rem",
                    background: activeTea.color,
                    color: activeTea.textColor,
                    borderRadius: "9999px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {activeTea.tag}
                </span>
              </div>
            </div>

            {/* Info */}
            <div
              style={{
                padding: "clamp(2rem, 4vw, 3rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1.5rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: activeTea.textColor,
                    opacity: 0.6,
                    marginBottom: "0.4rem",
                  }}
                >
                  {activeTea.origin} · {activeTea.benefit}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-serif, Georgia, serif)",
                    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: activeTea.textColor,
                    lineHeight: 1.15,
                  }}
                >
                  {activeTea.name}
                </h3>
              </div>

              <p
                style={{
                  color: activeTea.textColor,
                  opacity: 0.7,
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  fontFamily: "var(--font-serif, Georgia, serif)",
                }}
              >
                &ldquo;{activeTea.note}&rdquo;
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {[
                  { label: "Steep time", value: activeTea.steepTime },
                  { label: "Temperature", value: activeTea.temperature },
                ].map((d) => (
                  <div
                    key={d.label}
                    style={{
                      background: "rgba(255,255,255,0.45)",
                      borderRadius: "0.875rem",
                      padding: "0.875rem 1rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: activeTea.textColor,
                        opacity: 0.55,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {d.label}
                    </p>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: activeTea.textColor,
                        fontFamily: "var(--font-serif, Georgia, serif)",
                      }}
                    >
                      {d.value}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="#newsletter"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1.75rem",
                  background: activeTea.textColor,
                  color: activeTea.color,
                  borderRadius: "9999px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  alignSelf: "flex-start",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88";
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "";
                }}
              >
                Add to ritual →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Featured teas grid ───────────────────────────────────────────────────────

function FeaturedTeas() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="featured"
      ref={ref}
      style={{
        padding: "var(--space-section, 6rem) 0",
        background: "var(--color-bg, #f5f0e8)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-xl, 1280px)",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>Featured picks</Eyebrow>
          </motion.div>
          <motion.div variants={fadeUp}>
            <SectionHeading>Brews for every moment</SectionHeading>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: "1.5rem",
          }}
        >
          {TEAS.map((tea, i) => (
            <motion.div
              key={tea.id}
              variants={fadeUp}
              custom={i * 0.05}
              style={{
                borderRadius: "1.25rem",
                overflow: "hidden",
                background: "var(--color-surface, #faf7f2)",
                border: "1px solid var(--color-border-soft, #e0d8c4)",
                boxShadow: "var(--shadow-card)",
                transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease",
                cursor: "pointer",
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 48px rgba(28,36,25,0.13)",
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  height: "200px",
                  background: tea.color,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={tea.image}
                  alt={tea.name}
                  fill
                  style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "0.875rem",
                    right: "0.875rem",
                    padding: "0.25rem 0.6rem",
                    background: "rgba(245,240,232,0.9)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "9999px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-forest, #2d4a2a)",
                  }}
                >
                  {tea.tag}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "1.25rem 1.375rem 1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-olive, #6b7c4a)",
                    marginBottom: "0.35rem",
                  }}
                >
                  {tea.benefit} · {tea.origin}
                </p>
                <h4
                  style={{
                    fontFamily: "var(--font-serif, Georgia, serif)",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "var(--color-forest, #2d4a2a)",
                    letterSpacing: "-0.02em",
                    marginBottom: "0.6rem",
                  }}
                >
                  {tea.name}
                </h4>
                <p
                  style={{
                    fontSize: "0.8375rem",
                    color: "var(--color-ink-muted, #5c6b56)",
                    lineHeight: 1.6,
                    marginBottom: "1.1rem",
                  }}
                >
                  {tea.note}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.75rem",
                    color: "var(--color-ink-muted, #5c6b56)",
                    borderTop: "1px solid var(--color-border-soft, #e0d8c4)",
                    paddingTop: "0.875rem",
                  }}
                >
                  <span>⏱ {tea.steepTime}</span>
                  <span>🌡 {tea.temperature}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Wellness benefits ────────────────────────────────────────────────────────

function WellnessBenefits() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="wellness"
      ref={ref}
      style={{
        padding: "var(--space-section, 6rem) 0",
        background: "var(--color-forest, #2d4a2a)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(168,184,154,0.07) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168,184,154,0.05) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "var(--container-xl, 1280px)",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-sage-light, #c4d4b8)",
              marginBottom: "0.75rem",
            }}
          >
            The science
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "#f5f0e8",
              textWrap: "balance",
              marginBottom: "1rem",
            }}
          >
            What tea does to your body
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              color: "rgba(245,240,232,0.6)",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
            }}
          >
            Centuries of use backed by modern phytochemistry. Each herb targets
            real physiological pathways.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: "1.25rem",
          }}
        >
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              variants={fadeUp}
              custom={i * 0.06}
              style={{
                padding: "1.75rem 2rem",
                borderRadius: "1.125rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                transition: "background 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}
              whileHover={{
                background: "rgba(255,255,255,0.09)",
                borderColor: "rgba(196,212,184,0.3)",
                y: -3,
              }}
            >
              <span style={{ fontSize: "1.875rem", display: "block", marginBottom: "1rem" }}>
                {b.icon}
              </span>
              <h4
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#f5f0e8",
                  marginBottom: "0.625rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {b.title}
              </h4>
              <p
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "rgba(245,240,232,0.6)",
                }}
              >
                {b.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Brewing guide preview ────────────────────────────────────────────────────

function BrewingGuide() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="brewing"
      ref={ref}
      style={{
        padding: "var(--space-section, 6rem) 0",
        background: "var(--color-cream-deep, #ede6d6)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-xl, 1280px)",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "clamp(2.5rem, 6vw, 5rem)",
            alignItems: "center",
          }}
        >
          {/* Left: copy */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Eyebrow>The method</Eyebrow>
            </motion.div>
            <motion.div variants={fadeUp} style={{ marginBottom: "1.25rem" }}>
              <SectionHeading>
                Brewing is
                <br />
                a practice,
                <br />
                not a task.
              </SectionHeading>
            </motion.div>
            <motion.p
              variants={fadeUp}
              style={{
                color: "var(--color-ink-soft, #3a4636)",
                fontSize: "0.9375rem",
                lineHeight: 1.75,
                marginBottom: "2.5rem",
                maxWidth: "440px",
              }}
            >
              Most people never get the full therapeutic potential of their herbs
              because water temperature and timing are treated as an afterthought.
              Our four-step method changes that.
            </motion.p>

            <motion.div
              variants={stagger}
              style={{ display: "flex", flexDirection: "column", gap: "0" }}
            >
              {BREW_STEPS.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  custom={i * 0.08}
                  style={{
                    display: "flex",
                    gap: "1.25rem",
                    paddingBottom: i < BREW_STEPS.length - 1 ? "1.75rem" : 0,
                    position: "relative",
                  }}
                >
                  {/* Connector line */}
                  {i < BREW_STEPS.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "1.125rem",
                        top: "2.5rem",
                        bottom: 0,
                        width: "1px",
                        background:
                          "linear-gradient(to bottom, var(--color-sage, #a8b89a), transparent)",
                      }}
                    />
                  )}
                  {/* Step number */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "2.25rem",
                      height: "2.25rem",
                      borderRadius: "50%",
                      background: "var(--color-forest, #2d4a2a)",
                      color: "#f5f0e8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-serif, Georgia, serif)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      zIndex: 1,
                    }}
                  >
                    {step.step}
                  </div>
                  <div style={{ paddingTop: "0.2rem" }}>
                    <h5
                      style={{
                        fontFamily: "var(--font-serif, Georgia, serif)",
                        fontWeight: 700,
                        color: "var(--color-forest, #2d4a2a)",
                        fontSize: "1rem",
                        marginBottom: "0.35rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {step.title}
                    </h5>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-ink-soft, #3a4636)",
                        lineHeight: 1.65,
                        marginBottom: "0.35rem",
                      }}
                    >
                      {step.body}
                    </p>
                    <p
                      style={{
                        fontSize: "0.775rem",
                        color: "var(--color-ink-muted, #5c6b56)",
                        fontStyle: "italic",
                      }}
                    >
                      {step.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} style={{ marginTop: "2.5rem" }}>
              <Link href="#newsletter" className="btn btn-primary">
                Get the full guide
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: easeOut, delay: 0.25 }}
            style={{
              position: "relative",
              borderRadius: "1.75rem",
              overflow: "hidden",
              aspectRatio: "4/5",
              boxShadow: "var(--shadow-xl, 0 16px 48px rgba(28,36,25,0.14))",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?q=80&w=1600&auto=format&fit=crop"
              alt="Brewing herbal tea in a ceramic pot"
              fill
              style={{ objectFit: "cover" }}
            />
            {/* Floating note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.55, ease: easeOut }}
              style={{
                position: "absolute",
                bottom: "1.75rem",
                left: "1.5rem",
                right: "1.5rem",
                background: "rgba(245,240,232,0.92)",
                backdropFilter: "blur(12px)",
                borderRadius: "1rem",
                padding: "1.125rem 1.375rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-olive, #6b7c4a)",
                  marginBottom: "0.35rem",
                }}
              >
                Pro tip
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-ink, #1c2419)",
                  lineHeight: 1.55,
                  fontStyle: "italic",
                  fontFamily: "var(--font-serif, Georgia, serif)",
                }}
              >
                &ldquo;Always warm your vessel first. Cold ceramic steals 10 °C
                from your brew before the first leaf unfurls.&rdquo;
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter CTA ───────────────────────────────────────────────────────────

function Newsletter() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  return (
    <section
      id="newsletter"
      ref={ref}
      style={{
        padding: "var(--space-section, 6rem) 0",
        background: "var(--color-surface-alt, #f0ead8)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-xl, 1280px)",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: easeOut }}
          style={{
            borderRadius: "2rem",
            overflow: "hidden",
            background: "linear-gradient(140deg, var(--color-forest, #2d4a2a) 0%, #1a2f18 100%)",
            padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.75rem, 5vw, 4rem)",
            position: "relative",
            textAlign: "center",
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(168,184,154,0.15), transparent)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-sage-light, #c4d4b8)",
                marginBottom: "1rem",
              }}
            >
              Free brewing guide
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: "#f5f0e8",
                marginBottom: "1.25rem",
                textWrap: "balance",
              }}
            >
              Your ritual starts here.
            </h2>
            <p
              style={{
                fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)",
                color: "rgba(245,240,232,0.65)",
                lineHeight: 1.7,
                marginBottom: "2.5rem",
                maxWidth: "500px",
                margin: "0 auto 2.5rem",
              }}
            >
              Join 50,000 tea drinkers and get our 32-page Healing Tea Field
              Guide — plus a new herbal recipe every Sunday morning.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "1rem 2rem",
                    background: "rgba(168,184,154,0.2)",
                    border: "1px solid rgba(196,212,184,0.4)",
                    borderRadius: "9999px",
                    color: "var(--color-sage-light, #c4d4b8)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                  }}
                >
                  <span>✓</span> Guide on its way — check your inbox.
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: "520px",
                    margin: "0 auto",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      flex: "1 1 240px",
                      padding: "0.875rem 1.25rem",
                      borderRadius: "9999px",
                      border: "1.5px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.08)",
                      color: "#f5f0e8",
                      fontSize: "0.9375rem",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor =
                        "rgba(196,212,184,0.6)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor =
                        "rgba(255,255,255,0.15)";
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "0.875rem 1.875rem",
                      borderRadius: "9999px",
                      background: "#f5f0e8",
                      color: "var(--color-forest, #2d4a2a)",
                      border: "none",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.75 : 1,
                      letterSpacing: "0.02em",
                      transition: "transform 0.2s ease, opacity 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "";
                    }}
                  >
                    {loading ? "Sending…" : "Send my guide →"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "0.75rem",
                color: "rgba(245,240,232,0.38)",
                letterSpacing: "0.02em",
              }}
            >
              No spam. Unsubscribe in one click.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();

  const footerLinks = [
    {
      heading: "Teas",
      links: ["Chamomile", "Ashwagandha", "Tulsi", "Hibiscus", "Reishi", "Elderflower"],
    },
    {
      heading: "Learn",
      links: ["Brewing guides", "Wellness science", "Tea origins", "Journal", "Recipes"],
    },
    {
      heading: "Company",
      links: ["About", "Sustainability", "Wholesale", "Press", "Careers"],
    },
  ];

  return (
    <footer
      style={{
        background: "var(--color-ink, #1c2419)",
        padding: "4.5rem 0 2rem",
        color: "rgba(245,240,232,0.65)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-xl, 1280px)",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: "clamp(2rem, 5vw, 4rem)",
            paddingBottom: "3.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  background: "var(--color-forest, #2d4a2a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                }}
              >
                🍃
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#f5f0e8",
                  letterSpacing: "-0.02em",
                }}
              >
                Brewscapes
              </span>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: "rgba(245,240,232,0.5)",
                maxWidth: "220px",
                marginBottom: "1.5rem",
              }}
            >
              Single-origin herbal teas sourced from family farms across six continents.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {["𝕏", "IG", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: "2.125rem",
                    height: "2.125rem",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "rgba(245,240,232,0.5)",
                    textDecoration: "none",
                    transition: "border-color 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(196,212,184,0.5)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#f5f0e8";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(255,255,255,0.14)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(245,240,232,0.5)";
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#f5f0e8",
                  marginBottom: "1.25rem",
                }}
              >
                {col.heading}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((l) => (
                  <li key={l} style={{ marginBottom: "0.65rem" }}>
                    <a
                      href="#"
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(245,240,232,0.5)",
                        textDecoration: "none",
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "#f5f0e8";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "rgba(245,240,232,0.5)";
                      }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "rgba(245,240,232,0.35)" }}>
            © {year} Brewscapes. All rights reserved.
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "rgba(245,240,232,0.35)",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            Developed by{" "}
            <a
              href="#"
              style={{
                color: "rgba(196,212,184,0.7)",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-sage-light, #c4d4b8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(196,212,184,0.7)";
              }}
            >
              Brand Launch Studio Delhi, India
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrewscapesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

        .hide-mobile { display: flex; }
        .show-mobile { display: none; }

        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }

        input::placeholder { color: rgba(196,212,184,0.55); }
        input:focus { outline: none; }
      `}</style>

      <Nav />
      <main>
        <Hero />
        <TeaShowcase />
        <FeaturedTeas />
        <WellnessBenefits />
        <BrewingGuide />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}