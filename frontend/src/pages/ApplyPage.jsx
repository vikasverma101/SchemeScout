import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSettings } from '../context/AppSettingsContext.jsx'
import { ArrowLeft, Send, CheckCircle2, FileText, User, Mail, Phone, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ApplyPage() {
  const { t } = useAppSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const scheme = location.state?.scheme

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', aadhaar: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  function onChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function onSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="aurora-bg" style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--page-color)', padding: '40px 24px', position: 'relative', overflow: 'hidden', transition: 'background 0.4s ease, color 0.4s ease' }}>
      <div style={{ position: 'absolute', top: '5%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12),transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} className="animate-float-slow" />
      <div style={{ position: 'absolute', bottom: '10%', left: '0', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.1),transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} className="animate-float-mid" />

      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
        <button type="button" onClick={() => navigate(-1)} className="btn-ghost-outlined"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', marginBottom: 28 }}>
          <ArrowLeft size={14} /> {t('back')}
        </button>

        {scheme && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 18, padding: '20px 24px', marginBottom: 24, display: 'flex', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={20} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{t('applicationForm')}</p>
              <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--page-color)' }}>{scheme.name}</h2>
              {scheme.eligibility && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{scheme.eligibility}</p>}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="panel-card" style={{ borderRadius: 24, padding: '36px' }}>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: 28 }}>
                  <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6, color: 'var(--page-color)' }}>
                    {scheme?.name || t('schemeApplication')}
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('applyFormSubtitle')}</p>
                </div>

                <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 20px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <User size={13} /> {t('fullName')}
                    </label>
                    <input required value={form.fullName} onChange={onChange('fullName')} placeholder="Your full legal name"
                      className="input-dark"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit' }} />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <Mail size={13} /> {t('email')}
                    </label>
                    <input type="email" required value={form.email} onChange={onChange('email')} placeholder="you@email.com"
                      className="input-dark"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit' }} />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <Phone size={13} /> {t('phone')}
                    </label>
                    <input required value={form.phone} onChange={onChange('phone')} placeholder="+91 98765 43210"
                      className="input-dark"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit' }} />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <Hash size={13} /> {t('aadhaarNumber')}
                    </label>
                    <input required value={form.aadhaar} onChange={onChange('aadhaar')} placeholder="XXXX XXXX XXXX"
                      className="input-dark"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit' }} />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>{t('additionalDetails')}</label>
                    <textarea value={form.notes} onChange={onChange('notes')} rows={4} placeholder="Any additional details you'd like to share..."
                      className="input-dark"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', minHeight: 100 }} />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <button type="submit" className="btn-primary"
                      style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                      <Send size={16} /> {t('submitApplication')}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
                style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(16,185,129,0.2)' }}>
                  <CheckCircle2 size={40} color="#10b981" />
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, color: 'var(--page-color)' }}>Application Submitted!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 32px' }}>
                  {t('applicationSubmitted')}
                </p>
                <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary"
                  style={{ padding: '13px 32px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'inherit' }}>
                  Back to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
