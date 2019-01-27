const express = require('express')
const { ensureValidToken } = require('../src')

const app = express()
const port = process.env.PORT || 3000

const secret = 'd927aa27a08ebbbe369c22e7a860891b3b66d1a790a59568'

app.get('/protected', ensureValidToken(secret), (req, res) => {
  res.send('You have a valid token, now I can share protected stuff with you.')
})

app.listen(port, () => console.log(`Listening on port ${port}`))
