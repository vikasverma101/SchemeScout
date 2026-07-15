import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, X } from 'lucide-react'
import { useAppSettings } from '../context/AppSettingsContext.jsx'

export default function SharedMobileNav({ title = 'SchemeScout', brandTo = '/', menuItems = [], children = null }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { darkMode, setDarkMode } = useAppSettings()

  const handleSelect = (item) => {
    setIsOpen(false)
    if (item.onClick) {
      item.onClick()
      return
    }
    if (item.to) {
      navigate(item.to)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen((value) => !value)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid var(--card-border)',
          borderRadius: 9,
          cursor: 'pointer',
          color: '#818cf8',
        }}
      >
        {isOpen ? <X size={20} /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              minWidth: 280,
              overflow: 'hidden',
              border: '1px solid var(--card-border)',
              borderRadius: 16,
              background: 'var(--nav-bg)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              zIndex: 120,
            }}
          >
            <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', background: 'rgba(99,102,241,0.06)', border: '1px solid var(--card-border)', borderRadius: 12 }}>
                <Link to={brandTo} onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', fontSize: 14, fontWeight: 700, color: 'var(--page-color)' }}>
                  {title}
                </Link>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Menu</span>
              </div>

              {menuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSelect(item)}
                  style={{
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 15,
                    fontWeight: item.highlight ? 700 : 500,
                    color: item.danger ? '#f87171' : 'var(--text-muted)',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    borderRadius: 10,
                  }}
                >
                  {item.label}
                </button>
              ))}

              <div style={{ height: 1, background: 'rgba(99,102,241,0.15)', margin: '4px 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', marginBottom: 6, background: 'rgba(99,102,241,0.06)', border: '1px solid var(--card-border)', borderRadius: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--page-color)' }}>{darkMode ? 'Dark mode' : 'Light mode'}</span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setDarkMode((value) => !value)}
                  aria-label="Toggle theme"
                  style={{ position: 'relative', width: 46, height: 24, borderRadius: 999, border: darkMode ? '1px solid rgba(129,140,248,0.45)' : '1px solid rgba(251,191,36,0.55)', background: darkMode ? 'rgba(99,102,241,0.22)' : 'rgba(251,191,36,0.18)', display: 'flex', alignItems: 'center', padding: '2px', boxShadow: darkMode ? '0 0 8px rgba(99,102,241,0.25)' : '0 0 8px rgba(251,191,36,0.25)' }}
                >
                  <motion.div
                    animate={{ x: darkMode ? 0 : 22 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    style={{ width: 18, height: 18, borderRadius: '50%', background: darkMode ? 'linear-gradient(135deg,#818cf8,#6366f1)' : 'linear-gradient(135deg,#fbbf24,#f97316)' }}
                  />
                </motion.button>
              </div>

              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
