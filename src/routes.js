const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgetPassword,
  logout,
} = require("./auth");



router.post("/register", register);

router.post("/login", login);

router.post("/forget-password", forgetPassword);

router.post("/logout", logout);



module.exports = router;