# Calorify-BE

This repository contains the server-side code and database setup for the Calorify application.

## Table of Content

- [Introduction](#introduction)
- [Environment](#environment)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
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

To store the .env and serviceAccountKey.json files, which are secret files used in the deployment process, we store them in Google Cloud Storage and ensure proper access control and encryption measures are in place to maintain their security.

## API Documentation 
https://documenter.getpostman.com/view/26324010/2s93saZsni#c17f004c-e341-44fc-abdd-1b809b4691ba

## API URL
https://backend-dot-calorify-app.et.r.appspot.com/api/
