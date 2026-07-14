import express from 'express'
import { saveScheme, listSavedSchemes } from '../controllers/savedSchemesController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, saveScheme)
router.get('/', protect, listSavedSchemes)

export default router

