import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { getToken } from '../utils/auth'
import { useAppSettings } from '../context/AppSettingsContext.jsx'
import logo from '../assets/logo.png'
import { Camera, Upload, RefreshCw, Check, SkipForward } from 'lucide-react'

export default function SetupProfilePage() {
  const { accentColor } = useAppSettings()
  const navigate    = useNavigate()
  const videoRef    = useRef(null)
  const canvasRef   = useRef(null)
  const streamRef   = useRef(null)
  const fileRef     = useRef(null)

  const [step, setStep]         = useState('camera')   // 'camera' | 'preview'
  const [preview, setPreview]   = useState(null)       // base64 data URL
  const [camError, setCamError] = useState('')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  /* ── Camera lifecycle ─────────────────────── */
  // cancelRef lets us signal an in-flight getUserMedia to stop itself
  // even if it resolves after the component has already unmounted.
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = false
    startCamera()
    return () => {
      cancelRef.current = true
      killStream()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Unconditionally stops every track and clears the video element
  function killStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  async function startCamera() {
    setCamError('')
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
      })
    } catch {
      if (!cancelRef.current)
        setCamError('Camera access denied. Please allow camera permission or upload a photo instead.')
      return
    }
    // Component unmounted while we waited — kill the stream immediately
    if (cancelRef.current) {
      stream.getTracks().forEach(t => t.stop())
      return
    }
    streamRef.current = stream
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {})
    }
  }

  function stopCamera() {
    killStream()
  }

  /* ── Capture frame ────────────────────────── */
  function capture() {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const size = 400
    canvas.width  = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    // Centre-crop square
    const vw = video.videoWidth
    const vh = video.videoHeight
    const side = Math.min(vw, vh)
    const sx = (vw - side) / 2
    const sy = (vh - side) / 2
    ctx.save()
    ctx.scale(-1, 1)          // mirror the selfie
    ctx.drawImage(video, sx, sy, side, side, -size, 0, size, size)
    ctx.restore()

    const dataURL = canvas.toDataURL('image/jpeg', 0.7)
    setPreview(dataURL)
    setStep('preview')
    stopCamera()
  }

  /* ── File upload fallback ─────────────────── */
  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      // Compress via canvas
      const img = new Image()
      img.onload = () => {
        const size = 400
        const cv = document.createElement('canvas')
        cv.width = cv.height = size
        const ctx = cv.getContext('2d')
        const side = Math.min(img.width, img.height)
        const sx = (img.width  - side) / 2
        const sy = (img.height - side) / 2
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)
        setPreview(cv.toDataURL('image/jpeg', 0.7))
        setStep('preview')
        stopCamera()
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  /* ── Retake ───────────────────────────────── */
  function retake() {
    setPreview(null)
    setStep('camera')
    setSaved(false)
    cancelRef.current = false   // allow a fresh stream
    startCamera()
  }

  /* ── Save to backend ──────────────────────── */
  async function save() {
    if (!preview) return
    setSaving(true)
    try {
      await axios.put('/api/auth/profile-picture',
        { profilePicture: preview },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      )
      setSaved(true)
      setTimeout(() => navigate('/', { replace: true }), 900)
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="aurora-bg" style={{
      minHeight: '100dvh', background: 'var(--page-bg)', color: 'var(--page-color)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative', overflow: 'hidden', transition: 'background 0.4s ease, color 0.4s ease'
    }}>
      {/* Background blobs */}
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.18),transparent 70%)', filter:'blur(72px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'0%', left:'-5%', width:440, height:440, borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,212,0.15),transparent 70%)', filter:'blur(72px)', pointerEvents:'none' }} />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 480, position: 'relative' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#6366f1,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', boxShadow:'0 0 20px rgba(99,102,241,0.45)' }}>SS</div>
            <span style={{ fontWeight:800, fontSize:17, color:'var(--page-color)' }}>SchemeScout</span>
          </div>
        </div>

        {/* Card */}
        <div className="panel-card" style={{
          borderRadius:24, padding:'36px 32px',
        }}>
          {/* Heading */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 14px', background:'var(--chip-bg)', border:'1px solid var(--chip-border)', borderRadius:999, fontSize:12, fontWeight:600, color:'var(--accent-text)', marginBottom:14 }}>
              <Camera size={12} /> Step 2 of 2
            </div>
            <h1 style={{ fontSize:24, fontWeight:800, color:'var(--page-color)', letterSpacing:'-0.02em', marginBottom:6 }}>
              Add a Profile Photo
            </h1>
            <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.6 }}>
              Take a selfie or upload a photo so others know it's you.
            </p>
          </div>

          <AnimatePresence mode="wait">

            {/* ── CAMERA STEP ── */}
            {step === 'camera' && (
              <motion.div key="camera"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                transition={{ duration:0.3 }}>

                {camError ? (
                  <div style={{ textAlign:'center', padding:'28px 20px', borderRadius:18, background:'rgba(248,113,113,0.06)', border:'1px solid rgba(248,113,113,0.18)', marginBottom:20 }}>
                    <Camera size={36} color="#f87171" style={{ marginBottom:12 }} />
                    <p style={{ fontSize:13, color:'#fca5a5', lineHeight:1.6 }}>{camError}</p>
                  </div>
                ) : (
                  <div style={{ position:'relative', marginBottom:20 }}>
                    {/* Viewfinder frame */}
                    <div style={{
                      width:'100%', aspectRatio:'1/1', borderRadius:20, overflow:'hidden',
                      border:`2px solid ${accentColor}55`,
                      boxShadow:`0 0 0 1px ${accentColor}22, 0 8px 40px rgba(0,0,0,0.5)`,
                      position:'relative', background:'#000',
                    }}>
                      <video ref={videoRef} autoPlay playsInline muted
                        style={{ width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)' }} />
                      {/* Corner guides */}
                      {['0 0','0 auto','auto 0','auto auto'].map((m,i) => (
                        <div key={i} style={{
                          position:'absolute',
                          top: i < 2 ? 16 : 'auto', bottom: i >= 2 ? 16 : 'auto',
                          left: i % 2 === 0 ? 16 : 'auto', right: i % 2 !== 0 ? 16 : 'auto',
                          width:28, height:28,
                          borderTop:    i < 2 ? `2px solid ${accentColor}b0` : 'none',
                          borderBottom: i >= 2 ? `2px solid ${accentColor}b0` : 'none',
                          borderLeft:   i % 2 === 0 ? `2px solid ${accentColor}b0` : 'none',
                          borderRight:  i % 2 !== 0 ? `2px solid ${accentColor}b0` : 'none',
                        }} />
                      ))}
                    </div>
                    {/* Scanning line */}
                    <div style={{
                      position:'absolute', left:2, right:2, height:2, borderRadius:2,
                      background:`linear-gradient(90deg, transparent, ${accentColor}99, transparent)`,
                      animation:'scan-line 2.5s ease-in-out infinite', top:0,
                      boxShadow:`0 0 10px ${accentColor}80`,
                    }} />
                  </div>
                )}

                {/* Capture button */}
                <button onClick={capture} disabled={!!camError}
                  style={{
                    width:'100%', padding:14, borderRadius:14, border:'none',
                    background: camError ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                    color: camError ? '#475569' : '#fff',
                    fontSize:15, fontWeight:700, cursor: camError ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    fontFamily:'inherit', boxShadow: camError ? 'none' : `0 4px 20px ${accentColor}55`,
                    transition:'all 0.2s',
                  }}>
                  <Camera size={18} /> Take Photo
                </button>

                <div style={{ display:'flex', alignItems:'center', gap:12, margin:'16px 0' }}>
                  <div style={{ flex:1, height:1, background:'var(--border-faint)' }} />
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>or</span>
                  <div style={{ flex:1, height:1, background:'var(--border-faint)' }} />
                </div>

                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFile} />
                <button onClick={() => fileRef.current?.click()} className="btn-ghost-outlined"
                  style={{
                    width:'100%', padding:13, borderRadius:14,
                    fontSize:14, fontWeight:600,
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    fontFamily:'inherit',
                  }}>
                  <Upload size={16} /> Upload from device
                </button>
              </motion.div>
            )}

            {/* ── PREVIEW STEP ── */}
            {step === 'preview' && preview && (
              <motion.div key="preview"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                transition={{ duration:0.3 }}>

                {/* Avatar preview */}
                <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
                  <div style={{ position:'relative' }}>
                    <img src={preview} alt="Profile preview"
                      style={{ width:200, height:200, borderRadius:'50%', objectFit:'cover',
                        border:'3px solid rgba(99,102,241,0.5)',
                        boxShadow:'0 0 0 6px rgba(99,102,241,0.1), 0 8px 40px rgba(0,0,0,0.5)' }} />
                    {saved && (
                      <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                        style={{ position:'absolute', bottom:8, right:8, width:36, height:36, borderRadius:'50%',
                          background:'#22c55e', display:'flex', alignItems:'center', justifyContent:'center',
                          boxShadow:'0 0 16px rgba(34,197,94,0.6)' }}>
                        <Check size={18} color="#fff" />
                      </motion.div>
                    )}
                  </div>
                </div>

                <p style={{ textAlign:'center', fontSize:13, color:'var(--text-muted)', marginBottom:24, lineHeight:1.6 }}>
                  Looking good! This photo will appear on your profile.
                </p>

                {/* Save button */}
                <button onClick={save} disabled={saving || saved}
                  style={{
                    width:'100%', padding:14, borderRadius:14, border:'none',
                    background: saved
                      ? 'linear-gradient(135deg,#16a34a,#15803d)'
                      : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                    color:'#fff', fontSize:15, fontWeight:700,
                    cursor: saving||saved ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    fontFamily:'inherit',
                    boxShadow: saved ? '0 4px 20px rgba(22,163,74,0.4)' : `0 4px 20px ${accentColor}55`,
                    transition:'all 0.3s', marginBottom:12,
                  }}>
                  {saved ? (
                    <><Check size={18} /> Saved! Redirecting…</>
                  ) : saving ? (
                    <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin-slow 0.7s linear infinite', display:'inline-block' }} /> Saving…</>
                  ) : (
                    <><Check size={18} /> Use this photo</>
                  )}
                </button>

                <button onClick={retake} className="btn-ghost-outlined"
                  style={{
                    width:'100%', padding:13, borderRadius:14,
                    fontSize:14, fontWeight:600,
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    fontFamily:'inherit',
                  }}>
                  <RefreshCw size={15} /> Retake
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip */}
          <div style={{ textAlign:'center', marginTop:20 }}>
            <button onClick={() => navigate('/', { replace: true })}
              style={{ background:'none', border:'none', color:'var(--text-muted)', fontSize:13, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:5 }}>
              <SkipForward size={13} /> Skip for now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Scan line keyframe (inline style fallback) */}
      <style>{`
        @keyframes scan-line {
          0%   { top: 2px;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: calc(100% - 4px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
