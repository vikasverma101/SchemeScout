const mongoose = require('mongoose')

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/schemescout'

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10_000,
    })
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${mongoose.connection.name}`)
    return true
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[DB] MongoDB connection failed. Continuing without database: ${err?.message || String(err)}`)
    return false
  }
}

module.exports = { connectDB }

