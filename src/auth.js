/* eslint-disable no-case-declarations */
const firebase = require('../config/firebase.js')
const db = firebase.firestore()

// register
exports.register = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({
      error: true,
      message: 'Email and password is required'
    })
  }

  if (req.body.passwordConfirmation !== req.body.password) {
    return res.status(400).json({
      error: true,
      message: 'Password didnt match'
    })
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((data) => {
      return res.status(201).json({
        error: false,
        message: 'User created',
        data
      })
    })
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
      if (errorCode === 'auth/weak-password') {
        return res.status(500).json({
          error: true,
          message: errorMessage
        })
      } else {
        return res.status(500).json({
          error: true,
          message: errorMessage
        })
      }
    })
}

// login
exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({
      error: true,
      message: 'Email and password is required'
    })
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((user) => {
      return res.status(200).json({
        error: false,
        message: 'User logged in',
        user
      })
    })
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
      if (errorCode === 'auth/weak-password') {
        return res.status(500).json({
          error: true,
          message: errorMessage
        })
      } else {
        return res.status(500).json({
          error: true,
          message: errorMessage
        })
      }
    })
}

// logout
exports.logout = (req, res) => {
  const user = firebase.auth().currentUser

  if (user) {
    firebase
      .auth()
      .signOut()
      .then((user) => {
        return res.status(200).json({
          error: false,
          message: 'Logout Successfully!',
          user
        })
      })
      .catch(function (error) {
        const errorCode = error.code
        const errorMessage = error.message
        if (errorCode === 'auth/too-many-requests') {
          return res.status(500).json({
            error: true,
            message: errorMessage
          })
        }
      })
  } else {
    return res.status(500).json({
      error: true,
      message: 'User not found!'
    })
  }
}

// verify email
// this work after signup & signin
exports.verifyEmail = (req, res) => {
  firebase
    .auth()
    .currentUser.sendEmailVerification()
    .then(function () {
      return res.status(200).json({
        error: false,
        message: 'Email verification has been sent!'
      })
    })
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
      if (errorCode === 'auth/too-many-requests') {
        return res.status(500).json({
          error: true,
          message: errorMessage
        })
      }
    })
}

// forget password
exports.forgetPassword = (req, res) => {
  if (!req.body.email) {
    return res.status(422).json({
      error: true,
      message: 'Email is required'
    })
  }
  firebase
    .auth()
    .sendPasswordResetEmail(req.body.email)
    .then(function () {
      return res.status(200).json({
        error: false,
        message: 'Password reset email has been sent!'
      })
    })
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
      if (errorCode === 'auth/invalid-email') {
        return res.status(500).json({
          error: true,
          message: errorMessage
        })
      } else if (errorCode === 'auth/user-not-found') {
        return res.status(500).json({
          error: true,
          message: errorMessage
        })
      }
    })
}

// User Information
exports.addUserData = (req, res) => {
  const createdAt = new Date().toISOString()

  const birthDateParts = req.body.birthDate.split('-')

  const day = birthDateParts[0].padStart(2, '0')
  const month = birthDateParts[1].padStart(2, '0')
  const year = birthDateParts[2]

  const birthDate = new Date(`${month}-${day}-${year}`)
  const formattedBirthDate = `${birthDate.getDate().toString()}-${(birthDate.getMonth() + 1).toString()}-${birthDate.getFullYear().toString()}`

  const userId = req.body.userId

  // Get user age
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  // Calorie calculation
  const maleBMR = 66 + (13.7 * req.body.userWeight) + (5 * req.body.userHeight) - (6.8 * age)
  const femaleBMR = 655 + (9.6 * req.body.userWeight) + (1.8 * req.body.userHeight) - (4.7 * age)

  // BMI calculation
  const heightInMeters = req.body.userHeight / 100
  const userBMI = Math.round(req.body.userWeight / (heightInMeters ** 2))

  // Get activity value
  let activityValue = 0

  switch (req.body.activityLevel) {
    case 0:
      activityValue = 1.1
      break
    case 1:
      activityValue = 1.2
      break
    case 2:
      activityValue = 1.3
      break
    default:
      activityValue = 1.1
      break
  }

  // Get stress value
  let stressValue = 0
  switch (req.body.stressLevel) {
    case 0:
      stressValue = 1.1
      break
    case 1:
      stressValue = 1.3
      break
    case 2:
      stressValue = 1.45
      break
    case 3:
      stressValue = 1.55
      break
    case 4:
      stressValue = 1.7
      break
    default:
      stressValue = 1.1
      break
  }

  // Calorie intake calculation
  let calorieIntake = 0
  switch (req.body.gender) {
    case 'Laki-Laki':
      calorieIntake = maleBMR * activityValue * stressValue
      break
    case 'Perempuan':
      calorieIntake = femaleBMR * activityValue * stressValue
      break
    default:
      calorieIntake = maleBMR * activityValue * stressValue
      break
  }

  // Set user calorie intake based on weightGoal
  switch (req.body.weightGoal) {
    case 0:
      calorieIntake = Math.round(calorieIntake * 0.6)
      break
    case 1:
      calorieIntake = Math.round(calorieIntake * 0.8)
      break
    case 2:
      calorieIntake = Math.round(calorieIntake)
      break
    case 3:
      calorieIntake = Math.round(calorieIntake * 1.2)
      break
    case 4:
      calorieIntake = Math.round(calorieIntake * 1.4)
      break
    default:
      calorieIntake = Math.round(calorieIntake)
      break
  }

  const userData = {
    createdAt,
    fullName: req.body.fullName,
    birthDate: formattedBirthDate,
    gender: req.body.gender,
    userWeight: req.body.userWeight,
    userHeight: req.body.userHeight,
    weightGoal: req.body.weightGoal,
    userCalorieIntake: calorieIntake,
    userBMI
  }

  if (!req.body.fullName || !req.body.birthDate || !req.body.gender || !req.body.userWeight || !req.body.userHeight || req.body.activityLevel === undefined || req.body.stressLevel === undefined || req.body.weightGoal === undefined) {
    return res.status(400).json({
      error: true,
      message: 'Required.'
    })
  }

  const docRef = db.collection('users').doc(userId)

  docRef.get().then(() => {
    docRef.set(userData)
      .then(() => {
        return res.status(200).json({
          error: false,
          message: 'Information saved successfully!'
        })
      })
      .catch((e) => {
        return res.status(500).json({
          error: true,
          message: e
        })
      })
  })
}

exports.getUserData = async (req, res) => {
  const { userId } = req.params

  const docRef = db.collection('users').doc(userId)
  const doc = await docRef.get()

  if (!doc.exists) {
    return res.status(500).json({
      error: true,
      message: 'Data is not exists'
    })
  }

  return res.status(200).json({
    error: false,
    data: doc.data()
  })
}

// Add calorie log to the database
exports.addCalorieLog = (req, res) => {
  const today = new Date()

  function padTo2Digits (num) {
    return num.toString().padStart(2, '0')
  }

  const year = today.getFullYear()
  const month = padTo2Digits(today.getMonth() + 1)
  const date = padTo2Digits(today.getDate())

  const createdAt = `${date}-${month}-${year}`

  const { userId } = req.params

  const docRef = db.collection('calorie-log').doc(userId)
  const yearCollection = docRef.collection('foodCollection').doc(`${year}`)

  docRef.get().then((doc) => {
    const calorieLogData = {}

    switch (req.body.mealTime) {
      case 0:
        calorieLogData.breakfast = firebase.firestore.FieldValue.arrayUnion({
          foodName: req.body.foodName,
          fnbType: req.body.fnbType,
          foodCalories: req.body.foodCalories,
          createdAt
        })
        break
      case 1:
        calorieLogData.lunch = firebase.firestore.FieldValue.arrayUnion({
          foodName: req.body.foodName,
          fnbType: req.body.fnbType,
          foodCalories: req.body.foodCalories,
          createdAt
        })
        break
      case 2:
        calorieLogData.dinner = firebase.firestore.FieldValue.arrayUnion({
          foodName: req.body.foodName,
          fnbType: req.body.fnbType,
          foodCalories: req.body.foodCalories,
          createdAt
        })
        break
      case 3:
        calorieLogData.others = firebase.firestore.FieldValue.arrayUnion({
          foodName: req.body.foodName,
          fnbType: req.body.fnbType,
          foodCalories: req.body.foodCalories,
          createdAt
        })
        break
      default:
        calorieLogData.others = firebase.firestore.FieldValue.arrayUnion({
          foodName: req.body.foodName,
          fnbType: req.body.fnbType,
          foodCalories: req.body.foodCalories,
          createdAt
        })
    }

    const logCollection = yearCollection.collection(`${month}`).doc(`${date}`)

    if (!req.body.foodName || !req.body.foodCalories || !req.body.fnbType || req.body.mealTime === undefined) {
      return res.status(400).json({
        error: true,
        message: 'Required.'
      })
    }

    logCollection.set(calorieLogData, { merge: true })
      .then(() => {
        let totalCalories = 0
        Object.values(calorieLogData).forEach((meal) => {
          meal.forEach((food) => {
            totalCalories += food.foodCalories
          })
        })
        console.log(totalCalories)
        return res.status(200).json({
          error: false,
          message: 'Information saved successfully!',
          totalCalories
        })
      })
      .catch((e) => {
        return res.status(500).json({
          error: true,
          message: e
        })
      })
  })
}

// Get Daily Calorie Log
exports.getDailyCalorieLog = async (req, res) => {
  const { userId, date, month, year } = req.params

  const docRef = db.collection('calorie-log').doc(userId)
  const yearCollection = docRef.collection('foodCollection').doc(`${year}`)
  const logCollection = yearCollection.collection(`${month}`).doc(`${date}`)

  const doc = await logCollection.get()
  if (!doc.exists) {
    return res.status(500).json({
      error: true,
      message: 'Data is not exists'
    })
  }
  return res.status(200).json({
    error: false,
    data: doc.data()
  })
}

// Get Monthly Calorie Log
exports.getMonthlyCalorieLog = async (req, res) => {
  const { userId, month, year } = req.params

  const docRef = db.collection('calorie-log').doc(userId)
  const yearCollection = docRef.collection('foodCollection').doc(`${year}`)
  const logCollection = yearCollection.collection(`${month}`)
  try {
    const querySnapshot = await logCollection.get()
    const monthlyLog = []

    querySnapshot.forEach((doc) => {
      monthlyLog.push({
        id: doc.id,
        data: doc.data()
      })
    })
    return res.status(200).json(monthlyLog)
  } catch (e) {
    return res.status(500).json({
      error: true,
      message: 'data is not exist'
    })
  }
}

// Get Food Data
exports.getFoodData = async (req, res) => {
  const { foodName } = req.params

  const docRef = db.collection('food-calories').doc(foodName)
  try {
    const doc = await docRef.get()
    if (!doc.exists) {
      return res.status(500).json({
        error: true,
        message: 'Data does not exist'
      })
    }
    return res.status(200).json({
      error: false,
      data: doc.data()
    })
  } catch (e) {
    return res.status(500).json({
      error: true,
      message: 'Server error'
    })
  }
}

// Get All Foods Data
exports.getAllFoodsData = async (req, res) => {
  const foods = []
  const foodsRef = db.collection('food-calories')
  const snapshot = await foodsRef.get()
  snapshot.forEach(doc => {
    foods.push({
      name: doc.id,
      data: doc.data()
    })
  })
  return res.status(200).json({
    error: false,
    data: foods
  })
}
