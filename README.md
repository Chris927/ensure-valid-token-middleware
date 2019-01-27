# Simple JWT Token Middleware

This package implements [ExpressJS](https://expressjs.com/) middleware to
validate the [JWT](https://jwt.io/) token given in the `Authorization` header:

- Ensure it is not expired
- Ensure its signature is valid


# How to Use

## Prerequisites

- You have an ExpressJS app (or KoaJS app with `k2c` connector)
- You know the secret (to validate tokens)
  
## Installation

```
npm install ensure-valid-token-middleware
```

## Usage

```
import { ensureValidToken } from 'ensure-valid-token-middleware'

const secret = 'my-secret'

app.get('/protected-things/:id', ensureValidToken(secret), (req, res) => {
    res.send('Not much here, but you have a valid token')
})
```

# Sample

Run the sample, note the hard coded secret (don't hard code secrets, this is
    just for demo purposes):

```
node sample
```

Try it with a valid token:

```
curl -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4OTM0NTYwMDB9.qZwPGjUFZrnASQUwkIr6mremMqIScaTe8svva7SwFLA' localhost:3000/protected
```

