const express = require('express')
const router = express.Router()

const {
  register,
  login,
  forgetPassword,
  logout,
  completeData,
  verifyEmail
} = require('./auth')

router.post('/register', register)

router.post('/login', login)

router.post('/forget-password', forgetPassword)

router.post('/logout', logout)

router.post('/complete-data', completeData)

router.post('/verifyemail', verifyEmail)

module.exports = router
