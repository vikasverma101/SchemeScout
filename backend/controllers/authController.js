const jwt = require('jsonwebtoken')
const User = require('../models/User')

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email, name: user.name },
    process.env.JWT_SECRET || 'dev_jwt_secret',
    { expiresIn: '7d' }
  )
}

async function signup(req, res) {
  const { name, email, password } = req.body || {}

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required.' })
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'password must be at least 6 characters.' })
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() }).lean()
  if (existing) {
    return res.status(409).json({ message: 'Email already registered.' })
  }

  const user = await User.create({ name, email, password })
  const token = signToken(user)

  return res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  })
}

async function login(req, res) {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required.' })
  }

  const user = await User.findOne({ email: String(email).toLowerCase() })
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const isValid = await user.comparePassword(password)
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const token = signToken(user)
  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  })
}

async function me(req, res) {
  const user = await User.findById(req.user?.userId).select('name email profilePicture createdAt').lean()
  if (!user) return res.status(404).json({ message: 'User not found.' })
  return res.json({ user })
}

async function updateProfile(req, res) {
  const { name } = req.body || {}
  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: 'name is required.' })
  }
  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    { name: String(name).trim() },
    { new: true }
  )
    .select('name email createdAt')
    .lean()
  if (!user) return res.status(404).json({ message: 'User not found.' })
  return res.json({ user })
}

async function updateProfilePicture(req, res) {
  const { profilePicture } = req.body || {}
  if (!profilePicture || !String(profilePicture).startsWith('data:image')) {
    return res.status(400).json({ message: 'A valid image data URL is required.' })
  }
  // Limit size to ~500KB base64
  if (profilePicture.length > 700000) {
    return res.status(400).json({ message: 'Image is too large. Please use a smaller image.' })
  }
  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    { profilePicture },
    { new: true }
  ).select('name email profilePicture').lean()
  if (!user) return res.status(404).json({ message: 'User not found.' })
  return res.json({ user })
}

module.exports = { signup, login, me, updateProfile, updateProfilePicture }

