const express = require('express')
const cors = require('cors')
const app = express()

// Routes
const authRoutes = require('./routes.js')

// Middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use('/api', authRoutes)

// PORT
const port = 3000

// Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`)
})
