const express = require("express");
const router = express.Router();
const path = require("path");
const ExpressError = require("../utils/ExpressError");
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

//signup 


router.route("/signUp")
.get( userController.RenderSignUp)
.post(wrapAsync(userController.signUp));


//login Form Render


router.route("/login")
.get(userController.renderloginForm)
.post(saveRedirectUrl,
    passport.authenticate("local", { 
    failureRedirect:'/login',
    failureFlash: true 
}), userController.login
);


//logout
router.get("/logout",userController.logout);

module.exports = router;