const express = require('express')
const { postSchemes } = require('../controllers/schemesController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, postSchemes)

module.exports = router

