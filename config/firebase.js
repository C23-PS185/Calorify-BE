const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/firestore')
require('dotenv').config()

const firebaseConfig = {
  apiKey: 'AIzaSyB0RGz3RUyRhK6dUX7RmN8N4lAPh6RnmJU',
  authDomain: 'try-signup.firebaseapp.com',
  projectId: 'try-signup',
  storageBucket: 'try-signup.appspot.com',
  messagingSenderId: '741807009738',
  appId: '1:741807009738:web:4c1f8a807803a404c6a933',
  measurementId: 'G-MBS2HYCC7E'
}

firebase.initializeApp(firebaseConfig)

module.exports = firebase
