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
  addCalorieLog,
  getDailyCalorieLog,
  getMonthlyCalorieLog,
  getAllFoodsData,
  getFoodData
} = require('./auth')

router.post('/register', register)

router.post('/verifyemail', verifyEmail)

router.post('/login', login)

router.post('/forget-password', forgetPassword)

router.post('/logout', logout)

router.post('/add-user-data', addUserData)

router.get('/user-data/:userId', getUserData)

router.post('/calorielog/:userId', addCalorieLog)

router.get('/daily-calorielog/:userId/:date-:month-:year', getDailyCalorieLog)

router.get('/monthly-calorielog/:userId/:month-:year', getMonthlyCalorieLog)

router.get('/foods', getAllFoodsData)

router.get('/foods/:foodName', getFoodData)

module.exports = router
