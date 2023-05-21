const firebase = require('../config/firebase.js')
const db = firebase.firestore()

// register
exports.register = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({
      email: 'email is required',
      password: 'password is required'
    })
  }
  firebase
    .auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((data) => {
      return res.status(201).json(data)
    })
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
      if (errorCode === 'auth/weak-password') {
        return res.status(500).json({ error: errorMessage })
      } else {
        return res.status(500).json({ error: errorMessage })
      }
    })
}

// login
exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({
      email: 'email is required',
      password: 'password is required'
    })
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((user) => {
      return res.status(200).json(user)
    })
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
      if (errorCode === 'auth/wrong-password') {
        return res.status(500).json({ error: errorMessage })
      } else {
        return res.status(500).json({ error: errorMessage })
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
        return res.status(200).json({ user, status: 'Logout Successfully!' })
      })
      .catch(function (error) {
        const errorCode = error.code
        const errorMessage = error.message
        if (errorCode === 'auth/too-many-requests') {
          return res.status(500).json({ error: errorMessage })
        }
      })
  } else {
    return res.status(500).json({ error: 'User not found!' })
  }
}

// verify email
// this work after signup & signin
exports.verifyEmail = (req, res) => {
  firebase
    .auth()
    .currentUser.sendEmailVerification()
    .then(function () {
      return res.status(200).json({ status: 'Email Verification Sent!' })
    })
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
      if (errorCode === 'auth/too-many-requests') {
        return res.status(500).json({ error: errorMessage })
      }
    })
}

// forget password
exports.forgetPassword = (req, res) => {
  if (!req.body.email) {
    return res.status(422).json({ email: 'email is required' })
  }
  firebase
    .auth()
    .sendPasswordResetEmail(req.body.email)
    .then(function () {
      return res.status(200).json({ status: 'Password Reset Email Sent' })
    })
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
      if (errorCode === 'auth/invalid-email') {
        return res.status(500).json({ error: errorMessage })
      } else if (errorCode === 'auth/user-not-found') {
        return res.status(500).json({ error: errorMessage })
      }
    })
}

// User Information
exports.completeData = (req, res) => {
  const createdAt = new Date().toISOString()
  const { fullName, birthDate, gender, userWeight, userHeight } = req.body
  const userId = firebase.auth().currentUser.uid
  const email = firebase.auth().currentUser.email

  const userData = {
    userId,
    email,
    fullName,
    birthDate: new Date(birthDate),
    gender,
    userWeight,
    userHeight,
    createdAt
  }

  if (!fullName || !birthDate || !gender || !userWeight || !userHeight) {
    return res.status(400).json({ message: 'Wajib diisi' })
  }

  db.collection('users').add(userData)
    .then(() => {
      return res.status(200).json({ message: 'Informasi tambahan berhasil disimpan' })
    })
    .catch((e) => {
      return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan informasi tambahan' })
    })
}
