const express = require('express')
const router = express.Router()

const {
  register,
  login,
  forgetPassword,
  logout,
  addUserData,
  verifyEmail,
  getUserData
} = require('./auth')

router.post('/register', register)

router.post('/login', login)

router.post('/forget-password', forgetPassword)

router.post('/logout', logout)

router.post('/add-user-data', addUserData)

router.get('/user-data', getUserData)

router.post('/verifyemail', verifyEmail)

module.exports = router
