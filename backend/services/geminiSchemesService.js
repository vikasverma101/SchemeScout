import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Fetch real-time Indian government schemes from Gemini AI
 * based on the user's profile.
 */
export async function getGeminiSchemes({ category, state, income, age, occupation, gender, type }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in .env')

  const genAI = new GoogleGenerativeAI(apiKey)

  const modelCandidates = [
    process.env.GEMINI_MODEL,
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
  ].filter(Boolean)

  const stateLabel  = state    && state    !== 'All' ? state    : 'all states of India'
  const catLabel    = category && category !== 'All' ? category : 'all categories'
  const typeLabel   = type     && type     !== 'all' ? type     : 'both central and state'
  const incomeLabel = income   !== undefined         ? `₹${Number(income).toLocaleString('en-IN')} per year` : 'any income'

  const prompt = `
You are an expert on Indian government welfare schemes.

A citizen has the following profile:
- State: ${stateLabel}
- Category / Sector of interest: ${catLabel}
- Annual family income: ${incomeLabel}
- Age: ${age || 'not specified'}
- Gender: ${gender || 'not specified'}
- Occupation: ${occupation || 'not specified'}
- Scheme type preferred: ${typeLabel}

Task: Return a JSON array of 10 to 15 REAL, currently active Indian government schemes that this citizen is likely eligible for. Use only schemes that actually exist on official government portals (india.gov.in, myscheme.gov.in, etc.).

Each item in the array MUST have these exact fields:
{
  "name":        "<full official scheme name>",
  "category":    "<one of: Agriculture, Education, Health, Housing, Employment, Social Welfare, Women & Child, Finance, Skill Development, Digital India>",
  "state":       "<state name if state-specific, or 'All' if central/national>",
  "type":        "<'central' or 'state'>",
  "benefits":    "<2-3 sentence summary of what benefits the scheme provides>",
  "eligibility": "<2-3 sentence summary of who is eligible>",
  "incomeLimit": <maximum annual income in rupees as a plain number, use 9999999 if no income limit>,
  "link":        "<real official URL from india.gov.in, myscheme.gov.in, or the specific ministry website>"
}

Rules:
1. Return ONLY a valid JSON array. No markdown, no code fences, no explanation text before or after.
2. Do NOT invent schemes. Only include real schemes that a user can verify at the given link.
3. Prioritise schemes the user is most likely to benefit from given the profile above.
4. Make sure at least 3 schemes match the stated category if it is not 'all categories'.
5. Include a mix of central and state schemes where applicable.
`

  let lastErr = null
  for (const modelName of modelCandidates) {
    try {
      const model  = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const raw    = result?.response?.text?.() ?? ''

      // Strip any accidental markdown fences
      const cleaned = raw
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim()

      // Validate it is actually a JSON array
      const schemes = JSON.parse(cleaned)
      if (!Array.isArray(schemes) || schemes.length === 0) {
        throw new Error('Gemini returned an empty or non-array response')
      }

      // Normalise fields so they always conform to what the frontend expects
      return schemes.map(s => ({
        name:        String(s.name        || 'Unknown Scheme'),
        category:    String(s.category    || category || 'General'),
        state:       String(s.state       || 'All'),
        type:        String(s.type        || 'central'),
        benefits:    String(s.benefits    || ''),
        eligibility: String(s.eligibility || ''),
        incomeLimit: Number(s.incomeLimit) || 9999999,
        link:        String(s.link        || 'https://www.myscheme.gov.in'),
        _id:         `gemini-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        source:      'gemini-live',
      }))
    } catch (err) {
      lastErr = err
      const msg = String(err?.message || '')
      if (
        msg.includes('not found') ||
        msg.includes('404') ||
        msg.includes('429') ||
        msg.includes('quota') ||
        msg.includes('Too Many Requests')
      ) {
        continue // try next model candidate
      }
      break
    }
  }

  throw lastErr || new Error('Gemini scheme fetch failed for all model candidates')
}
