import jwt from 'jsonwebtoken'

export function protect(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: token missing.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret')
    req.user = decoded
    return next()
  } catch (_err) {
    return res.status(401).json({ message: 'Unauthorized: invalid token.' })
  }
}

