import express from 'express'
import { postSchemes } from '../controllers/schemesController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, postSchemes)

export default router

