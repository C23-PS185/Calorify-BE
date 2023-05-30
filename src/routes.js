const express = require('express')
const router = express.Router()

const {
  register,
  login,
  forgetPassword,
  logout,
  addUserData,
  verifyEmail,
  getUserData,
  addCalorieLog
} = require('./auth')

router.post('/register', register)

router.post('/verifyemail', verifyEmail)

router.post('/login', login)

router.post('/forget-password', forgetPassword)

router.post('/logout', logout)

router.post('/add-user-data', addUserData)

router.get('/user-data/:userId', getUserData)

router.post('/add-calorielog', addCalorieLog)

module.exports = router
