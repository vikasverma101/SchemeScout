import SchemeEligibilityForm from './components/SchemeEligibilityForm.jsx'
import SchemeDetailsModal from './components/SchemeDetailsModal.jsx'
import SharedMobileNav from './components/SharedMobileNav.jsx'
import axios from 'axios'
import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clearToken, getToken } from './utils/auth.js'
import { useAppSettings } from './context/AppSettingsContext.jsx'
import logo from './assets/logo.png'
import {
  Home, Moon, Sun, Languages, LayoutDashboard, Bookmark, UserRound,
  LogOut, Heart, Sparkles, Clock, ChevronDown, Search, ExternalLink,
} from 'lucide-react'

// ─── Navbar ───────────────────────────────────────────────────────────
function Navbar({ t, darkMode, setDarkMode, language, setLanguage, navigate, clearToken }) {
  return (
    <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: darkMode ? 'rgba(8,11,20,0.94)' : 'rgba(240,244,255,0.95)',
        borderBottom: darkMode ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(99,102,241,0.18)',
        backdropFilter: 'blur(24px)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo} alt="SchemeScout logo" style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'cover' }} />
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em', color: 'var(--page-color)' }}>SchemeScout</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'Home', icon: Home, fn: () => navigate('/') },
            { label: t('account'), icon: LayoutDashboard, fn: () => navigate('/account') },
            { label: t('savedSchemes'), icon: Bookmark, fn: () => navigate('/saved') },
            { label: t('profile'), icon: UserRound, fn: () => navigate('/profile') },
          ].map(item => (
            <button key={item.label} type="button" onClick={item.fn}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', borderRadius: 8 }}>
              <item.icon size={14} /> {item.label}
            </button>
          ))}

          <div style={{ width: 1, height: 20, background: 'var(--divider)', margin: '0 4px' }} />

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

          <button type="button" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="btn-ghost"
            style={{ padding: '8px 12px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Languages size={14} />
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>

          <button type="button" onClick={() => { clearToken(); navigate('/login', { replace: true }) }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fca5a5', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.15)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)' }}>
            <LogOut size={13} /> {t('logout')}
          </button>
        </div>

        <div className="show-mobile" style={{ display: 'none' }}>
          <SharedMobileNav
            title="SchemeScout"
            brandTo="/"
            menuItems={[
              { label: 'Home', onClick: () => navigate('/') },
              { label: t('account'), onClick: () => navigate('/account') },
              { label: t('savedSchemes'), onClick: () => navigate('/saved') },
              { label: t('profile'), onClick: () => navigate('/profile') },
              { label: t('logout'), danger: true, onClick: () => { clearToken(); navigate('/login', { replace: true }) } },
            ]}
          />
        </div>
      </div>
    </header>
  )
}

// SchemeDetailsModal is imported from ./components/SchemeDetailsModal.jsx

// ─── Scheme Card ──────────────────────────────────────────────────────
function SchemeCard({ s, idx, t, navigate, onSave }) {
  const [showDetails, setShowDetails] = useState(false)
  const typeColors = {
    education:   { bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)', text: '#818cf8' },
    jobs:        { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',   text: '#34d399' },
    agriculture: { bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.2)',   text: '#fb923c' },
    health:      { bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)',  text: '#f472b6' },
  }
  const tc = typeColors[s?.type] || typeColors.education

  return (
    <>
      <AnimatePresence>
        {showDetails && <SchemeDetailsModal scheme={s} onClose={() => setShowDetails(false)} />}
      </AnimatePresence>

      <motion.div
        layout
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: idx * 0.04 }}
        className="gradient-border scheme-card"
        style={{ padding: 24, borderRadius: 20, display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        {/* Top */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--page-color)', lineHeight: 1.35, marginBottom: 8 }}>{s?.name || 'Scheme'}</h3>
            <span style={{ display: 'inline-block', padding: '3px 10px', background: tc.bg, border: `1px solid ${tc.border}`, borderRadius: 999, fontSize: 11, fontWeight: 700, color: tc.text, textTransform: 'capitalize' }}>{s?.type || 'scheme'}</span>
          </div>
          <button type="button" onClick={() => onSave(s)}
            style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
            title={t('saveScheme')}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.18)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.18)' }}>
            <Heart size={15} color="#f87171" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <div style={{ padding: '10px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{t('benefits')}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s?.benefits || '—'}</p>
          </div>
          <div style={{ padding: '10px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{t('eligibility')}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s?.eligibility || '—'}</p>
          </div>
        </div>

        {/* Buttons row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setShowDetails(true)}
            style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--bg-surface)', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--page-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.background = 'var(--bg-surface)' }}>
            📋 Details
          </button>
          <button type="button" onClick={() => navigate('/apply', { state: { scheme: s } })}
            className="btn-primary"
            style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
            {t('apply')} <ExternalLink size={13} />
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ─── Main App (Find Schemes page at /dashboard) ───────────────────────
function App() {
  const { t, language, setLanguage, darkMode, setDarkMode } = useAppSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [schemes, setSchemes] = useState([])
  const [aiRecommendation, setAiRecommendation] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [schemeSource, setSchemeSource] = useState('gemini')
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const resultsRef = useRef(null)
  const hasSearched = useRef(false)

  const visibleSchemes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return schemes.filter((s) => {
      const matchesType = typeFilter === 'all' ? true : s?.type === typeFilter
      const text = `${s?.name || ''} ${s?.benefits || ''} ${s?.eligibility || ''}`.toLowerCase()
      const matchesSearch = query ? text.includes(query) : true
      return matchesType && matchesSearch
    })
  }, [schemes, searchQuery, typeFilter])

  useEffect(() => {
    const targetId = location.state?.scrollTo || (location.hash ? location.hash.slice(1) : '')
    if (!targetId) return
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (location.state?.scrollTo) navigate(location.pathname, { replace: true, state: {} })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave(s) {
    try {
      const token = getToken()
      await axios.post('/api/save-scheme', { schemeId: s._id || s.id }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch (e) {
      if (e?.response?.status === 401) { clearToken(); navigate('/login', { replace: true }) }
    }
  }

  function getAiSummary(value) {
    if (!value) return ''
    if (typeof value === 'string') return value
    return value.summary || ''
  }

  function getAiRecommendedSchemes(value) {
    if (!value || typeof value === 'string') return []
    return Array.isArray(value.recommendedSchemes) ? value.recommendedSchemes : []
  }

  function getAiTips(value) {
    if (!value || typeof value === 'string') return []
    return Array.isArray(value.tips) ? value.tips : []
  }

  const aiSummary = getAiSummary(aiRecommendation)
  const aiRecommendedSchemes = getAiRecommendedSchemes(aiRecommendation)
  const aiTips = getAiTips(aiRecommendation)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--page-color)', position: 'relative', overflow: 'hidden', transition: 'background 0.4s ease, color 0.4s ease' }}>
      {/* ── Aurora Background ─────────────────────────────── */}
      <div className="aurora-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', transition: 'opacity 0.4s ease' }}>
        {/* Indigo blob – top left (AI/tech) */}
        <div className="animate-aurora-1" style={{ position: 'absolute', top: '-18%', left: '-12%', width: 720, height: 720, borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%', background: 'radial-gradient(circle at 40% 40%, rgba(99,102,241,0.34) 0%, rgba(79,70,229,0.15) 45%, transparent 72%)', filter: 'blur(52px)' }} />
        {/* Saffron blob – top right (India 🇮🇳) */}
        <div className="animate-aurora-2" style={{ position: 'absolute', top: '5%', right: '-10%', width: 660, height: 660, borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%', background: 'radial-gradient(circle at 55% 35%, rgba(249,115,22,0.2) 0%, rgba(251,146,60,0.09) 45%, transparent 70%)', filter: 'blur(56px)' }} />
        {/* Cyan blob – center (data/search) */}
        <div className="animate-aurora-3" style={{ position: 'absolute', top: '42%', left: '34%', width: 530, height: 530, borderRadius: '50% 50% 40% 60%', background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 68%)', filter: 'blur(50px)' }} />
        {/* Emerald blob – bottom (welfare/growth) */}
        <div className="animate-aurora-4" style={{ position: 'absolute', bottom: '-14%', left: '18%', width: 600, height: 600, borderRadius: '70% 30% 50% 50%', background: 'radial-gradient(circle, rgba(16,185,129,0.17) 0%, transparent 68%)', filter: 'blur(54px)' }} />
        {/* Violet accent – bottom right */}
        <div className="animate-float-slow" style={{ position: 'absolute', bottom: '10%', right: '-6%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.13) 0%, transparent 68%)', filter: 'blur(46px)' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        {/* Vignette */}
        <div className="aurora-vignette" style={{ position: 'absolute', inset: 0 }} />
      </div>

      {/* Navbar */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar t={t} darkMode={darkMode} setDarkMode={setDarkMode} language={language} setLanguage={setLanguage} navigate={navigate} clearToken={clearToken} />
      </div>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero section */}
        <section style={{ padding: '64px 24px 48px', textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            {/* Glowing AI badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px 5px 8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 999, marginBottom: 22, fontSize: 12, fontWeight: 700, boxShadow: '0 0 24px rgba(99,102,241,0.15)' }}>
              <span style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius: 999, padding: '2px 9px', fontSize: 10, color: '#fff', fontWeight: 800, boxShadow: '0 0 12px rgba(99,102,241,0.5)' }}>AI</span>
              <span style={{ color: 'var(--accent-text)' }}>{t('heroBadge')}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: 16 }}>
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 45%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 8px 30px rgba(99, 102, 241, 0.18)',
                filter: 'drop-shadow(0 2px 8px rgba(6, 182, 212, 0.16))',
              }}>
                {t('formTitle')}
              </span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>{t('formSubtitle')}</p>
          </motion.div>
        </section>

        {/* Form */}
        <section style={{ padding: '0 24px 48px' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <SchemeEligibilityForm
              onSubmit={async (payload) => {
                try {
                  setError('')
                  setSchemes([])
                  setAiRecommendation(null)
                  setLastUpdated(null)
                  setIsLoading(true)
                  hasSearched.current = true
                  const token = getToken()
                  const res = await axios.post('/api/schemes', payload, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                  })
                  const data = res.data || {}
                  setSchemes(Array.isArray(data.schemes) ? data.schemes : [])
                  setAiRecommendation(data.aiRecommendation && typeof data.aiRecommendation === 'object' ? data.aiRecommendation : (typeof data.aiRecommendation === 'string' ? data.aiRecommendation : null))
                  setLastUpdated(data.lastUpdated || null)
                  setSchemeSource(data.schemeSource || 'gemini')
                  setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                } catch (e) {
                  if (e?.response?.status === 401) {
                    clearToken()
                    navigate('/login', { replace: true })
                    return
                  }
                  setError(e?.response?.data?.message || 'Could not fetch schemes. Make sure the backend is running on port 5000.')
                } finally {
                  setIsLoading(false)
                }
              }}
            />
          </motion.div>
        </section>

        {/* Results */}
        <section ref={resultsRef} style={{ padding: '0 24px 64px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <AnimatePresence mode="wait">

              {/* Loading skeleton */}
              {isLoading && (
                <motion.div key="loading" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={18} color="var(--accent-text)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--page-color)' }}>{t('loadingTitle')}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('loadingSubtitle')}</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="panel-card" style={{ borderRadius: 20, padding: 24 }}>
                        <div className="skeleton" style={{ height: 18, width: '65%', marginBottom: 14 }} />
                        <div className="skeleton" style={{ height: 12, width: 60, marginBottom: 16, borderRadius: 999 }} />
                        <div className="skeleton" style={{ height: 60, width: '100%', marginBottom: 12, borderRadius: 10 }} />
                        <div className="skeleton" style={{ height: 60, width: '100%', marginBottom: 20, borderRadius: 10 }} />
                        <div className="skeleton" style={{ height: 40, width: '100%', borderRadius: 12 }} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {!isLoading && error && (
                <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ maxWidth: 600, margin: '0 auto', padding: '20px 24px', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 16, fontSize: 14, color: '#fca5a5', textAlign: 'center' }}>
                  {error}
                </motion.div>
              )}

              {/* Empty (only shown after a search) */}
              {!isLoading && !error && schemes.length === 0 && hasSearched.current && (
                <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="panel-card"
                  style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center', padding: '32px 24px', borderRadius: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-muted)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                    <Search size={24} color="var(--text-muted)" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--page-color)', marginBottom: 10 }}>{t('emptyTitle')}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{t('emptyText')}</p>
                  {aiSummary && (
                    <div style={{ marginTop: 20, padding: '16px', background: 'var(--surface-muted)', border: '1px solid var(--border-soft)', borderRadius: 14, textAlign: 'left' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--page-color)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('aiRecommendedTitle')}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{aiSummary}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Results */}
              {!isLoading && !error && schemes.length > 0 && (
                <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {/* AI Banner */}
                  {aiSummary && aiSummary !== 'Showing best schemes based on your eligibility' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                      className="ai-panel"
                      style={{
                        marginBottom: 28,
                        padding: '22px 24px',
                        borderRadius: 20,
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(249,115,22,0.12), transparent 38%)', pointerEvents: 'none' }} />
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16, position: 'relative' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 24px rgba(99,102,241,0.24)' }}>
                          <Sparkles size={18} color="#fff" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-text)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('aiRecommendedTitle')}</p>
                          <p style={{ fontSize: 14, color: 'var(--page-color)', lineHeight: 1.7 }}>{aiSummary}</p>
                        </div>
                      </div>

                      {aiRecommendedSchemes.length > 0 && (
                        <div style={{ display: 'grid', gap: 12, marginBottom: 12, position: 'relative' }}>
                          {aiRecommendedSchemes.map((scheme, index) => (
                            <div key={`${scheme.name}-${index}`} className="ai-inner-card" style={{ padding: '16px 16px 14px', borderRadius: 16, backdropFilter: 'blur(8px)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg, rgba(99,102,241,0.28), rgba(6,182,212,0.28))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--page-color)', margin: 0 }}>{scheme.name}</p>
                                    <p style={{ fontSize: 11, color: 'var(--accent-text)', margin: '2px 0 0' }}>{scheme.priority || 'High'} priority</p>
                                  </div>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-text)', background: 'var(--chip-bg)', border: '1px solid var(--chip-border)', borderRadius: 999, padding: '3px 8px' }}>{scheme.eligibilityStatus || 'Likely Eligible'}</span>
                              </div>

                              <div style={{ display: 'grid', gap: 8 }}>
                                <div style={{ padding: '9px 10px', borderRadius: 10, background: 'var(--surface-muted)', border: '1px solid var(--border-faint)' }}>
                                  <p className="ai-inner-label" style={{ fontSize: 11, fontWeight: 800, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Why recommended</p>
                                  <p className="ai-inner-text" style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>{scheme.whyRecommended}</p>
                                </div>
                                <div style={{ padding: '9px 10px', borderRadius: 10, background: 'var(--surface-muted)', border: '1px solid var(--border-faint)' }}>
                                  <p className="ai-inner-label" style={{ fontSize: 11, fontWeight: 800, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Benefits</p>
                                  <p className="ai-inner-text" style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>{scheme.benefits}</p>
                                </div>
                                <div style={{ padding: '9px 10px', borderRadius: 10, background: 'var(--surface-muted)', border: '1px solid var(--border-faint)' }}>
                                  <p className="ai-inner-label" style={{ fontSize: 11, fontWeight: 800, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Documents</p>
                                  <p className="ai-inner-text" style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>{Array.isArray(scheme.documents) ? scheme.documents.join(' • ') : 'Aadhaar, income proof'}</p>
                                </div>
                                <div style={{ padding: '9px 10px', borderRadius: 10, background: 'var(--surface-muted)', border: '1px solid var(--border-faint)' }}>
                                  <p className="ai-inner-label" style={{ fontSize: 11, fontWeight: 800, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next step</p>
                                  <p className="ai-inner-text" style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>{Array.isArray(scheme.nextSteps) ? scheme.nextSteps.join(' • ') : 'Check eligibility and apply online'}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {aiTips.length > 0 && (
                        <div style={{ display: 'grid', gap: 7, position: 'relative' }}>
                          {aiTips.map((tip, index) => (
                            <div key={`${tip}-${index}`} className="ai-inner-text" style={{ fontSize: 12, lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #06b6d4)', marginTop: 6, flexShrink: 0 }} />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Results header + filters */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--page-color)', marginBottom: 4 }}>{t('resultsTitle')}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('resultsSubtitle')}</span>
                        {/* Source badge */}
                        {schemeSource === 'gemini' ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 20, padding: '3px 10px', letterSpacing: '0.04em' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'star-breathe 1.5s ease-in-out infinite' }} />
                            LIVE · GEMINI AI
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--surface-muted)', border: '1px solid var(--border-soft)', borderRadius: 20, padding: '3px 10px', letterSpacing: '0.04em' }}>
                            CACHED
                          </span>
                        )}
                        {lastUpdated && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-subtle)' }}>
                            <Clock size={12} /> {new Date(lastUpdated).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'inline-flex', padding: '4px 14px', background: 'var(--chip-bg)', border: '1px solid var(--chip-border)', borderRadius: 999, fontSize: 13, fontWeight: 700, color: 'var(--chip-text)' }}>
                      {visibleSchemes.length} {visibleSchemes.length === 1 ? t('match') : t('matches')}
                    </div>
                  </div>

                  {/* Search + type filter */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 24 }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        placeholder={t('searchSchemes')}
                        className="input-dark"
                        style={{ width: '100%', padding: '11px 14px 11px 34px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                        className="input-dark"
                        style={{
                          padding: '11px 36px 11px 14px',
                          borderRadius: 12,
                          fontSize: 13,
                          fontFamily: 'inherit',
                          appearance: 'none',
                          cursor: 'pointer',
                          color: 'var(--page-color)',
                          background: 'var(--card-bg)',
                          colorScheme: darkMode ? 'dark' : 'light',
                        }}>
                        <option value="all" style={{ background: darkMode ? '#0d1527' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }}>{t('allTypes')}</option>
                        <option value="education" style={{ background: darkMode ? '#0d1527' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }}>{t('education')}</option>
                        <option value="jobs" style={{ background: darkMode ? '#0d1527' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }}>{t('jobs')}</option>
                        <option value="agriculture" style={{ background: darkMode ? '#0d1527' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }}>{t('agriculture')}</option>
                      </select>
                      <ChevronDown size={13} color="var(--text-muted)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Scheme cards grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
                    <AnimatePresence>
                      {visibleSchemes.map((s, i) => (
                        <SchemeCard key={`${s?.name}-${i}`} s={s} idx={i} t={t} navigate={navigate} onSave={handleSave} />
                      ))}
                    </AnimatePresence>
                    {visibleSchemes.length === 0 && (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: 14 }}>
                        {t('noSearchResults')}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--footer-border)', background: 'var(--footer-bg)', padding: '32px 24px', position: 'relative', zIndex: 1, backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={logo} alt="SchemeScout logo" style={{ width: 26, height: 26, borderRadius: 7, objectFit: 'cover' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>SchemeScout — {t('footerTagline')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--chip-bg)', border: '1px solid var(--chip-border)', borderRadius: 999, fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
            <Sparkles size={12} /> {t('footerBuiltForCitizens')}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-subtle)' }}>© {new Date().getFullYear()} SchemeScout</p>
        </div>
      </footer>
    </div>
  )
}

export default App
