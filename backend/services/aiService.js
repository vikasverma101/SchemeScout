import axios from 'axios'

export function buildRecommendationPayload({ user, schemes }) {
  const topSchemes = Array.isArray(schemes) ? schemes.slice(0, 3) : []
  const userName = user?.name || user?.fullName || 'the applicant'
  const income = user?.income != null ? Number(user.income) : null
  const category = user?.category || 'General'

  const summary = income != null && Number.isFinite(income)
    ? `${userName}, your profile suggests a strong chance of eligibility for schemes meant for ${category} applicants with income around ₹${Number(income).toLocaleString('en-IN')}.`
    : `${userName}, your profile suggests a strong chance of eligibility for relevant government schemes.`

  const recommendedSchemes = topSchemes.map((scheme, index) => {
    const name = scheme?.name || `Scheme ${index + 1}`
    const benefits = scheme?.benefits || 'Check the official scheme details for updated benefits.'
    const eligibility = scheme?.eligibility || 'Review the official eligibility rules before applying.'
    const priority = index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'
    const eligibilityStatus = index === 0 ? 'Likely Eligible' : 'Check Eligibility'

    return {
      name,
      whyRecommended: `Matches your profile and the scheme purpose closely. ${eligibility}`.slice(0, 140),
      benefits: benefits.slice(0, 140),
      eligibilityStatus,
      priority,
      documents: ['Aadhaar', 'Income proof', 'Caste/category proof if applicable'],
      nextSteps: ['Verify the official eligibility rules', 'Gather the required documents', 'Apply through the official portal'],
    }
  })

  return {
    summary: summary.slice(0, 180),
    recommendedSchemes,
    tips: [
      'Keep your documents ready before applying.',
      'Always check the latest official eligibility rules.',
    ],
  }
}

export function buildFallbackRecommendation({ user, schemes }) {
  return buildRecommendationPayload({ user, schemes })
}

export function normalizeAiJson(raw) {
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed) return null

  const cleaned = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1))
      } catch {
        return null
      }
    }
  }

  const lines = cleaned.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const sectionPattern = /^([⭐✔💰📄➡])\s*/
  const nameMatch = cleaned.match(/⭐\s*([^\n]+)/i)
  const priorityMatch = cleaned.match(/Priority:\s*(HIGH|MEDIUM|LOW)/i)
  const whyRecommendedMatch = cleaned.match(/✔\s*Why Recommended\s*([\s\S]*?)(?=\n(?:💰|📄|➡)|$)/i)
  const benefitsMatch = cleaned.match(/💰\s*Benefits\s*([\s\S]*?)(?=\n(?:📄|➡)|$)/i)
  const documentsMatch = cleaned.match(/📄\s*Documents\s*([\s\S]*?)(?=\n(?:➡)|$)/i)
  const nextStepMatch = cleaned.match(/➡\s*Next Step\s*([\s\S]*?)(?=$)/i)

  const documents = (documentsMatch?.[1] || '')
    .split(/\n/)
    .map((item) => item.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)

  const nextSteps = (nextStepMatch?.[1] || '')
    .split(/\n/)
    .map((item) => item.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)

  if (!nameMatch && !whyRecommendedMatch && !benefitsMatch) return null

  return {
    summary: `${nameMatch?.[1] || 'Recommended scheme'} is a strong match for your profile.`,
    recommendedSchemes: [
      {
        name: nameMatch?.[1]?.trim() || 'Recommended scheme',
        whyRecommended: whyRecommendedMatch?.[1]?.trim() || 'Matches your profile and current eligibility criteria.',
        benefits: benefitsMatch?.[1]?.trim() || 'Review the official scheme details.',
        eligibilityStatus: priorityMatch?.[1] ? (priorityMatch[1].toUpperCase() === 'HIGH' ? 'Likely Eligible' : 'Check Eligibility') : 'Likely Eligible',
        priority: priorityMatch?.[1] ? priorityMatch[1].charAt(0).toUpperCase() + priorityMatch[1].slice(1).toLowerCase() : 'High',
        documents: documents.length > 0 ? documents : ['Aadhaar', 'Income proof'],
        nextSteps: nextSteps.length > 0 ? nextSteps : ['Review the official eligibility rules', 'Apply through the official portal'],
      },
    ],
    tips: lines.filter((line) => !sectionPattern.test(line)).slice(0, 3),
  }
}

export async function getAIRecommendation({ user, schemes }) {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey || apiKey === 'your_key_here') {
    return JSON.stringify(buildFallbackRecommendation({ user, schemes }))
  }

  try {
    const mappedSchemes = Array.isArray(schemes)
      ? schemes.slice(0, 3).map((s) => ({
          name: s?.name,
          benefits: s?.benefits,
          eligibility: s?.eligibility,
        }))
      : []

    const promptText = `
You are an expert Government Scheme Advisor for India.
Return ONLY valid JSON using this exact structure:
{"summary":"...","recommendedSchemes":[{"name":"","whyRecommended":"","benefits":"","eligibilityStatus":"Eligible | Likely Eligible | Check Eligibility","priority":"High | Medium | Low","documents":[""],"nextSteps":[""]}],"tips":[""]}

Rules:
- Recommend only the top 3 most relevant schemes from the supplied data.
- Base recommendations only on the supplied schemes and the user profile.
- Never invent schemes.
- Keep explanations concise and professional.
- Use simple English suitable for Indian users.
- Keep the whole response under 300 words.
- Do not return plain text or numbered lists.

User: ${JSON.stringify(user ?? {})}
Schemes: ${JSON.stringify(mappedSchemes)}
`

    console.log('[AI Service] Fetching recommendation from OpenRouter...')

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: promptText.trim() }],
        temperature: 0.2,
        max_tokens: 220,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'SchemeScout',
        },
        timeout: 20000,
      }
    )

    const message = response?.data?.choices?.[0]?.message?.content

    console.log('[AI Service] Recommendation successfully received.')

    if (message && message.trim()) {
      const parsed = normalizeAiJson(message)
      if (parsed && typeof parsed === 'object') {
        return JSON.stringify(parsed)
      }
    }

    return JSON.stringify(buildFallbackRecommendation({ user, schemes }))
  } catch (error) {
    console.error('[AI Service Error]:', error?.response?.data || error?.message)
    return JSON.stringify(buildFallbackRecommendation({ user, schemes }))
  }
}
