const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    profilePicture: { type: String, default: '' },   // base64 data URL
    savedSchemes: [
      {
        schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
        name: { type: String, required: true },
        benefits: { type: String, required: true },
        eligibility: { type: String, required: true },
        link: { type: String, required: true },
        savedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

UserSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)

