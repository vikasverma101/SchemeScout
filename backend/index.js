import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import schemesRoutes from './routes/schemesRoutes.js'
import authRoutes from './routes/authRoutes.js'
import savedSchemesRoutes from './routes/savedSchemesRoutes.js'
import { connectDB } from './config/db.js'
import { seedSchemesIfEmpty } from './seed/seedSchemes.js'
import { initCronJobs } from './cron/cronJob.js'

dotenv.config()

const app = express()

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)){
      return callback(null, true)
    }
    return callback(new Error(`CORS policy blocked request from origin: ${origin}`), false)
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/schemes', schemesRoutes)
app.use('/api/save-scheme', savedSchemesRoutes)

const PORT = process.env.PORT || 5000

async function start() {
  const dbReady = await connectDB()
  if (dbReady) {
    await seedSchemesIfEmpty()
  } else {
    console.warn('[DB] Skipping seed data load because MongoDB is unavailable.')
  }

  initCronJobs()

  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`)
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})

