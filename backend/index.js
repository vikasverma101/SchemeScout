const express = require('express')
const cors = require('cors')
require('dotenv').config()

const schemesRoutes = require('./routes/schemesRoutes')
const authRoutes = require('./routes/authRoutes')
const savedSchemesRoutes = require('./routes/savedSchemesRoutes')
const { connectDB } = require('./config/db')
const { seedSchemesIfEmpty } = require('./seed/seedSchemes')
const { initCronJobs } = require('./cron/cronJob')

const app = express()

// const corsOptions = {
//   origin: process.env.FRONTEND_URL || true,
//   credentials: true,
// }

app.use(cors({
    origin:"https://schemescout-gv7e.onrender.com",
    credentials:true

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
    // eslint-disable-next-line no-console
    console.warn('[DB] Skipping seed data load because MongoDB is unavailable.')
  }

  // Initialize background tasks like scraper cron job
  initCronJobs()

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

