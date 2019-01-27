const { decode, isExpired, isSignatureValid } = require('./verify-jwt-token')

const ensureValidToken = secret => (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return next(new Error('Authorization header not found'))
  }
  const match = authorization.match(/^Bearer (.+)$/)
  if (!match || !match[1]) {
    return next(new Error('Invalid authorization, not a Bearer token'))
  }
  const token = match[1]
  const decoded = decode(token)
  if (isExpired(decoded)) {
    throw new Error('Token provided is expired')
  }
  if (!isSignatureValid(decoded, secret)) {
    throw new Error('Invalid token signature')
  }
  return next()
}

module.exports = {
  ensureValidToken
}
