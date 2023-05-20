const express = require('express')
const router = express.Router()

const {
  register,
  login,
  forgetPassword,
  logout,
  completeData
} = require('./auth')

router.post('/register', register)

router.post('/login', login)

router.post('/forget-password', forgetPassword)

router.post('/logout', logout)

router.post('/complete-data', completeData)

module.exports = router
