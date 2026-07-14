import Scheme from '../models/Scheme.js'
import User from '../models/User.js'

export async function saveScheme(req, res) {
  const { schemeId } = req.body || {}
  const userId = req.user?.userId

  if (!schemeId) {
    return res.status(400).json({ message: 'schemeId is required.' })
  }

  const scheme = await Scheme.findById(schemeId)
    .select('name benefits eligibility link')
    .lean()
  if (!scheme) {
    return res.status(404).json({ message: 'Scheme not found.' })
  }

  const user = await User.findById(userId)
  if (!user) {
    return res.status(401).json({ message: 'User not found.' })
  }

  const alreadySaved = user.savedSchemes?.some(
    (s) => s.schemeId.toString() === schemeId.toString()
  )
  if (alreadySaved) {
    return res.status(200).json({ message: 'Scheme already saved.' })
  }

  user.savedSchemes.push({
    schemeId,
    name: scheme.name,
    benefits: scheme.benefits,
    eligibility: scheme.eligibility,
    link: scheme.link,
  })

  await user.save()

  return res.status(201).json({ message: 'Scheme saved.' })
}

export async function listSavedSchemes(req, res) {
  const userId = req.user?.userId
  const user = await User.findById(userId).select('savedSchemes').lean()
  if (!user) {
    return res.status(401).json({ message: 'User not found.' })
  }

  return res.json({ savedSchemes: user.savedSchemes ?? [] })
}

