import Scheme from '../models/Scheme.js'
import { getAIRecommendation } from '../services/aiService.js'
import { getGeminiSchemes } from '../services/geminiSchemesService.js'

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : NaN
}

export async function postSchemes(req, res) {
  const { category, state, income, type, age, occupation, gender } = req.body || {}

  if (!category || !state || income === undefined || income === null) {
    return res.status(400).json({
      message: 'category, state, and income are required.',
    })
  }

  const incomeNum = toNumber(income)
  if (!Number.isFinite(incomeNum) || incomeNum < 0) {
    return res.status(400).json({ message: 'income must be a valid number.' })
  }

  let schemes = []
  let schemeSource = 'gemini'

  try {
    console.log('[SchemeScout] Fetching real-time schemes from Gemini...')
    schemes = await getGeminiSchemes({ category, state, income: incomeNum, age, occupation, gender, type })
    console.log(`[SchemeScout] Gemini returned ${schemes.length} schemes.`)
  } catch (geminiErr) {
    console.warn('[SchemeScout] Gemini fetch failed, falling back to DB:', geminiErr.message)
    schemeSource = 'database'

    const query = { incomeLimit: { $gte: incomeNum } }
    if (category && category !== 'All') query.category = { $in: [category, 'All'] }
    if (state && state !== 'All') query.state = { $in: [state, 'All'] }
    if (type && type !== 'all') query.type = type

    schemes = await Scheme.find(query)
      .sort({ incomeLimit: 1, createdAt: -1 })
      .select('name benefits eligibility link category state type incomeLimit')
      .lean()
  }

  let aiRecommendation = {
    summary: 'Showing best schemes based on your eligibility',
    recommendedSchemes: [],
    tips: [],
  }
  try {
    const rawAi = await getAIRecommendation({ user: req.body || {}, schemes })
    if (typeof rawAi === 'string') {
      try {
        aiRecommendation = JSON.parse(rawAi)
      } catch {
        aiRecommendation = { summary: rawAi, recommendedSchemes: [], tips: [] }
      }
    } else if (rawAi && typeof rawAi === 'object') {
      aiRecommendation = rawAi
    }
  } catch (err) {
    console.error('[AI Recommendation Error]:', err.message)
  }

  return res.json({
    schemes,
    aiRecommendation,
    schemeSource,
    lastUpdated: new Date().toISOString(),
  })
}
