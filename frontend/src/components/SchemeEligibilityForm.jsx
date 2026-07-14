import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppSettings } from '../context/AppSettingsContext.jsx'
import { Search, ChevronDown, Zap } from 'lucide-react'

const CATEGORY_OPTIONS = ['SC', 'ST', 'OBC', 'General']

// ── Custom Dropdown ────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder, hasError }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '12px 36px 12px 14px', borderRadius: 12,
          fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
          background: hasError ? 'rgba(248,113,113,0.06)' : 'var(--bg-surface)',
          border: hasError ? '1px solid rgba(248,113,113,0.5)' : '1px solid var(--border-subtle)',
          color: value ? 'var(--page-color)' : 'var(--text-muted)',
          outline: 'none', cursor: 'pointer', textAlign: 'left',
          boxSizing: 'border-box', display: 'flex', alignItems: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        {value || placeholder}
        <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: 12, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.2s', pointerEvents: 'none' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 999,
          background: 'var(--card-bg, #0d1126)', border: '1px solid var(--card-border, rgba(99,102,241,0.3))',
          borderRadius: 12, overflowY: 'auto', maxHeight: 220,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
        }}>
          {options.map(opt => (
            <button
              key={opt} type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                width: '100%', padding: '11px 16px', textAlign: 'left',
                background: value === opt ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: 'none', cursor: 'pointer',
                fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: value === opt ? 'var(--accent-text)' : 'var(--page-color)',
                fontWeight: value === opt ? 600 : 400,
                transition: 'background 0.15s',
                display: 'block',
              }}
              onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
              onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = 'transparent' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const STATE_OPTIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
]

function normalizeText(value) {
  return value.trim().replace(/\s+/g, ' ')
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: 8,
}

const fieldWrap = { display: 'flex', flexDirection: 'column' }

export default function SchemeEligibilityForm({ onSubmit }) {
  const { t } = useAppSettings()
  const [values, setValues] = useState({ age: '', category: '', income: '', state: '', occupation: '' })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => {
    const next = {}
    if (values.age === '') next.age = t('errAgeRequired')
    if (values.category === '') next.category = t('errCategoryRequired')
    if (values.income === '') next.income = t('errIncomeRequired')
    if (values.state === '') next.state = t('errStateRequired')
    if (normalizeText(values.occupation) === '') next.occupation = t('errOccupationRequired')
    return next
  }, [values, t])

  const canSubmit = Object.keys(errors).length === 0

  function showError(field) {
    return Boolean(errors[field] && (submitted || touched[field]))
  }

  function update(field) {
    return (e) => {
      const val = e.target.value
      setValues((v) => ({ ...v, [field]: val }))
    }
  }

  function blur(field) {
    return () => setTouched((t) => ({ ...t, [field]: true }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    if (!canSubmit) return
    const payload = {
      age: Number(values.age),
      category: values.category,
      income: Number(values.income),
      state: values.state,
      occupation: normalizeText(values.occupation),
    }
    onSubmit?.(payload)
  }



  const inputStyle = (field) => ({
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: showError(field) ? 'rgba(248,113,113,0.06)' : 'var(--bg-surface)',
    border: showError(field) ? '1px solid rgba(248,113,113,0.5)' : '1px solid var(--border-subtle)',
    color: 'var(--page-color)',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  })

  const selectStyle = (field) => ({
    ...inputStyle(field),
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    paddingRight: 36,
  })

  const focusHandlers = (field) => ({
    onFocus: (e) => {
      e.target.style.borderColor = 'rgba(99,102,241,0.6)'
      e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'
      e.target.style.background = 'rgba(99,102,241,0.07)'
    },
    onBlurCapture: (e) => {
      e.target.style.borderColor = showError(field) ? 'rgba(248,113,113,0.5)' : 'rgba(99,102,241,0.18)'
      e.target.style.boxShadow = 'none'
      e.target.style.background = showError(field) ? 'rgba(248,113,113,0.06)' : 'var(--bg-surface)'
    },
  })

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', width: '100%' }}>
      {/* Card */}
      <div className="glass panel-card" style={{
        borderRadius: 24,
        padding: '36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#6366f1,#06b6d4,#f97316)', borderRadius: '24px 24px 0 0' }} />
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(6,182,212,0.14))', border: '1px solid rgba(99,102,241,0.26)', borderRadius: 999, fontSize: 11, fontWeight: 700, color: '#67e8f9', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 8px 24px rgba(6,182,212,0.08)' }}>
              <Zap size={11} /> AI Matching Engine
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 8, background: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 55%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Find Eligible Schemes</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>Fill in your details below for personalized AI recommendations.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Row 1: Age + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>{t('formAge')}</label>
              <input
                type="number" inputMode="numeric" min="0"
                value={values.age}
                onChange={update('age')} onBlur={blur('age')}
                placeholder={t('formAgePlaceholder')}
                aria-invalid={showError('age')}
                style={inputStyle('age')}
                {...focusHandlers('age')}
              />
              {showError('age') && <p style={{ marginTop: 6, fontSize: 12, color: '#f87171' }}>{errors.age}</p>}
            </div>

            <div style={{ ...fieldWrap, position: 'relative' }}>
              <label style={labelStyle}>{t('formCategory')}</label>
              <CustomSelect
                value={values.category}
                onChange={(val) => { setValues(v => ({ ...v, category: val })); setTouched(t => ({ ...t, category: true })) }}
                options={CATEGORY_OPTIONS}
                placeholder={t('formSelectCategory')}
                hasError={showError('category')}
              />
              {showError('category') && <p style={{ marginTop: 6, fontSize: 12, color: '#f87171' }}>{errors.category}</p>}
            </div>
          </div>

          {/* Row 2: Income + State */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>{t('formIncome')} <span style={{ fontSize: 11, color: '#334155' }}>(₹/year)</span></label>
              <input
                type="number" inputMode="numeric" min="0"
                value={values.income}
                onChange={update('income')} onBlur={blur('income')}
                placeholder={t('formIncomePlaceholder')}
                aria-invalid={showError('income')}
                style={inputStyle('income')}
                {...focusHandlers('income')}
              />
              {showError('income') && <p style={{ marginTop: 6, fontSize: 12, color: '#f87171' }}>{errors.income}</p>}
            </div>

            <div style={{ ...fieldWrap, position: 'relative' }}>
              <label style={labelStyle}>{t('formState')}</label>
              <CustomSelect
                value={values.state}
                onChange={(val) => { setValues(v => ({ ...v, state: val })); setTouched(t => ({ ...t, state: true })) }}
                options={STATE_OPTIONS}
                placeholder={t('formSelectState')}
                hasError={showError('state')}
              />
              {showError('state') && <p style={{ marginTop: 6, fontSize: 12, color: '#f87171' }}>{errors.state}</p>}
            </div>
          </div>

          {/* Occupation */}
          <div style={fieldWrap}>
            <label style={labelStyle}>{t('formOccupation')}</label>
            <input
              type="text"
              value={values.occupation}
              onChange={update('occupation')} onBlur={blur('occupation')}
              placeholder={t('formOccupationPlaceholder')}
              aria-invalid={showError('occupation')}
              style={inputStyle('occupation')}
              {...focusHandlers('occupation')}
            />
            {showError('occupation') && <p style={{ marginTop: 6, fontSize: 12, color: '#f87171' }}>{errors.occupation}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontSize: 15, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              marginTop: 4,
              background: canSubmit
                ? 'linear-gradient(135deg, var(--indigo-light, #818cf8) 0%, var(--indigo, #6366f1) 50%, var(--indigo-dark, #4f46e5) 100%)'
                : 'rgba(99,102,241,0.2)',
              color: canSubmit ? '#fff' : 'rgba(255,255,255,0.4)',
              boxShadow: canSubmit ? '0 0 32px var(--glow-indigo, rgba(99,102,241,0.45)), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
              transition: 'all 0.25s ease',
              transform: 'translateY(0)',
            }}
            onMouseEnter={e => { if (canSubmit) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 44px var(--glow-indigo, rgba(99,102,241,0.6)), 0 8px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)' } }}
            onMouseLeave={e => { if (canSubmit) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 32px var(--glow-indigo, rgba(99,102,241,0.45)), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' } }}
          >
            <Search size={16} /> {t('formSubmit')}
          </button>
        </form>
      </div>
    </div>
  )
}
