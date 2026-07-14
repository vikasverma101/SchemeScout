const express = require('express')
const { signup, login, me, updateProfile, updateProfilePicture } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', protect, me)
router.put('/profile', protect, updateProfile)
router.put('/profile-picture', protect, updateProfilePicture)

module.exports = router


