const assert = require('assert')
const { buildRecommendationPayload, normalizeAiJson } = require('../services/aiService')

const sampleSchemes = [
  {
    name: 'Pradhan Mantri Awas Yojana',
    benefits: 'Housing support for eligible families.',
    eligibility: 'Open to low-income households.',
  },
  {
    name: 'PM-Kisan Samman Nidhi',
    benefits: 'Income support for small farmers.',
    eligibility: 'For farmer families meeting income criteria.',
  },
]

const payload = buildRecommendationPayload({ user: { age: 32, category: 'SC', income: 200000 }, schemes: sampleSchemes })

assert.ok(payload.summary.includes('eligibility'))
assert.strictEqual(payload.recommendedSchemes.length, 2)
assert.strictEqual(payload.recommendedSchemes[0].name, 'Pradhan Mantri Awas Yojana')
assert.ok(Array.isArray(payload.tips))

const plainTextResponse = `🤖 AI Recommendation

──────────────────────────
⭐ PM Scholarship Scheme
Priority: HIGH

✔ Why Recommended
Income is below ₹2.5 lakh and you are a student.

💰 Benefits
Financial assistance for higher education.

📄 Documents
• Aadhaar
• Income Certificate
• Bank Passbook

➡ Next Step
Apply through the National Scholarship Portal.
──────────────────────────`

const parsed = normalizeAiJson(plainTextResponse)
assert.ok(parsed)
assert.strictEqual(parsed.recommendedSchemes[0].name, 'PM Scholarship Scheme')
assert.ok(parsed.recommendedSchemes[0].whyRecommended.includes('Income'))
assert.ok(parsed.recommendedSchemes[0].documents.includes('Aadhaar'))
assert.ok(parsed.recommendedSchemes[0].nextSteps.includes('Apply through the National Scholarship Portal.'))
console.log('aiService test passed')
