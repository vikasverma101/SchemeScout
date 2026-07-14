import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../utils/auth'
import { useAppSettings } from '../context/AppSettingsContext.jsx'
import { Heart, ChevronRight, ArrowLeft, Bookmark, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SchemeDetailsModal from '../components/SchemeDetailsModal.jsx'
import logo from '../assets/logo.png'

export default function SavedSchemesPage() {
  const { t } = useAppSettings()
  const navigate = useNavigate()
  const [savedSchemes, setSavedSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedScheme, setSelectedScheme] = useState(null)

  useEffect(() => {
    async function fetchSaved() {
      setLoading(true)
      setError('')
      try {
        const token = getToken()
        const res = await axios.get('/api/save-scheme', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        setSavedSchemes(res.data?.savedSchemes ?? [])
      } catch (e) {
        if (e?.response?.status === 401) {
          clearToken()
          navigate('/login', { replace: true })
          return
        }
        setError(e?.response?.data?.message || 'Could not load saved schemes.')
      } finally {
        setLoading(false)
      }
    }
    fetchSaved()
  }, [navigate])

  return (
    <div className="aurora-bg" style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--page-color)', position: 'relative', overflow: 'hidden', transition: 'background 0.4s ease, color 0.4s ease' }}>
      {/* Orbs */}
      <div style={{ position: 'absolute', top: '5%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.15),transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} className="animate-float-slow" />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.12),transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} className="animate-float-mid" />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--nav-bg)', borderBottom: '1px solid var(--nav-border)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-ghost-outlined"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              <ArrowLeft size={14} /> {t('back')}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={logo} alt="SchemeScout logo" style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover' }} />
              <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--page-color)' }}>{t('savedSchemes')}</h1>
            </div>
          </div>
          {!loading && savedSchemes.length > 0 && (
            <span style={{ padding: '4px 12px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>
              {savedSchemes.length} saved
            </span>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="panel-card" style={{ borderRadius: 20, padding: 28 }}>
                  <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 16 }} />
                  <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 24 }} />
                  <div className="skeleton" style={{ height: 42, width: '100%', borderRadius: 12 }} />
                </div>
              ))}
            </motion.div>
          )}

          {!loading && error && (
            <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '20px 24px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 16, fontSize: 14, color: '#fca5a5' }}>
              {error}
            </motion.div>
          )}

          {!loading && !error && savedSchemes.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Bookmark size={30} color="#7c3aed" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color: 'var(--page-color)' }}>No saved schemes yet</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 28px' }}>
                Use the heart icon on matching schemes to save them here for later.
              </p>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary"
                style={{ padding: '12px 28px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'inherit' }}>
                Find Schemes
              </button>
            </motion.div>
          )}

          {!loading && !error && savedSchemes.length > 0 && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--page-color)' }}>Your Saved Schemes</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Schemes you've bookmarked to revisit.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
                {savedSchemes.map((s, i) => (
                  <motion.div key={s.schemeId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="gradient-border scheme-card glass"
                    style={{ padding: 28, borderRadius: 20, display: 'flex', flexDirection: 'column', background: 'var(--card-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--page-color)', lineHeight: 1.3 }}>{s.name || 'Scheme'}</h3>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Heart size={16} color="#f87171" fill="#f87171" />
                      </div>
                    </div>

                    {s.type && (
                      <span className="badge badge-violet" style={{ alignSelf: 'flex-start', marginBottom: 14 }}>{s.type}</span>
                    )}

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <span style={{ fontWeight: 700, color: 'var(--page-color)' }}>{t('benefits')}: </span>
                        {s.benefits}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <span style={{ fontWeight: 700, color: 'var(--page-color)' }}>{t('eligibility')}: </span>
                        {s.eligibility}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="button" onClick={() => setSelectedScheme(s)}
                        style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = 'var(--page-color)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}>
                        <Info size={13} /> Details
                      </button>
                      <button type="button" onClick={() => navigate('/apply', { state: { scheme: s } })}
                        className="btn-primary"
                        style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
                        {t('apply')} <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <SchemeDetailsModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
