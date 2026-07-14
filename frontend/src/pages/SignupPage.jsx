import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setToken } from '../utils/auth'
import { useAppSettings } from '../context/AppSettingsContext.jsx'
import logo from '../assets/logo.png'
import { Eye, EyeOff, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const PERKS = [
  'Discover 5,000+ Central & State schemes',
  'AI-powered eligibility matching in seconds',
  'Step-by-step guided application process',
  'Available in multiple Indian languages',
]

export default function SignupPage() {
  const { t } = useAppSettings()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  function onChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    const next = { name: '', email: '', password: '' }
    const name = form.name.trim()
    if (!name) next.name = t('errNameRequired')
    const email = form.email.trim()
    if (!email) next.email = t('errEmailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t('errEmailInvalid')
    if (!form.password) next.password = t('errPasswordRequired')
    else if (form.password.length < 6) next.password = t('errPasswordShort')
    setFieldErrors(next)
    return !next.name && !next.email && !next.password
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/signup', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      const token = res?.data?.token
      if (!token) throw new Error('Token missing in response.')
      setToken(token)
      navigate('/setup-profile', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="aurora-bg"
      style={{
        minHeight: '100dvh',
        background: 'var(--page-bg)',
        color: 'var(--page-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.4s ease, color 0.4s ease',
      }}
    >
      {/* Aurora blobs */}
      <div style={{ position: 'absolute', top: '-5%', right: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} className="animate-float-slow" />
      <div style={{ position: 'absolute', bottom: '5%', left: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} className="animate-float-mid" />
      <div style={{ position: 'absolute', top: '30%', left: '15%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} className="animate-float-fast" />
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />

      {/* ── Outer split card ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        {/* ── LEFT: Illustration panel ─────────── */}
        <div
          style={{
            flex: '0 0 400px',
            background: 'linear-gradient(145deg, #0d0f26 0%, #1a1240 50%, #0c1a2e 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '36px 32px',
          }}
          className="hidden-mobile"
        >
          {/* Illustration image */}
          <img
            src="/signup-illustration.png"
            alt="SchemeScout India map illustration"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.92,
            }}
          />

          {/* Gradient overlay so the text is readable */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8,6,28,0.88) 0%, rgba(8,6,28,0.2) 55%, transparent 100%)',
            }}
          />

          {/* Bottom text content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <img src={logo} alt="SchemeScout logo" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', boxShadow: '0 0 20px rgba(99,102,241,0.6)' }} />
              <span style={{ fontWeight: 800, fontSize: 16, color: '#f1f5f9', letterSpacing: '-0.01em' }}>SchemeScout</span>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 8 }}>
              Your gateway to <span style={{ background: 'linear-gradient(90deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>every scheme</span> you deserve
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              Join millions of Indians discovering and applying for government welfare schemes — all in one place.
            </p>

            {/* Perk list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PERKS.map((perk, i) => (
                <motion.div
                  key={perk}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 9 }}
                >
                  <CheckCircle2 size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#cbd5e1' }}>{perk}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 24, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[{ v: '5K+', l: 'Schemes' }, { v: '2.3Cr', l: 'Citizens' }, { v: '14', l: 'Categories' }].map(({ v, l }) => (
                <div key={l}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#818cf8' }}>{v}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form panel ─────────────────── */}
        <div
          className="glass"
          style={{
            flex: 1,
            background: 'var(--card-bg)',
            borderLeft: '1px solid var(--card-border)',
            backdropFilter: 'blur(24px)',
            padding: '44px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Mobile-only logo */}
          <div className="show-mobile" style={{ textAlign: 'center', marginBottom: 28 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img src={logo} alt="SchemeScout logo" style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover', boxShadow: '0 0 24px rgba(99,102,241,0.5)' }} />
              <span className="auth-logo-text" style={{ fontWeight: 800, fontSize: 18, color: 'var(--page-color)', letterSpacing: '-0.01em' }}>SchemeScout</span>
            </Link>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#67e8f9', marginBottom: 16 }}>
              <Sparkles size={12} /> Join for free
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--page-color)', marginBottom: 6 }}>{t('createAccount')}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('signUpSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>{t('name')}</label>
              <input
                type="text" autoComplete="name"
                value={form.name}
                onChange={(e) => { onChange('name')(e); setFieldErrors(p => ({ ...p, name: '' })) }}
                placeholder="Rahul Sharma"
                className={`input-dark ${fieldErrors.name ? 'input-err' : ''}`}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit' }}
              />
              {fieldErrors.name && <p style={{ marginTop: 6, fontSize: 12, color: '#f87171' }}>{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>{t('email')}</label>
              <input
                type="email" autoComplete="email"
                value={form.email}
                onChange={(e) => { onChange('email')(e); setFieldErrors(p => ({ ...p, email: '' })) }}
                placeholder="you@email.com"
                className={`input-dark ${fieldErrors.email ? 'input-err' : ''}`}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit' }}
              />
              {fieldErrors.email && <p style={{ marginTop: 6, fontSize: 12, color: '#f87171' }}>{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>{t('password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => { onChange('password')(e); setFieldErrors(p => ({ ...p, password: '' })) }}
                  placeholder="Min. 6 characters"
                  className={`input-dark ${fieldErrors.password ? 'input-err' : ''}`}
                  style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit' }}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p style={{ marginTop: 6, fontSize: 12, color: '#f87171' }}>{fieldErrors.password}</p>}
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 12, fontSize: 13, color: '#fca5a5' }}>{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '13px', borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginTop: 4 }}>
              {loading ? (
                <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} /> {t('creatingAccount')}</>
              ) : (
                <><UserPlus size={16} /> {t('signUp')}</>
              )}
            </button>
          </form>

          <div className="auth-divider auth-footer-text" style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(99,102,241,0.12)', textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--accent-text)', textDecoration: 'none' }}>{t('login')}</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
