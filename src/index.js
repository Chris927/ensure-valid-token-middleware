const { ok } = require('assert')
const { decode, isExpired, isSignatureValid } = require('./verify-jwt-token')

const ensureValidToken = secret => (req, res, next) => {
  ok(secret, 'Secret not provided')
  const { authorization } = req.headers
  if (!authorization) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Bearer'
    })
    res.end('Authorization header not found')
    return
  }
  const match = authorization.match(/^Bearer (.+)$/)
  if (!match || !match[1]) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Bearer'
    })
    res.end('Invalid authorization, not a Bearer token')
    return
  }
  const token = match[1]
  let decoded
  try {
    decoded = decode(token)
  } catch (e) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Bearer error="invalid_token"'
    })
    res.end(e.message)
    return
  }

  if (isExpired(decoded)) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Bearer error="invalid_token"'
    })
    res.end('Token provided is expired')
    return
  }
  if (!isSignatureValid(decoded, secret)) {
    res.writeHead(403, {})
    res.end('Invalid token signature')
    return
  }
  return next()
}

module.exports = {
  ensureValidToken
}
