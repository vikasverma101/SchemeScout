import axios from 'axios'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setToken } from '../utils/auth'
import { useAppSettings } from '../context/AppSettingsContext.jsx'
import logo from '../assets/logo.png'
import { Eye, EyeOff, LogIn, Sparkles, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const TRUST_POINTS = [
  'Trusted by 2.3 Cr+ citizens across India',
  'Secure — your data is encrypted end-to-end',
  'AI matches you to 5,000+ welfare schemes',
  'Central & State schemes in one dashboard',
]

export default function LoginPage() {
  const { t } = useAppSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const redirectTo = location.state?.from || '/'

  function onChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    const next = { email: '', password: '' }
    const email = form.email.trim()
    if (!email) next.email = t('errEmailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t('errEmailInvalid')
    if (!form.password) next.password = t('errPasswordRequired')
    setFieldErrors(next)
    return !next.email && !next.password
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/login', form)
      const token = res?.data?.token
      if (!token) throw new Error('Token missing in response.')
      setToken(token)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.')
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
      <div style={{ position: 'absolute', top: '-5%', left: '-10%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(79,70,229,0.1) 50%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} className="animate-float-slow" />
      <div style={{ position: 'absolute', bottom: '5%', right: '-8%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} className="animate-float-mid" />
      <div style={{ position: 'absolute', top: '40%', right: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} className="animate-float-fast" />
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
          maxWidth: 860,
          display: 'flex',
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        {/* ── LEFT: Illustration panel ─────────── */}
        <div
          style={{
            flex: '0 0 380px',
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
            src="/login-illustration.png"
            alt="SchemeScout welcome back illustration"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.9,
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8,6,28,0.9) 0%, rgba(8,6,28,0.25) 55%, transparent 100%)',
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
              Welcome back to your <span style={{ background: 'linear-gradient(90deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>scheme hub</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              Sign in to access your personalized scheme recommendations and application tracker.
            </p>

            {/* Trust points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TRUST_POINTS.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 9 }}
                >
                  <ShieldCheck size={14} style={{ color: '#818cf8', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#cbd5e1' }}>{point}</span>
                </motion.div>
              ))}
            </div>

            {/* Active user badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>AI engine active — schemes updated in real-time</span>
            </motion.div>
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
            padding: '48px 40px',
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--chip-bg)', border: '1px solid var(--chip-border)', borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 16 }}>
              <Sparkles size={12} /> Welcome back
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--page-color)', marginBottom: 6 }}>{t('login')}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('signInSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
                  type={showPwd ? 'text' : 'password'} autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => { onChange('password')(e); setFieldErrors(p => ({ ...p, password: '' })) }}
                  placeholder="••••••••"
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

            {/* Error */}
            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 12, fontSize: 13, color: '#fca5a5' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '13px', borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginTop: 4 }}>
              {loading ? (
                <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} /> {t('loggingIn')}</>
              ) : (
                <><LogIn size={16} /> {t('login')}</>
              )}
            </button>
          </form>

          <div className="auth-divider auth-footer-text" style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(99,102,241,0.12)', textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            {t('newUser')}{' '}
            <Link to="/signup" style={{ fontWeight: 700, color: 'var(--accent-text)', textDecoration: 'none' }}>{t('createAccount')}</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
