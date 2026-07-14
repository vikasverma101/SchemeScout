import express from 'express'
import { signup, login, me, updateProfile, updateProfilePicture } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', protect, me)
router.put('/profile', protect, updateProfile)
router.put('/profile-picture', protect, updateProfilePicture)

export default router


