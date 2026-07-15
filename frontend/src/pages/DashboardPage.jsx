import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../utils/auth'
import { useAppSettings } from '../context/AppSettingsContext.jsx'
import { Bookmark, LayoutDashboard, UserRound, ChevronRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import SharedMobileNav from '../components/SharedMobileNav.jsx'

export default function DashboardPage() {
  const { t } = useAppSettings()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [savedCount, setSavedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const token = getToken()
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const [meRes, savedRes] = await Promise.all([
          axios.get('/api/auth/me', { headers }),
          axios.get('/api/save-scheme', { headers }),
        ])
        setUser(meRes.data?.user || null)
        setSavedCount((savedRes.data?.savedSchemes || []).length)
      } catch (e) {
        if (e?.response?.status === 401) {
          clearToken()
          navigate('/login', { replace: true })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??'

  return (
    <div className="aurora-bg" style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--page-color)', position: 'relative', overflow: 'hidden', transition: 'background 0.4s ease, color 0.4s ease' }}>
      {/* Aurora blobs */}
      <div style={{ position: 'absolute', top: '5%', right: '2%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} className="animate-float-slow" />
      <div style={{ position: 'absolute', bottom: '15%', left: '2%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.15),transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} className="animate-float-mid" />
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-ghost-outlined"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', flexShrink: 0 }}>
            ← {t('backToHome')}
          </button>

          <div style={{ display: 'none', marginLeft: 'auto' }} className="show-mobile dashboard-mobile-menu">
            <SharedMobileNav
              title="Dashboard"
              brandTo="/dashboard"
              menuItems={[
                { label: t('viewSavedSchemes'), onClick: () => navigate('/saved') },
                { label: t('editProfile'), onClick: () => navigate('/profile') },
                { label: 'Find Schemes', onClick: () => navigate('/dashboard') },
                { label: 'Logout', danger: true, onClick: () => { clearToken(); navigate('/login', { replace: true }) } },
              ]}
            />
          </div>
        </div>

        <motion.div className="panel-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ borderRadius: 24, padding: '32px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', boxShadow: '0 0 32px rgba(99,102,241,0.5)', flexShrink: 0 }}>
            {loading ? '?' : initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'var(--chip-bg)', border: '1px solid var(--chip-border)', borderRadius: 999, fontSize: 11, fontWeight: 700, color: 'var(--accent-text)', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <Sparkles size={11} /> Account Overview
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4, color: 'var(--page-color)' }}>
              {loading ? 'Loading...' : user?.name || '—'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{loading ? '' : user?.email || '—'}</p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: t('account'), value: loading ? '—' : user?.name || '—', icon: UserRound, color: '#6366f1', glow: 'rgba(99,102,241,0.15)' },
            { label: t('email'), value: loading ? '—' : user?.email || '—', icon: UserRound, color: '#06b6d4', glow: 'rgba(6,182,212,0.12)' },
            { label: t('savedSchemesLabel'), value: loading ? '—' : savedCount, icon: Bookmark, color: '#10b981', glow: 'rgba(16,185,129,0.1)' },
          ].map((item, i) => (
            <motion.div key={item.label} className="panel-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
              style={{ borderRadius: 18, padding: '22px 24px', boxShadow: `0 0 24px ${item.glow}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${item.glow}`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={16} color={item.color} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--page-color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
          {[
            { label: t('viewSavedSchemes'), icon: Bookmark, fn: () => navigate('/saved'), primary: true },
            { label: t('editProfile'), icon: UserRound, fn: () => navigate('/profile'), primary: false },
            { label: 'Find Schemes', icon: LayoutDashboard, fn: () => navigate('/dashboard'), primary: false },
          ].map(item => (
            <button key={item.label} type="button" onClick={item.fn}
              className={item.primary ? 'btn-primary' : ''}
              style={item.primary
                ? { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' }
                : { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--surface-muted)', border: '1px solid var(--border-subtle)', borderRadius: 16, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => { if (!item.primary) { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--hover-text)'; e.currentTarget.style.background = 'var(--hover-surface)'; e.currentTarget.style.boxShadow = '0 0 20px var(--glow-indigo)' } }}
              onMouseLeave={e => { if (!item.primary) { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--surface-muted)'; e.currentTarget.style.boxShadow = 'none' } }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <item.icon size={16} />
                {item.label}
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
