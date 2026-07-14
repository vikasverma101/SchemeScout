const mongoose = require('mongoose')

const SchemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true }, // specific state or "All"
    type: {
      type: String,
      required: true,
      enum: ['education', 'jobs', 'agriculture'],
      default: 'education',
    },
    incomeLimit: { type: Number, required: true, min: 0 },
    benefits: { type: String, required: true, trim: true },
    eligibility: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Scheme', SchemeSchema)

