import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

/* ─── Scheme Details Modal ─────────────────────────────────────────── */
export default function SchemeDetailsModal({ scheme, onClose }) {
  if (!scheme) return null

  const typeColorMap = {
    education:   { accent: '#818cf8', glow: 'rgba(129,140,248,0.15)', ministry: 'Ministry of Education', emoji: '🎓' },
    jobs:        { accent: '#34d399', glow: 'rgba(52,211,153,0.15)',  ministry: 'Ministry of Labour & Employment', emoji: '💼' },
    agriculture: { accent: '#fb923c', glow: 'rgba(251,146,60,0.15)',  ministry: 'Ministry of Agriculture & Farmers Welfare', emoji: '🌾' },
    health:      { accent: '#f472b6', glow: 'rgba(244,114,182,0.15)', ministry: 'Ministry of Health & Family Welfare', emoji: '🏥' },
  }
  const tc = typeColorMap[scheme.type] || typeColorMap.education

  const typeDescriptions = {
    education: 'This is a government-backed education welfare scheme designed to provide financial assistance and academic support to eligible students across India. It aims to reduce the financial burden on families and ensure that no deserving student is denied quality education due to economic constraints.',
    jobs: 'This employment and livelihood scheme is launched by the Government of India to support skill development, job creation, and workforce integration. It targets unemployed youth, women, and marginalized communities to boost economic participation and sustainable livelihoods.',
    agriculture: 'This agricultural welfare scheme is designed to empower Indian farmers with financial support, technology access, crop insurance, and better market linkages. It focuses on increasing farm income, promoting sustainable practices, and ensuring food security across rural India.',
    health: 'This health and wellness scheme provides medical coverage, insurance protection, and healthcare access to low-income families and vulnerable populations. It aims to reduce out-of-pocket healthcare expenses and ensure quality medical treatment reaches every corner of India.',
  }

  const description = scheme.description ||
    `${scheme.name} is a flagship initiative under the ${tc.ministry}. ${typeDescriptions[scheme.type] || typeDescriptions.education} Eligible beneficiaries receive ${scheme.benefits || 'financial and non-financial assistance'} based on the criteria set by the concerned authority.`

  const quickStats = [
    { label: 'Ministry / Dept', value: tc.ministry,   icon: '🏛️' },
    { label: 'Scheme Type',     value: scheme.type ? scheme.type.charAt(0).toUpperCase() + scheme.type.slice(1) : 'Central', icon: tc.emoji },
    { label: 'Coverage',        value: 'Pan India',    icon: '🗺️' },
    { label: 'Mode',            value: 'Online / Offline (CSC)', icon: '💻' },
  ]

  const howToApplySteps = [
    'Visit the official government portal or nearest Common Service Centre (CSC)',
    'Register/Login with your Aadhaar number or mobile number',
    'Fill in the application form with your personal and income details',
    'Upload required documents (Aadhaar, income certificate, caste certificate if applicable)',
    'Submit the application and note your Application Reference Number',
    'Track your application status through the portal or SMS alerts',
  ]

  const requiredDocs = [
    'Aadhaar Card (mandatory for identity proof)',
    'Bank account details (for direct benefit transfers)',
    'Income certificate from local authority',
    scheme.type === 'education'   ? 'School/College enrollment proof'    : null,
    scheme.type === 'agriculture' ? 'Land ownership / Kisan Credit Card' : null,
    scheme.type === 'jobs'        ? 'Employment registration certificate' : null,
    'Passport-size photograph',
    'Residence/Domicile certificate',
  ].filter(Boolean)

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="panel-card"
        style={{
          borderRadius: 24,
          width: '100%', maxWidth: 660,
          maxHeight: '88vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Sticky header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', borderRadius: '24px 24px 0 0', padding: '20px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <span style={{ display: 'inline-block', padding: '3px 10px', background: `${tc.glow}`, border: `1px solid ${tc.accent}44`, borderRadius: 999, fontSize: 11, fontWeight: 700, color: tc.accent, textTransform: 'capitalize', marginBottom: 10 }}>{scheme.type || 'scheme'}</span>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--page-color)', lineHeight: 1.3, letterSpacing: '-0.02em' }}>{scheme.name}</h2>
            </div>
            <button onClick={onClose} className="modal-close-btn" style={{ width: 34, height: 34, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, lineHeight: 1, fontFamily: 'inherit' }}>✕</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* About */}
          <div style={{ background: `linear-gradient(135deg, ${tc.glow}, rgba(99,102,241,0.04))`, border: `1px solid ${tc.accent}33`, borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: `${tc.glow}`, border: `1px solid ${tc.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>ℹ️</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: tc.accent, textTransform: 'uppercase', letterSpacing: '0.06em' }}>About this Scheme</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--page-color)', lineHeight: 1.75, margin: '0 0 16px' }}>{description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {quickStats.map(({ label, value, icon }) => (
                <div key={label} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--page-color)', lineHeight: 1.4 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🎁</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Benefits</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--page-color)', lineHeight: 1.7, margin: 0 }}>{scheme.benefits || 'Refer to the official scheme portal for complete benefit details.'}</p>
          </div>

          {/* Eligibility */}
          <div style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✅</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Eligibility Criteria</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--page-color)', lineHeight: 1.7, margin: 0 }}>{scheme.eligibility || 'Eligibility is determined based on income, category, age, and state of residence.'}</p>
          </div>

          {/* Required Documents */}
          <div style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(251,146,60,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>📄</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Required Documents</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {requiredDocs.map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#fb923c', fontSize: 12, marginTop: 2, flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Apply */}
          <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🚀</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.06em' }}>How to Apply</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {howToApplySteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#06b6d4', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 28px 24px', display: 'flex', gap: 12 }}>
          <button type="button" onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'inherit' }}>
            Close
          </button>
          <button type="button" onClick={() => { onClose(); window.open('https://www.india.gov.in/my-government/schemes', '_blank') }}
            className="btn-primary"
            style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            Apply on Portal <ExternalLink size={13} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
