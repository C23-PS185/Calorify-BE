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
  const birthDate = new Date(req.body.birthDate)
  const userId = firebase.auth().currentUser.uid
  const email = firebase.auth().currentUser.email

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
    userId,
    email,
    createdAt,
    fullName: req.body.fullName,
    birthDate,
    gender: req.body.gender,
    userWeight: req.body.userWeight,
    userHeight: req.body.userHeight,
    weightGoal: req.body.weightGoal,
    userCalorieIntake: calorieIntake,
    userBMI
  }

  if (!req.body.fullName || !req.body.birthDate || !req.body.gender || !req.body.userWeight || !req.body.userHeight || req.body.activityLevel < 0 || req.body.stressLevel < 0 || req.body.weightGoal < 0) {
    return res.status(400).json({
      error: true,
      message: 'Required.'
    })
  }

  const docRef = db.collection('users').doc(userId)

  docRef.get().then((doc) => {
    if (doc.exists) {
      return res.status(400).json({
        error: true,
        message: 'User data already exist'
      })
    }

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

exports.getSelfAsessmentResult = (req, res) => {
  const userId = firebase.auth().currentUser.uid
  db.collection('users').where('userId', '==', userId).get()
    .then((data) => {
      // const selfAssessmentData = []

      // data.forEach((doc) => {
      //   selfAssessmentData.push({
      //     userWeight: doc.data().userWeight,
      //     userHeight: doc.data().userHeight,
      //     userBMI: doc.data().userBMI,
      //     weightGoal: doc.data().weightGoal,
      //     userCalorieIntake: doc.data().userCalorieIntake
      //   })
      // })
      console.log(data)
      return res.status(200).json({
        error: false,
        data: {
          userWeight: data.userWeight,
          userHeight: data.userHeight,
          userBMI: data.userBMI,
          weightGoal: data.weightGoal,
          userCalorieIntake: data.userCalorieIntake
        }
      })
    }).catch((e) => {
      return res.status(500).json({
        error: true,
        message: e
      })
    })
}
