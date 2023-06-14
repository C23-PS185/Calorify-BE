# Calorify-BE

This repository contains the server-side code and database setup for the Calorify application.

## Table of Content

- [Introduction](#introduction)
- [Environment](#environment)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Running the server](#running-the-server)
- [API URL](#api-url)


## Introduction

Calorify is a personalized calorie tracking app aimed at promoting healthy eating habits and preventing non-communicable diseases (NCDs).

## Environment

Calorify Backend runs with :
  1. Express JS
  2. GCP App Engine
  3. Cloud Build
  4. Firebase Authentication, Firebase Storage, and Firestore Database
  5. Cloud Storage

## Configuration

You need these 2 files to run the server
- .env\
(You can get the key from Firebase Project Settings)
```env
FIREBASE_API_KEY=""
FIREBAE_AUTH_DOMAIN=""
FIREBASE_PROJECT_ID=""
FIREBASE_STORAGE_BUCKET=""
FIREBASE_MESSAGING_SENDER_ID=""
FIREBASE_APP_ID=""
FIREBASE_MEASUREMENT_ID=""
```

- serviceAccountKey.json\
(You can get the key from Firebase Project Settings -> Service accounts -> Firebase Admin SDK -> Generate Key)
```json
{
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": "",
  "universe_domain": ""
}
```

## Running the server
- Install required modules
```
npm run install
```
- Start the server
```
npm run start
```
## API Documentation 
https://documenter.getpostman.com/view/26324010/2s93saZsni#c17f004c-e341-44fc-abdd-1b809b4691ba

## API URL
https://backend-dot-calorify-app.et.r.appspot.com/api/
