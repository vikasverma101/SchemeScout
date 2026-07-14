import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../utils/auth'
import { useAppSettings } from '../context/AppSettingsContext.jsx'
import { ArrowLeft, Save, User, Mail, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { t } = useAppSettings()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const token = getToken()
        const res = await axios.get('/api/auth/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        setName(res.data?.user?.name || '')
        setEmail(res.data?.user?.email || '')
      } catch (e) {
        if (e?.response?.status === 401) {
          clearToken()
          navigate('/login', { replace: true })
        }
      }
    }
    load()
  }, [navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const token = getToken()
      await axios.put('/api/auth/profile', { name }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      setMessage('Profile updated successfully.')
    } catch (e) {
      if (e?.response?.status === 401) {
        clearToken()
        navigate('/login', { replace: true })
        return
      }
      setError(e?.response?.data?.message || 'Could not update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="aurora-bg" style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--page-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden', transition: 'background 0.4s ease, color 0.4s ease' }}>
      <div style={{ position: 'absolute', top: '15%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.15),transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} className="animate-float-slow" />
      <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.12),transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} className="animate-float-mid" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 500, position: 'relative' }}
      >
        <button type="button" onClick={() => navigate('/dashboard')} className="btn-ghost-outlined"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', marginBottom: 24 }}>
          <ArrowLeft size={14} /> {t('back')}
        </button>

        <div className="panel-card" style={{ borderRadius: 24, padding: '40px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid var(--border-faint)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', boxShadow: '0 0 24px rgba(124,58,237,0.4)', flexShrink: 0 }}>
              {name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : <User size={22} />}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4, color: 'var(--page-color)' }}>{t('profile')}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t('manageAccountInfo')}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                <User size={13} /> {t('name')}
              </label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="input-dark"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit' }}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <Mail size={13} /> {t('email')}
                <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--surface-muted)', border: '1px solid var(--border-soft)', borderRadius: 999, color: 'var(--text-subtle)' }}>read-only</span>
              </label>
              <input type="email" value={email} disabled
                className="input-dark"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', opacity: 0.6 }}
              />
            </div>

            {message && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, fontSize: 13, color: '#059669' }}>
                <CheckCircle2 size={15} /> {message}
              </div>
            )}

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 12, fontSize: 13, color: '#dc2626' }}>{error}</div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-ghost-outlined"
                style={{ flex: 1, padding: '12px', borderRadius: 14, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
                {t('back')}
              </button>
              <button type="submit" disabled={loading} className="btn-primary"
                style={{ flex: 2, padding: '12px', borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                {loading ? (
                  <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} /> Saving...</>
                ) : (
                  <><Save size={15} /> {t('saveChanges')}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
