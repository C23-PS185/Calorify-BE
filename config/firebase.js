const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/firestore')
require('dotenv').config()
require('firebase/storage');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage();
const bucket = storage.ref();

module.exports = firebase
