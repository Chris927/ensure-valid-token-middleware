const { ok } = require('assert')
const { decode, isExpired, isSignatureValid } = require('./verify-jwt-token')

const ensureValidToken = secret => (req, res, next) => {
  ok(secret, 'Secret not provided')
  const { authorization } = req.headers
  if (!authorization) {
    res.set('WWW-Authenticate', 'Bearer')
      .status(401).send('Authorization header not found')
    return
  }
  const match = authorization.match(/^Bearer (.+)$/)
  if (!match || !match[1]) {
    res.set('WWW-Authenticate', 'Bearer')
      .status(401).send('Invalid authorization, not a Bearer token')
    return
  }
  const token = match[1]
  let decoded
  try {
    decoded = decode(token)
  } catch (e) {
    res.set('WWW-Authenticate', 'Bearer error="invalid_token"')
      .status(401).send(e.message)
    return
  }

  if (isExpired(decoded)) {
    res.set('WWW-Authenticate', 'Bearer error="invalid_token"')
      .status(401).send('Token provided is expired')
    return
  }
  if (!isSignatureValid(decoded, secret)) {
    res.status(403).send('Invalid token signature')
    return
  }
  return next()
}

module.exports = {
  ensureValidToken
}
