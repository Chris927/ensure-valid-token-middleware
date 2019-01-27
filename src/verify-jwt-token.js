const { encode, decode } = require('base64-url')
const { createHmac } = require('crypto')

const jwtDecode = token => {
  const parts = token.split('.')
  if (!parts.length === 3) {
    throw new Error('Invalid token, expected 3 parts, separated by "."')
  }
  try {
    return {
      token,
      header: JSON.parse(decode(parts[0])),
      payload: JSON.parse(decode(parts[1])),
      signature: parts[2]
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error('Invalid token, unable to parse')
    }
    throw e
  }
}

const isSignatureValid = (decoded, secret) => {
  if (!decoded.header || !decoded.payload || !decoded.signature || !secret) {
    throw new Error('Invalid parameters trying to check signature')
  }
  const hmac = createHmac('sha256', secret)
  const encodedHeader = encode(JSON.stringify(decoded.header))
  const encodedPayload = encode(JSON.stringify(decoded.payload))
  hmac.update(encodedHeader + '.' + encodedPayload)
  const signature = encode(hmac.digest())
  return signature === decoded.signature
}

const isExpired = ({ payload, now = (new Date().getTime() / 1000) }) => {
  if (!payload.exp) {
    throw new Error('"exp" not found in payload')
  }
  return payload.exp < now
}

module.exports = {
  isSignatureValid,
  isExpired,
  decode: jwtDecode
}
