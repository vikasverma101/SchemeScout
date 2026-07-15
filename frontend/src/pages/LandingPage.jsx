import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Brain, CheckCircle2, Filter, Home, Languages, LayoutGrid, Landmark, Leaf, Briefcase, GraduationCap, HeartPulse, Scale, Cpu, HardHat, Users, Trophy, Bus, Baby, Wrench, Shield, Sparkles, TrendingUp, UserRound, Wand2, X, Zap, Info, Sun, Moon, Palette, LogOut, User, LayoutDashboard } from 'lucide-react'
import axios from 'axios'
import logo from '../assets/logo.png'
import { isAuthenticated, getToken, clearToken } from '../utils/auth.js'
import { useAppSettings, LanguagePicker, LANGUAGES, ACCENT_PRESETS } from '../context/AppSettingsContext.jsx'
import SharedMobileNav from '../components/SharedMobileNav.jsx'

/* ─── Starfield Background ────────────────────────────────── */
const STARS = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  top:  `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2.8 + 0.6,
  cls:  ['star-a','star-b','star-c'][i % 3],
  dur:  `${(Math.random() * 4 + 1.5).toFixed(1)}s`,
  delay: `${(Math.random() * 8).toFixed(1)}s`,
  color: [
    'rgba(129,140,248,0.9)',   // indigo
    'rgba(255,255,255,0.95)',  // white
    'rgba(103,232,249,0.85)',  // cyan
    'rgba(167,139,250,0.8)',   // violet
    'rgba(255,255,255,0.7)',
  ][Math.floor(Math.random() * 5)],
}))

const SHOOTING = [
  { top:'12%', left:'5%',  width:160, delay:'0s',   dur:'5s',  color:'rgba(129,140,248,0.9)', cls:'shooting-star-1' },
  { top:'28%', left:'70%', width:120, delay:'2.8s',  dur:'7s',  color:'rgba(103,232,249,0.8)', cls:'shooting-star-2' },
  { top:'8%',  left:'35%', width:200, delay:'5.5s',  dur:'6s',  color:'rgba(255,255,255,0.7)', cls:'shooting-star-1' },
  { top:'55%', left:'15%', width:140, delay:'9s',    dur:'8s',  color:'rgba(167,139,250,0.8)', cls:'shooting-star-2' },
]

const NEBULAS = [
  // Hero area (0–100vh)
  { top:'5vh',   left:'-5%',   w:500, h:420, color:'rgba(99,102,241,0.22)',  dur:'14s', delay:'0s'  },
  { top:'30vh',  right:'-5%',  w:420, h:420, color:'rgba(6,182,212,0.18)',   dur:'18s', delay:'3s'  },
  { top:'70vh',  left:'30%',   w:360, h:360, color:'rgba(124,58,237,0.16)', dur:'16s', delay:'1s'  },
  // Features area (100–200vh)
  { top:'110vh', left:'-5%',   w:450, h:400, color:'rgba(99,102,241,0.15)', dur:'20s', delay:'6s'  },
  { top:'150vh', right:'5%',   w:380, h:380, color:'rgba(6,182,212,0.14)',  dur:'12s', delay:'4s'  },
  // How It Works (200–300vh)
  { top:'210vh', left:'20%',   w:440, h:340, color:'rgba(124,58,237,0.14)', dur:'22s', delay:'2s'  },
  { top:'260vh', right:'-5%',  w:400, h:400, color:'rgba(99,102,241,0.12)', dur:'17s', delay:'8s'  },
  // Benefits & Footer (300–400vh)
  { top:'320vh', left:'10%',   w:480, h:380, color:'rgba(6,182,212,0.13)',  dur:'15s', delay:'5s'  },
  { top:'370vh', right:'15%',  w:420, h:420, color:'rgba(99,102,241,0.14)', dur:'19s', delay:'7s'  },
]


/* ─── Section Sidebar Navigator ────────────────────────── */
const SIDEBAR_SECTIONS = [
  { id: 'get-started', icon: Home,       label: 'Hero'          },
  { id: 'categories',  icon: LayoutGrid, label: 'Categories'    },
  { id: 'about',       icon: Info,       label: 'About'         },
  { id: 'features',    icon: Sparkles,   label: 'Features'      },
  { id: 'how-it-works',icon: Brain,      label: 'How It Works'  },
  { id: 'benefits',    icon: TrendingUp, label: 'Benefits'      },
]

function SectionSidebar({ activeSection, onNavigate, accentColor, onAccentChange }) {
  const [hovered, setHovered] = useState(null)
  const [showPalette, setShowPalette] = useState(false)
  return (
    <div style={{
      position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)',
      zIndex: 90, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {SIDEBAR_SECTIONS.map(({ id, icon: Icon, label }) => {
        const isActive = activeSection === id
        return (
          <div key={id} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {hovered === id && (
              <motion.div
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                style={{
                  position: 'absolute', right: 54, whiteSpace: 'nowrap',
                  background: 'var(--card-bg, #0d1126)',
                  border: '1px solid var(--card-border, rgba(99,102,241,0.3))',
                  borderRadius: 9, padding: '5px 12px',
                  fontSize: 12, fontWeight: 600,
                  color: isActive ? accentColor : 'var(--page-color)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  pointerEvents: 'none',
                }}
              >{label}</motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
              onClick={() => onNavigate(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              title={label}
              style={{
                width: 44, height: 44, borderRadius: 13, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive
                  ? `linear-gradient(135deg, ${accentColor}e6, ${accentColor}cc)`
                  : 'var(--sidebar-inactive)',
                backdropFilter: 'blur(16px)',
                boxShadow: isActive
                  ? `0 0 18px ${accentColor}88, 0 0 0 1px ${accentColor}66`
                  : 'var(--shadow-card)',
                transition: 'all 0.25s ease',
              }}
            >
              <Icon size={18} color={isActive ? '#fff' : 'var(--sidebar-icon)'} strokeWidth={isActive ? 2.2 : 1.8} />
            </motion.button>
          </div>
        )
      })}

      {/* ── Colour picker button ── */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 6 }}>
        {/* Palette popover */}
        {showPalette && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.92 }}
            style={{
              position: 'absolute', right: 54, bottom: 0,
              background: 'var(--card-bg, #0d1126)',
              border: '1px solid var(--card-border)',
              borderRadius: 14, padding: '12px 14px',
              boxShadow: '0 12px 48px rgba(0,0,0,0.55)',
              backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column', gap: 8, width: 170,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 2 }}>ACCENT COLOR</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {ACCENT_PRESETS.map(({ name, hex }) => (
                <button key={hex} onClick={() => { onAccentChange(hex); setShowPalette(false) }}
                  title={name}
                  style={{
                    width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: hex,
                    outline: accentColor === hex ? `3px solid ${hex}` : '2px solid transparent',
                    outlineOffset: 2,
                    boxShadow: accentColor === hex ? `0 0 10px ${hex}88` : 'none',
                    transform: accentColor === hex ? 'scale(1.18)' : 'scale(1)',
                    transition: 'all 0.18s ease',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          onClick={() => setShowPalette(p => !p)}
          title="Accent Color"
          style={{
            width: 44, height: 44, borderRadius: 13, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: showPalette ? `linear-gradient(135deg, ${accentColor}e6, ${accentColor}cc)` : 'var(--sidebar-inactive)',
            backdropFilter: 'blur(16px)',
            boxShadow: showPalette
              ? `0 0 18px ${accentColor}88, 0 0 0 1px ${accentColor}66`
              : 'var(--shadow-card)',
            transition: 'all 0.25s ease',
          }}
        >
          <Palette size={18} color={showPalette ? '#fff' : accentColor} strokeWidth={1.8} />
        </motion.button>
      </div>
    </div>
  )
}

/* ─── Scheme Banner Carousel ─────────────────────────────── */
const getBanners = (t) => [
  {
    img:      '/banner-education.png',
    imgPos:   'left center',
    scheme:   t('banner1Scheme'),
    tag:      t('banner1Tag'),
    tagColor: '#818cf8',
    desc:     t('banner1Desc'),
    cta:      t('banner1Cta'),
    href:     '/signup',
  },
  {
    img:      '/banner-health.png',
    imgPos:   'right center',
    scheme:   t('banner2Scheme'),
    tag:      t('banner2Tag'),
    tagColor: '#34d399',
    desc:     t('banner2Desc'),
    cta:      t('banner2Cta'),
    href:     '/signup',
  },
  {
    img:      '/banner-agriculture.png',
    imgPos:   'right center',
    scheme:   t('banner3Scheme'),
    tag:      t('banner3Tag'),
    tagColor: '#fbbf24',
    desc:     t('banner3Desc'),
    cta:      t('banner3Cta'),
    href:     '/signup',
  },
]

function SchemeCarousel({ t }) {
  const BANNERS = getBanners(t)
  const [current, setCurrent] = useState(0)
  const [dir,     setDir]     = useState(1)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  const getCtaRoute = (label) => {
    const text = (label || '').toLowerCase()
    if (text.includes('know') || text.includes('learn')) return '/learn-more'
    if (text.includes('eligibility') || text.includes('check')) return '/apply'
    if (text.includes('discover') || text.includes('explore') || text.includes('scheme') || text.includes('category')) return '/dashboard'
    return '/dashboard'
  }

  const go = useCallback((next) => {
    setDir(next > current ? 1 : -1)
    setCurrent(next)
  }, [current])

  const prev = () => go((current - 1 + BANNERS.length) % BANNERS.length)
  const next = () => go((current + 1) % BANNERS.length)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDir(1)
      setCurrent(c => (c + 1) % BANNERS.length)
    }, 5000)
    return () => clearInterval(timerRef.current)
  }, [])

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setDir(1)
      setCurrent(c => (c + 1) % BANNERS.length)
    }, 5000)
  }

  const b = BANNERS[current]

  const variants = {
    enter:  (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <section id="get-started" style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden' }}>
      <AnimatePresence custom={dir} initial={false}>
        <motion.div key={current}
          custom={dir}
          variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: 'absolute', inset: 0 }}>

          {/* Full-screen banner image — each anchored per its imgPos */}
          <img src={b.img} alt={b.scheme}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: b.imgPos, display: 'block' }} />

          {/* Dark overlay — strong on the left for text, fades right to show photo */}
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, rgba(5,8,18,0.93) 0%, rgba(5,8,18,0.75) 38%, rgba(5,8,18,0.35) 62%, rgba(5,8,18,0.08) 100%)' }} />

          {/* Content overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', padding: '70px 6% 60px',
            maxWidth: 660,
          }}>
            {/* Tag */}
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ display: 'inline-block', alignSelf: 'flex-start', fontSize: 11, fontWeight: 700,
                color: b.tagColor, background: `${b.tagColor}20`,
                border: `1px solid ${b.tagColor}50`, borderRadius: 20,
                padding: '4px 14px', marginBottom: 20,
                letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {b.tag}
            </motion.span>

            {/* Scheme name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.55 }}
              style={{ fontSize: 'clamp(32px,5vw,72px)', fontWeight: 800,
                color: '#f8fafc', lineHeight: 1.1, letterSpacing: '-0.03em',
                marginBottom: 20, textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}>
              {b.scheme}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.5 }}
              style={{ fontSize: 'clamp(15px,1.6vw,19px)', color: '#cbd5e1',
                lineHeight: 1.7, marginBottom: 36,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)', maxWidth: 520 }}>
              {b.desc}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => navigate(getCtaRoute(b.cta))}
                style={{ padding: '13px 30px', borderRadius: 12,
                  background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                  border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
                  transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                {b.cta}
              </button>
              <button onClick={() => navigate('/dashboard')}
                style={{ padding: '13px 30px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                  border: '1px solid var(--card-border)',
                  color: '#e2e8f0', fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                Discover All Schemes
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ‹ › Arrows */}
      {[{ fn: () => { prev(); resetTimer() }, label: '‹', side: 'left' },
        { fn: () => { next(); resetTimer() }, label: '›', side: 'right' }].map((btn, i) => (
        <button key={i} onClick={btn.fn} style={{
          position: 'absolute', top: '50%', [btn.side]: 20,
          transform: 'translateY(-50%)',
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          color: 'var(--page-color)', fontSize: 26, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', zIndex: 10, transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.55)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--card-bg)'}>
          {btn.label}
        </button>
      ))}

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 10
      }}>
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => { go(i); resetTimer() }}
            style={{ width: i === current ? 24 : 8, height: 8,
              borderRadius: 4, border: 'none', cursor: 'pointer',
              background: i === current ? '#6366f1' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.35s', padding: 0 }} />
        ))}
      </div>

      {/* Slide counter */}
      <div style={{
        position: 'absolute', bottom: 28, right: 28,
        fontSize: 12, color: 'rgba(255,255,255,0.4)',
        fontWeight: 600, letterSpacing: '0.05em', zIndex: 10
      }}>
        {String(current + 1).padStart(2, '0')} / {String(BANNERS.length).padStart(2, '0')}
      </div>
    </section>
  )
}



/* ─── Counter ─────────────────────────────────────────────── */
function Counter({ end, suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - t, 3)
          setVal(Math.round(ease * end))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Typewriter ──────────────────────────────────────────── */
const WORDS = ['Eligible For', 'Meant For You', 'Available Now', 'Right For You']
function Typewriter() {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [pause, setPause] = useState(false)
  useEffect(() => {
    if (pause) { const t = setTimeout(() => setPause(false), 1600); return () => clearTimeout(t) }
    const word = WORDS[wordIdx]
    if (!deleting && displayed.length < word.length) {
      const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 62); return () => clearTimeout(t)
    }
    if (!deleting && displayed.length === word.length) {
      setPause(true); const t = setTimeout(() => setDeleting(true), 1600); return () => clearTimeout(t)
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35); return () => clearTimeout(t)
    }
    if (deleting && displayed.length === 0) { setDeleting(false); setWordIdx(i => (i + 1) % WORDS.length) }
  }, [displayed, deleting, wordIdx, pause])
  return <span><span className="gradient-text">{displayed}</span><span className="cursor" /></span>
}

/* ─── Aurora — India-Themed Deep Indigo + Saffron ────────── */
function AuroraBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Top indigo radial */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(99,102,241,0.26) 0%, transparent 70%)' }} />

      {/* Blob 1 — vivid indigo/violet (AI/tech) */}
      <div className="animate-aurora-1" style={{ position: 'absolute', top: '-20%', left: '-15%', width: 820, height: 820, borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%', background: 'radial-gradient(circle at 40% 40%, rgba(99,102,241,0.38) 0%, rgba(79,70,229,0.18) 45%, transparent 72%)', filter: 'blur(50px)' }} />

      {/* Blob 2 — saffron/orange (India 🇮🇳 flag) */}
      <div className="animate-aurora-2" style={{ position: 'absolute', top: '8%', right: '-12%', width: 720, height: 720, borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%', background: 'radial-gradient(circle at 55% 35%, rgba(249,115,22,0.22) 0%, rgba(251,146,60,0.1) 45%, transparent 70%)', filter: 'blur(55px)' }} />

      {/* Blob 3 — cyan (data/discovery) */}
      <div className="animate-aurora-3" style={{ position: 'absolute', top: '38%', left: '32%', width: 560, height: 560, borderRadius: '50% 50% 40% 60%', background: 'radial-gradient(circle, rgba(6,182,212,0.24) 0%, transparent 68%)', filter: 'blur(52px)' }} />

      {/* Blob 4 — emerald green (welfare/growth) */}
      <div className="animate-aurora-4" style={{ position: 'absolute', bottom: '-12%', left: '18%', width: 650, height: 650, borderRadius: '70% 30% 50% 50%', background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 68%)', filter: 'blur(55px)' }} />

      {/* Blob 5 — saffron accent, bottom-right */}
      <div className="animate-float-slow" style={{ position: 'absolute', bottom: '8%', right: '-6%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,146,60,0.14) 0%, transparent 68%)', filter: 'blur(48px)' }} />

      {/* Violet top-right */}
      <div className="animate-float-mid" style={{ position: 'absolute', top: '-6%', right: '28%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.16) 0%, transparent 68%)', filter: 'blur(38px)' }} />

      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.055) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 22%, var(--nav-bg) 100%)' }} />
    </div>
  )
}

/* ─── Per-section background themes ─────────────────────── */
const SECTION_THEMES = {
  'get-started': {
    bg: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(99,102,241,0.18) 0%, var(--nav-bg) 70%)',
    accent: 'rgba(99,102,241,0.07)',
  },
  features: {
    bg: 'radial-gradient(ellipse 120% 80% at 20% 50%, rgba(6,182,212,0.18) 0%, var(--nav-bg) 70%)',
    accent: 'rgba(6,182,212,0.07)',
  },
  'how-it-works': {
    bg: 'radial-gradient(ellipse 120% 80% at 80% 50%, rgba(124,58,237,0.2) 0%, var(--nav-bg) 70%)',
    accent: 'rgba(124,58,237,0.07)',
  },
  benefits: {
    bg: 'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(16,185,129,0.15) 0%, var(--nav-bg) 70%)',
    accent: 'rgba(16,185,129,0.05)',
  },
}

/* ─── Landing Page ────────────────────────────────────────── */
export default function LandingPage() {
  const { t, language, setLanguage, darkMode, setDarkMode, accentColor, setAccentColor } = useAppSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('get-started')
  const [langOpen, setLangOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])


  // Fetch user profile when logged in
  useEffect(() => {
    if (!isAuthenticated()) return
    axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => setUser(r.data.user))
      .catch(() => {})
  }, [])

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Track which section is in view — scroll-position based, always keeps one highlighted
  useEffect(() => {
    const sectionIds = ['get-started', 'categories', 'about', 'features', 'how-it-works', 'benefits']
    function updateActive() {
      const vh = window.innerHeight
      let best = sectionIds[0]
      let bestScore = Infinity
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // Distance from 30% of viewport to the section top — smallest wins
        const score = Math.abs(rect.top - vh * 0.30)
        if (score < bestScore) { bestScore = score; best = id }
      }
      setActiveSection(best)
    }
    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    return () => window.removeEventListener('scroll', updateActive)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const id = location.state?.scrollTo || (location.hash ? location.hash.slice(1) : '')
    if (!id) return
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
    if (location.state?.scrollTo) navigate(location.pathname, { replace: true, state: {} })
  }, [location, navigate])

  const isLoggedIn = isAuthenticated()
  const scrollTo = (id) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  // Shared token styles
  const NAV_BTN = { padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', borderRadius: 8, transition: 'color 0.2s', fontFamily: 'inherit' }

  /* ── Navbar ──────────────────────────────────── */
  const Navbar = (
    <motion.header
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
      style={{ position: 'fixed', inset: '0 0 auto 0', zIndex: 100, background: scrolled ? 'var(--nav-bg)' : 'transparent', borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent', backdropFilter: scrolled ? 'blur(24px)' : 'none', transition: 'all 0.4s ease' }}>
      <nav style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <motion.img src={logo} alt="SchemeScout logo" whileHover={{ scale: 1.07, rotate: 5 }}
            style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(129,140,248,0.4)' }} />
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--page-color)', transition: 'color 0.4s ease' }}>SchemeScout</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <motion.button type="button" onClick={() => navigate('/')} whileHover={{ y: -1 }} style={NAV_BTN}
              onMouseEnter={e => e.target.style.color = 'var(--hover-text)'} onMouseLeave={e => e.target.style.color = '#64748b'}>
               {t('navHome')}
            </motion.button>
            {[
              ['navFeatures', () => scrollTo('features')],
              ['navHowItWorks', () => scrollTo('how-it-works')],
            ].map(([key, fn]) => (
              <motion.button key={key} type="button" onClick={fn} whileHover={{ y: -1 }} style={NAV_BTN}
                onMouseEnter={e => e.target.style.color = 'var(--hover-text)'} onMouseLeave={e => e.target.style.color = '#64748b'}>
                {t(key)}
              </motion.button>
            ))}

          <motion.button type="button" whileHover={{ scale: 1.04 }} onClick={() => setLangOpen(true)}
            style={{ padding: '7px 12px', background: 'var(--chip-bg)', border: '1px solid var(--card-border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--accent-text)', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Languages size={13} />{LANGUAGES.find(l => l.code === language)?.native || 'EN'}
          </motion.button>
          {langOpen && <LanguagePicker onClose={() => setLangOpen(false)} />}
          
          {/* ── Theme pill toggle ────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {darkMode ? <Moon size={12} color="#818cf8" /> : <Sun size={12} color="#f97316" />}
            <motion.button
              type="button" onClick={() => setDarkMode(v => !v)} aria-label="Toggle theme"
              style={{
                position: 'relative', width: 48, height: 26, borderRadius: 999, cursor: 'pointer',
                border: darkMode ? '1px solid rgba(129,140,248,0.45)' : '1px solid rgba(251,191,36,0.55)',
                background: darkMode ? 'rgba(99,102,241,0.22)' : 'rgba(251,191,36,0.18)',
                display: 'flex', alignItems: 'center', padding: '2px 3px', flexShrink: 0,
                boxShadow: darkMode ? '0 0 12px rgba(99,102,241,0.3)' : '0 0 12px rgba(251,191,36,0.3)',
                transition: 'background 0.35s, border-color 0.35s, box-shadow 0.35s',
              }}
            >
              <motion.div
                animate={{ x: darkMode ? 0 : 22 }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: darkMode
                    ? 'linear-gradient(135deg,#818cf8,#6366f1)'
                    : 'linear-gradient(135deg,#fbbf24,#f97316)',
                  boxShadow: darkMode ? '0 0 10px rgba(99,102,241,0.7)' : '0 0 10px rgba(251,191,36,0.7)',
                }}
              />
            </motion.button>
          </div>

          {isLoggedIn ? (
            // ── Logged-in: Check Eligibility + Profile avatar dropdown ──
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <motion.button type="button" whileHover={{ scale: 1.04 }} onClick={() => navigate('/apply')}
                style={{ padding: '9px 16px', background: 'var(--chip-bg)', border: '1px solid var(--card-border)', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--accent-text)', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                Check Eligibility
              </motion.button>

              {/* Profile avatar dropdown */}
              <div ref={profileRef} style={{ position: 'relative' }}>
                <motion.button
                  type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 10px 5px 5px',
                    background: profileOpen ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)',
                    border: `1px solid ${profileOpen ? 'rgba(99,102,241,0.4)' : 'var(--card-border)'}`,
                    borderRadius: 999, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}>
                  {/* Avatar */}
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: '#fff',
                    boxShadow: `0 0 10px ${accentColor}55`,
                  }}>
                    {user?.profilePicture
                      ? <img src={user.profilePicture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : (user?.name?.[0] || 'U').toUpperCase()
                    }
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--page-color)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name || 'Profile'}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ color: 'var(--text-muted)', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 10px)', right: 0, minWidth: 210, zIndex: 200,
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: 16, overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)',
                      }}>
                      {/* User info header */}
                      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--card-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, fontWeight: 800, color: '#fff',
                          }}>
                            {user?.profilePicture
                              ? <img src={user.profilePicture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : (user?.name?.[0] || 'U').toUpperCase()
                            }
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--page-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || ''}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      {[
                        { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
                        { icon: User,            label: 'My Profile',  to: '/profile' },
                      ].map(({ icon: Icon, label, to }) => (
                        <Link key={label} to={to} onClick={() => setProfileOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', textDecoration: 'none', color: 'var(--page-color)', fontSize: 14, fontWeight: 500, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <Icon size={15} color="#818cf8" />
                          {label}
                        </Link>
                      ))}

                      <div style={{ height: 1, background: 'var(--card-border)', margin: '4px 0' }} />

                      {/* Logout */}
                      <button type="button"
                        onClick={() => { clearToken(); setProfileOpen(false); navigate('/login') }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={15} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            // ── Guest: show login / create account ──────────────
            <>
              <Link to="/login"
                style={{ padding: '8px 16px', background: 'rgba(99,102,241,0.06)', border: '1px solid var(--card-border)', borderRadius: 9, textDecoration: 'none', fontSize: 14, fontWeight: 600, color: '#818cf8', transition: 'all 0.2s' }}>
                {t('login')}
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/signup" className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
                  {t('createAccount')} <ArrowRight size={14} />
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="show-mobile" style={{ display: 'none' }}>
          <SharedMobileNav
            title="SchemeScout"
            brandTo="/"
            menuItems={[
              { label: t('navHome'), onClick: () => { setMobileOpen(false); navigate('/') } },
              { label: t('navFeatures'), onClick: () => { setMobileOpen(false); scrollTo('features') } },
              { label: t('navHowItWorks'), onClick: () => { setMobileOpen(false); scrollTo('how-it-works') } },
              ...(isLoggedIn ? [
                { label: 'Check Eligibility', onClick: () => { setMobileOpen(false); navigate('/apply') } },
                { label: 'Dashboard', onClick: () => { setMobileOpen(false); navigate('/dashboard') } },
                { label: 'My Profile', onClick: () => { setMobileOpen(false); navigate('/profile') } },
                { label: 'Logout', danger: true, onClick: () => { clearToken(); setMobileOpen(false); navigate('/login') } },
              ] : [
                { label: t('login'), onClick: () => { setMobileOpen(false); navigate('/login') } },
                { label: t('createAccount'), highlight: true, onClick: () => { setMobileOpen(false); navigate('/signup') } },
              ]),
            ]}
          />
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--card-border)', background: 'var(--nav-bg)', backdropFilter: 'blur(24px)' }}>
            <div style={{ padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(99,102,241,0.06)', borderRadius: 12, border: '1px solid var(--card-border)', marginBottom: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>
                  {user?.profilePicture ? <img src={user.profilePicture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.name?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--page-color)' }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email || ''}</div>
                </div>
              </div>
              {[['navHome', () => { setMobileOpen(false); navigate('/') }], ['navFeatures', () => scrollTo('features')], ['navHowItWorks', () => scrollTo('how-it-works')]].map(([key, fn]) => (
                <button key={key} type="button" onClick={fn} style={{ padding: '10px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: 15, fontWeight: 500, color: 'var(--text-muted)', fontFamily: 'inherit', cursor: 'pointer' }}>{t(key)}</button>
              ))}
              <div style={{ height: 1, background: 'rgba(99,102,241,0.15)', margin: '4px 0' }} />
              {isLoggedIn ? (
                <>
                  <button type="button" onClick={() => { setMobileOpen(false); navigate('/apply') }} style={{ padding: '10px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: 15, fontWeight: 600, color: '#818cf8', fontFamily: 'inherit', cursor: 'pointer' }}>Check Eligibility</button>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{ padding: '10px 12px', textDecoration: 'none', fontSize: 15, fontWeight: 500, color: 'var(--page-color)', display: 'flex', alignItems: 'center', gap: 8 }}><LayoutDashboard size={15} color="#818cf8" /> Dashboard</Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ padding: '10px 12px', textDecoration: 'none', fontSize: 15, fontWeight: 500, color: 'var(--page-color)', display: 'flex', alignItems: 'center', gap: 8 }}><User size={15} color="#818cf8" /> My Profile</Link>
                  <button type="button" onClick={() => { clearToken(); setMobileOpen(false); navigate('/login') }} style={{ padding: '10px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: 15, fontWeight: 500, color: '#f87171', fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><LogOut size={15} /> Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} style={{ padding: '10px 12px', textDecoration: 'none', fontSize: 15, fontWeight: 600, color: '#818cf8' }}>{t('login')}</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary"
                    style={{ padding: '12px', borderRadius: 12, textDecoration: 'none', fontSize: 15, fontWeight: 700, textAlign: 'center' }}>{t('createAccount')}</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )

  /* ── Render ───────────────────────────────────── */
  const theme = SECTION_THEMES[activeSection] || SECTION_THEMES['get-started']

  return (
    <div id="top" style={{ position: 'relative', background: 'var(--page-bg)', color: 'var(--page-color)', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'background 0.4s ease, color 0.4s ease' }}>
      <div className="aurora-bg">
        <AuroraBackground />
      </div>
      {/* Scroll-reactive background gradient overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: theme.bg,
        transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1)',
      }} />
      {/* Subtle colour-tinted noise layer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: theme.accent,
        transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1)',
      }} />
      {/* Sunburst removed — clean hero */}
      {Navbar}

      {/* ═══ FLOATING SECTION SIDEBAR ═══════════════════════════════ */}
      <SectionSidebar activeSection={activeSection} onNavigate={scrollTo} accentColor={accentColor} onAccentChange={setAccentColor} />

      {/* ═══ HERO — Full-screen Carousel ════════════════════════ */}
      <SchemeCarousel t={t} />

      {/* ═══ STATS BAR ════════════════════════════════════════════ */}
      <div style={{ background: 'var(--nav-bg)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', position: 'relative', zIndex: 5, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
          {[
            { value: '5,000+', label: 'Government Schemes', color: '#818cf8', icon: Landmark },
            { value: '2.3 Cr+', label: 'Citizens Helped',    color: '#10b981', icon: Users },
            { value: '14',     label: 'Scheme Categories',   color: '#06b6d4', icon: GraduationCap },
            { value: '94%',    label: 'Application Success', color: '#f97316', icon: Trophy },
          ].map(({ value, label, color, icon: Icon }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 18px ${color}22` }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.01em' }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 3, letterSpacing: '0.02em' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SCHEME CATEGORIES ═══════════════════════════════════ */}
      <section id="categories" style={{ padding: '80px 24px 70px', position: 'relative', overflow: 'hidden', background: 'var(--nav-bg)' }}>
        {/* Soft glow */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(99,102,241,0.09) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Heading */}
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.5 }}
            style={{ textAlign:'center', marginBottom: 56 }}>
            <span style={{ display:'inline-block', fontSize:11, fontWeight:700, color:'#818cf8', background:'rgba(99,102,241,0.1)', border:'1px solid var(--card-border)', borderRadius:20, padding:'4px 14px', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:16 }}>Browse</span>
            <h2 style={{ fontSize:'clamp(26px,4vw,44px)', fontWeight:800, color: 'var(--page-color)', letterSpacing:'-0.03em', lineHeight:1.15, marginBottom:12 }}>
              Find Schemes Based <span style={{ background:'linear-gradient(90deg,#818cf8,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>on Categories</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize:15, maxWidth:480, margin:'0 auto' }}>Explore 5000+ government schemes organised by sector and category.</p>
          </motion.div>

          {/* Category grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:16 }}>
            {[
              { icon: Leaf,       color:'#4ade80', bg:'rgba(74,222,128,0.1)',  count:'834',  label:'Agriculture, Rural & Environment' },
              { icon: Landmark,   color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  count:'326',  label:'Banking, Financial Services' },
              { icon: Briefcase,  color:'#818cf8', bg:'rgba(129,140,248,0.1)', count:'741',  label:'Business & Entrepreneurship' },
              { icon: GraduationCap, color:'#38bdf8', bg:'rgba(56,189,248,0.1)',count:'1082', label:'Education & Learning' },
              { icon: HeartPulse, color:'#f87171', bg:'rgba(248,113,113,0.1)', count:'287',  label:'Health & Wellness' },
              { icon: Home,       color:'#a78bfa', bg:'rgba(167,139,250,0.1)', count:'133',  label:'Housing & Shelter' },
              { icon: Scale,      color:'#fb923c', bg:'rgba(251,146,60,0.1)',  count:'33',   label:'Public Safety & Law' },
              { icon: Cpu,        color:'#34d399', bg:'rgba(52,211,153,0.1)',  count:'109',  label:'Science, IT & Communications' },
              { icon: HardHat,    color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  count:'395',  label:'Skills & Employment' },
              { icon: Users,      color:'#c084fc', bg:'rgba(192,132,252,0.1)', count:'1432', label:'Social Welfare & Empowerment' },
              { icon: Trophy,     color:'#22d3ee', bg:'rgba(34,211,238,0.1)',  count:'78',   label:'Sports & Culture' },
              { icon: Bus,        color:'#6ee7b7', bg:'rgba(110,231,183,0.1)', count:'92',   label:'Transport & Infrastructure' },
              { icon: Baby,       color:'#f9a8d4', bg:'rgba(249,168,212,0.1)', count:'214',  label:'Women & Child Development' },
              { icon: Wrench,     color:'#93c5fd', bg:'rgba(147,197,253,0.1)', count:'67',   label:'Utilities & Sanitation' },
            ].map(({ icon: Icon, color, bg, count, label }, i) => (
              <motion.div key={label}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }}
                transition={{ delay: i * 0.04, duration: 0.42 }}
                whileHover={{ y:-6, boxShadow:`0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${color}22` }}
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'var(--card-bg)',
                  border:'1px solid var(--card-border)',
                  borderRadius:18,
                  padding:'24px 16px 20px',
                  cursor:'pointer',
                  textAlign:'center',
                  transition:'border-color 0.2s',
                  backdropFilter:'blur(8px)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color + '55'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}>

                {/* Icon circle */}
                <div style={{ width:56, height:56, borderRadius:16, background:bg, border:`1px solid ${color}33`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <Icon size={26} color={color} strokeWidth={1.7} />
                </div>

                {/* Count */}
                <div style={{ fontSize:12, fontWeight:700, color, marginBottom:6, letterSpacing:'0.02em' }}>{count} Schemes</div>

                {/* Label */}
                <div style={{ fontSize:13, fontWeight:600, color:'var(--page-color)', lineHeight:1.35 }}>{label}</div>
              </motion.div>
            ))}
          </div>

          {/* View all CTA */}
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.3 }}
            style={{ textAlign:'center', marginTop:44 }}>
            <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} style={{ display:'inline-block' }}>
              <Link to="/dashboard" className="btn-primary"
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 32px', borderRadius:14, textDecoration:'none', fontSize:15, fontWeight:700 }}>
                Explore All Categories <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* ═══ ABOUT ════════════════════════════════════════════════ */}
      <section id="about" style={{ padding: '90px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ position:'absolute', top:0, left:0, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:0, right:0, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', gap:64, flexWrap:'wrap', position:'relative', zIndex:1 }}>

          {/* LEFT — Text */}
          <motion.div
            initial={{ opacity:0, x:-32 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:'-80px' }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ flex:'1 1 400px' }}>

            <span style={{ display:'inline-block', fontSize:11, fontWeight:700, color:'#818cf8', background:'rgba(99,102,241,0.1)', border:'1px solid var(--card-border)', borderRadius:20, padding:'4px 14px', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:20 }}>About SchemeScout</span>

            <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:800, color: 'var(--page-color)', letterSpacing:'-0.03em', lineHeight:1.15, marginBottom:24 }}>
              One Platform.<br />
              <span style={{ background:'linear-gradient(90deg,#6366f1,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Every Scheme You Deserve.</span>
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize:16, lineHeight:1.85, marginBottom:20 }}>
              <strong style={{ color: 'var(--page-color)' }}>SchemeScout</strong> is an AI-powered national platform that provides one-stop search and discovery of all Government welfare schemes — Central & State — in one place.
            </p>

            <p style={{ color: 'var(--text-muted)', fontSize:16, lineHeight:1.85, marginBottom:20 }}>
              It uses an innovative, technology-based solution to surface scheme information based upon the{' '}
              <span style={{ color:'#818cf8', fontWeight:600 }}>eligibility of the citizen</span> — so you only see schemes you actually qualify for.
            </p>

            <p style={{ color: 'var(--text-muted)', fontSize:16, lineHeight:1.85, marginBottom:36 }}>
              SchemeScout guides you on{' '}
              <span style={{ color:'#34d399', fontWeight:600 }}>how to apply</span> for each scheme, with step-by-step instructions. No need to visit multiple government websites ever again.
            </p>

            {/* Key points */}
            {[
              { color:'#818cf8', text:'AI matches you to schemes based on your profile in seconds' },
              { color:'#34d399', text:'Covers Central + State schemes — 5000+ schemes in one place' },
              { color:'#38bdf8', text:'Guided application steps — no confusing government portals' },
            ].map(({ color, text }) => (
              <div key={text} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 10px ${color}`, marginTop:7, flexShrink:0 }} />
                <p style={{ color: 'var(--page-color)', fontSize:15, lineHeight:1.6, margin:0 }}>{text}</p>
              </div>
            ))}

            <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} style={{ display:'inline-block', marginTop:32 }}>
              <Link to="/signup" className="btn-primary"
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 32px', borderRadius:14, textDecoration:'none', fontSize:15, fontWeight:700 }}>
                Get Started Free <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — Visual card */}
          <motion.div
            initial={{ opacity:0, x:32 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:'-80px' }} transition={{ duration:0.65, delay:0.15, ease:[0.22,1,0.36,1] }}
            style={{ flex:'1 1 380px', display:'flex', justifyContent:'center', alignItems:'center' }}>

            <div style={{ position:'relative', width:'100%', maxWidth:420 }}>
              {/* Main card */}
              <div style={{ background: 'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:24, padding:32, backdropFilter:'blur(20px)', boxShadow:'0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.08)' }}>

                {/* Card header */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
                  <img src={logo} alt="SchemeScout logo" style={{ width:42, height:42, borderRadius:12, objectFit:'cover' }} />
                  <div>
                    <div style={{ fontWeight:700, color: 'var(--page-color)', fontSize:15 }}>SchemeScout</div>
                    <div style={{ fontSize:12, color: 'var(--text-muted)' }}>AI Scheme Finder</div>
                  </div>
                  <div style={{ marginLeft:'auto', display:'flex', gap:5 }}>
                    {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width:9, height:9, borderRadius:'50%', background:c }} />)}
                  </div>
                </div>

                {/* Stat rows */}
                {[
                  { label:'Schemes Discovered',  value:'5,000+', color:'#818cf8', pct:85 },
                  { label:'Citizens Helped',      value:'2.3 Cr+', color:'#34d399', pct:72 },
                  { label:'Categories Covered',   value:'14',      color:'#38bdf8', pct:100 },
                  { label:'Application Success',  value:'94%',     color:'#fbbf24', pct:94 },
                ].map(({ label, value, color, pct }, i) => (
                  <motion.div key={label}
                    initial={{ opacity:0, x:16 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.3 + i * 0.1 }}
                    style={{ marginBottom:20 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                      <span style={{ fontSize:13, color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ fontSize:14, fontWeight:800, color }}>{value}</span>
                    </div>
                    <div style={{ height:4, borderRadius:4, background:'var(--border-subtle)', overflow:'hidden' }}>
                      <motion.div
                        initial={{ width:0 }} whileInView={{ width:`${pct}%` }} viewport={{ once:true }} transition={{ delay:0.4 + i * 0.1, duration:0.8, ease:'easeOut' }}
                        style={{ height:'100%', borderRadius:4, background:`linear-gradient(90deg,${color},${color}99)` }} />
                    </div>
                  </motion.div>
                ))}

                {/* Bottom tag */}
                <div style={{ marginTop:24, padding:'12px 16px', background:'rgba(99,102,241,0.08)', border:'1px solid var(--card-border)', borderRadius:12, display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px #22c55e', animation:'pulse 2s infinite' }} />
                  <span style={{ fontSize:13, color: 'var(--text-muted)' }}>AI engine active — updated in real-time</span>
                </div>
              </div>

              {/* Floating badge 1 */}
              <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
                style={{ position:'absolute', top:-18, right:-18, background: 'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:14, padding:'10px 16px', backdropFilter:'blur(12px)', boxShadow:'0 8px 30px rgba(0,0,0,0.4)' }}>
                <div style={{ fontSize:11, color: 'var(--text-muted)', marginBottom:2 }}>Eligibility Match</div>
                <div style={{ fontSize:18, fontWeight:800, color:'#818cf8' }}>98% <span style={{ fontSize:11, color:'#34d399' }}>↑</span></div>
              </motion.div>

              {/* Floating badge 2 */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut', delay:0.5 }}
                style={{ position:'absolute', bottom:-18, left:-18, background: 'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:14, padding:'10px 16px', backdropFilter:'blur(12px)', boxShadow:'0 8px 30px rgba(0,0,0,0.4)' }}>
                <div style={{ fontSize:11, color: 'var(--text-muted)', marginBottom:2 }}>Avg. Setup Time</div>
                <div style={{ fontSize:18, fontWeight:800, color:'#06b6d4' }}>2 mins</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ════════════════════════════════════════════ */}
      <section id="features" style={{ padding: '110px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 350, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55 }}
            style={{ textAlign: 'center', marginBottom: 72 }}>
            <span className="badge badge-violet" style={{ marginBottom: 18 }}>Features</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>{t('navFeatures')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>{t('landingFeaturesIntro')}</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
            {[
              { icon: Wand2,  title: t('landingFeatureAiTitle'),     desc: t('landingFeatureAiDesc'),     color: '#818cf8', glow: 'rgba(129,140,248,0.22)', gradFrom: 'rgba(99,102,241,0.13)',  gradTo: 'rgba(99,102,241,0.03)',  border: 'rgba(129,140,248,0.3)', topGrad: 'linear-gradient(90deg,#818cf8,#a78bfa)', tag: 'Powered by Gemini AI', delay: 0,   to: '/learn-more' },
              { icon: Filter, title: t('landingFeatureFilterTitle'), desc: t('landingFeatureFilterDesc'), color: '#06b6d4', glow: 'rgba(6,182,212,0.22)',   gradFrom: 'rgba(6,182,212,0.11)',  gradTo: 'rgba(6,182,212,0.02)',   border: 'rgba(6,182,212,0.28)',  topGrad: 'linear-gradient(90deg,#06b6d4,#67e8f9)', tag: 'Smart Search',       delay: 0.1, to: '/learn-more' },
              { icon: Zap,    title: t('landingFeatureAccessTitle'), desc: t('landingFeatureAccessDesc'), color: '#f97316', glow: 'rgba(249,115,22,0.2)',   gradFrom: 'rgba(249,115,22,0.09)', gradTo: 'rgba(249,115,22,0.02)', border: 'rgba(249,115,22,0.28)', topGrad: 'linear-gradient(90deg,#f97316,#fbbf24)', tag: 'Instant Access',     delay: 0.2, to: '/learn-more' },
            ].map((item) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: item.delay, duration: 0.55 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.to)}
                className="feature-card elevated-card"
                style={{
                  padding: '34px 30px', borderRadius: 22, cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  background: `linear-gradient(145deg, ${item.gradFrom}, ${item.gradTo}, var(--card-bg))`,
                  border: `1px solid ${item.border}`,
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                }}
              >
                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: item.topGrad, borderRadius: '22px 22px 0 0' }} />
                {/* Background glow blob */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${item.glow} 0%, transparent 70%)`, filter: 'blur(24px)', pointerEvents: 'none' }} />
                {/* Tag badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 11px', background: `${item.color}18`, border: `1px solid ${item.color}38`, borderRadius: 999, marginBottom: 22, fontSize: 10, fontWeight: 700, color: item.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  {item.tag}
                </div>
                {/* Icon */}
                <motion.div whileHover={{ scale: 1.1, rotate: 6 }}
                  style={{ width: 58, height: 58, borderRadius: 18, background: `${item.color}18`, border: `1.5px solid ${item.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, boxShadow: `0 0 28px ${item.glow}`, position: 'relative', zIndex: 1 }}>
                  <item.icon size={26} color={item.color} />
                </motion.div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--page-color)', position: 'relative', zIndex: 1 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 14, position: 'relative', zIndex: 1, marginBottom: 26 }}>{item.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: item.color, position: 'relative', zIndex: 1 }}>
                  <span>{t('learnMore') || 'Learn more'}</span>
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ════════════════════════════════════════ */}
      <section id="how-it-works"
        style={{ padding: '110px 24px', background: 'var(--page-bg)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', position: 'relative', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ position:'absolute', top:'20%', left:'10%', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        {/* Subtle grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.025) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
            style={{ textAlign: 'center', marginBottom: 80 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 16px', background:'rgba(6,182,212,0.08)', border:'1px solid rgba(6,182,212,0.25)', borderRadius:999, marginBottom:20 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#06b6d4', boxShadow:'0 0 8px #06b6d4' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#06b6d4', letterSpacing:'0.1em', textTransform:'uppercase' }}>Process</span>
            </div>
            <h2 style={{ fontSize:'clamp(28px,4vw,50px)', fontWeight:900, letterSpacing:'-0.035em', marginBottom:18, color:'var(--page-color)', lineHeight:1.1 }}>
              {t('landingHowItWorks')}
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:16, maxWidth:480, margin:'0 auto', lineHeight:1.75 }}>{t('landingHowIntro')}</p>
          </motion.div>

          {/* Steps */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:28, position:'relative' }}>
            {[
              { icon: UserRound,    step:'01', title:t('landingStep1Title'), desc:t('landingStep1Desc'), c:'#818cf8', bg:'rgba(99,102,241,0.1)',  border:'rgba(99,102,241,0.22)', glow:'rgba(99,102,241,0.25)', topBar:'linear-gradient(90deg,#6366f1,#818cf8)', delay:0 },
              { icon: Brain,        step:'02', title:t('landingStep2Title'), desc:t('landingStep2Desc'), c:'#06b6d4', bg:'rgba(6,182,212,0.09)', border:'rgba(6,182,212,0.22)',  glow:'rgba(6,182,212,0.22)',   topBar:'linear-gradient(90deg,#06b6d4,#67e8f9)', delay:0.13 },
              { icon: CheckCircle2, step:'03', title:t('landingStep3Title'), desc:t('landingStep3Desc'), c:'#10b981', bg:'rgba(16,185,129,0.09)',border:'rgba(16,185,129,0.22)', glow:'rgba(16,185,129,0.22)',  topBar:'linear-gradient(90deg,#10b981,#34d399)', delay:0.26 },
            ].map((item, i) => (
              <motion.div key={item.step}
                initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ delay:item.delay, duration:0.55, ease:[0.22,1,0.36,1] }}
                whileHover={{ y:-10 }}
                className="step-card elevated-card"
                style={{
                  padding:'40px 32px 36px',
                  background:'var(--card-bg)',
                  border:`1px solid ${item.border}`,
                  borderRadius:24, textAlign:'center', position:'relative', overflow:'hidden',
                  backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
                  transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                  cursor:'default',
                }}
              >
                {/* Top accent bar */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:item.topBar, borderRadius:'24px 24px 0 0' }} />
                {/* Ghost step number */}
                <div style={{ position:'absolute', bottom:-20, right:8, fontSize:140, fontWeight:900, color:`${item.c}08`, lineHeight:1, userSelect:'none', pointerEvents:'none', fontVariantNumeric:'tabular-nums' }}>{item.step}</div>

                {/* Step badge */}
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', background:`${item.c}14`, border:`1px solid ${item.c}30`, borderRadius:999, marginBottom:28, fontSize:11, fontWeight:800, color:item.c, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:item.c, boxShadow:`0 0 6px ${item.c}` }} />
                  STEP {item.step}
                </div>

                {/* Animated icon */}
                <motion.div
                  animate={{ y:[0,-8,0] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut', delay:i*0.7 }}
                  style={{ width:84, height:84, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${item.bg}, ${item.c}08)`, border:`1.5px solid ${item.border}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', boxShadow:`0 0 0 12px ${item.c}06, 0 0 40px ${item.glow}`, position:'relative', zIndex:1 }}>
                  <item.icon size={36} color={item.c} strokeWidth={1.6} />
                </motion.div>

                <h3 style={{ fontSize:21, fontWeight:800, color:'var(--page-color)', marginBottom:14, letterSpacing:'-0.015em', position:'relative', zIndex:1 }}>{item.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:14, lineHeight:1.85, position:'relative', zIndex:1 }}>{item.desc}</p>

                {/* Connector arrow (hidden on last card) */}
                {i < 2 && (
                  <div style={{ display:'none' }} className="step-connector" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.4 }}
            style={{ marginTop:56, textAlign:'center' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:14, padding:'16px 32px', background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:18, backdropFilter:'blur(12px)' }}>
              <div style={{ display:'flex', gap:-8 }}>
                {['#818cf8','#06b6d4','#10b981'].map((c,i) => (
                  <div key={c} style={{ width:32, height:32, borderRadius:'50%', background:c, border:'2px solid var(--page-bg)', marginLeft:i > 0 ? -10 : 0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>
                    {['👤','🤖','✅'][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize:14, color:'var(--text-muted)', fontWeight:500 }}>
                Ready to find your schemes? &nbsp;
                <span onClick={() => navigate('/signup')} style={{ color:'#818cf8', fontWeight:700, cursor:'pointer', textDecoration:'underline', textDecorationColor:'rgba(129,140,248,0.4)' }}>
                  Get started free →
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══ BENEFITS ════════════════════════════════════════════ */}
      <section id="benefits" style={{ padding: '110px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
            style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="badge badge-violet" style={{ marginBottom: 18 }}>Why SchemeScout</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.03em' }}>{t('landingBenefitsTitle')}</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 72 }}>
            {[
              { icon: TrendingUp, title: t('landingBenefit1Title'), desc: t('landingBenefit1Desc'), c: '#818cf8', glow: 'rgba(99,102,241,0.18)',  bg: 'rgba(99,102,241,0.08)', delay: 0 },
              { icon: Shield,     title: t('landingBenefit2Title'), desc: t('landingBenefit2Desc'), c: '#10b981', glow: 'rgba(16,185,129,0.16)', bg: 'rgba(16,185,129,0.08)', delay: 0.1 },
              { icon: Zap,        title: t('landingBenefit3Title'), desc: t('landingBenefit3Desc'), c: '#f97316', glow: 'rgba(249,115,22,0.16)', bg: 'rgba(249,115,22,0.08)', delay: 0.2 },
            ].map((b) => (
              <motion.div key={b.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: b.delay, duration: 0.5 }}
                whileHover={{ y: -6, boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 44px ${b.glow}` }}
                style={{ padding: '28px 28px 28px 26px', background: `linear-gradient(145deg, ${b.bg}, rgba(255,255,255,0.03))`, border: `1px solid ${b.c}30`, borderRadius: 20, display: 'flex', gap: 20, transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: `linear-gradient(90deg, ${b.c}, ${b.c}55)`, borderRadius: '20px 20px 0 0' }} />
                {/* Icon */}
                <motion.div whileHover={{ scale: 1.1, rotate: 8 }}
                  style={{ width: 50, height: 50, borderRadius: 15, background: b.bg, border: `1px solid ${b.c}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 22px ${b.glow}`, marginTop: 4 }}>
                  <b.icon size={22} color={b.c} />
                </motion.div>
                <div>
                  <h3 style={{ fontWeight: 700, color: 'var(--page-color)', marginBottom: 10, fontSize: 17 }}>{b.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.75 }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }}
            style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '64px 40px', textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 250, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.25), transparent 75%)', filter: 'blur(50px)', pointerEvents: 'none' }} className="animate-pulse-glow" />
            <div className="beam" style={{ opacity: 0.5 }} />
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.025em', position: 'relative', color: 'var(--page-color)' }}>
              {t('heroTitle')}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: 16, position: 'relative' }}>{t('landingHeroSubtitle')}</motion.p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block', position: 'relative' }}>
              <Link to="/signup" className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 40px', borderRadius: 16, textDecoration: 'none', fontSize: 16, fontWeight: 800 }}>
                {t('landingCtaPrimary')} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════ */}
      <footer style={{ padding: '28px 24px 24px', borderTop: '1px solid var(--card-border)', background: 'linear-gradient(180deg, rgba(99,102,241,0.06), rgba(15,23,42,0.03))', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20, alignItems: 'start' }}>
          <div style={{ padding: '18px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 18, boxShadow: '0 12px 40px rgba(0,0,0,0.16)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <img src={logo} alt="SchemeScout logo" style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }} />
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--page-color)' }}>SchemeScout</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{t('footerTagline')}</p>
          </div>
          <div style={{ padding: '18px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 18 }}>
            <p style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('landingFooterProduct')}</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 0, margin: 0, listStyle: 'none' }}>
              {[['Features', () => scrollTo('features')], ['How It Works', () => scrollTo('how-it-works')]].map(([label, fn]) => (
                <li key={label}><button type="button" onClick={fn}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--page-color)', fontSize: 14, fontFamily: 'inherit', padding: 0, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#818cf8'} onMouseLeave={e => e.target.style.color = 'var(--page-color)'}>{label}</button></li>
              ))}
              <li><Link to="/signup" style={{ textDecoration: 'none', color: 'var(--page-color)', fontSize: 14, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#818cf8'} onMouseLeave={e => e.target.style.color = 'var(--page-color)'}>{t('createAccount')}</Link></li>
            </ul>
          </div>
          <div style={{ padding: '18px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 18, textAlign: 'left' }}>
            <p style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('landingFooterLegal')}</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 0, margin: 0, listStyle: 'none' }}>
              {[t('landingFooterPrivacy'), t('landingFooterTerms'), t('landingFooterContact')].map(l => (
                <li key={l} style={{ color: 'var(--page-color)', fontSize: 14 }}>{l}</li>
              ))}
            </ul>
            <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>© {new Date().getFullYear()} SchemeScout</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
