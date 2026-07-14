const express = require('express')
const { saveScheme, listSavedSchemes } = require('../controllers/savedSchemesController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, saveScheme)
router.get('/', protect, listSavedSchemes)

module.exports = router

