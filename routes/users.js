const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// user models
const user = require("../models/user")


// login page
router.get("/login",(req,res) => res.render("login"))

// Register page
router.get("/register",(req,res) => res.render("register"));

//  Register Handle
router.post("/register", (req, res) => {
   const {name, email, password, password2 } = req.body;
   let errors = [];

// check required fields

if(!name || !email || !password || !password2){
    errors.push({msg: "Please fill in all fields"});
}

// check passwords match
if(password !== password2){
    errors.push({msg : "Passwords do not match"});
}

//  check password length
if(password.length < 6) {
    errors.push({msg : "Password should be at least 6 charaters" });
}

if(errors.length > 0) {
   res.render("register", {
    errors,
    name,
    email,
    password,
    password2
   })
}else{
    // validation passed
   const newUser = new user({
    name,
    email,
    password
   });

//    hash password
    bcrypt.genSalt(10, (err,salt) => 
      bcrypt.hash(newUser.password,salt, (err, hash) => {
         if(err) throw err;
         //  set password to hashed
         newUser.password = hash;
          //  save user
         newUser.save()
            .then(() => {
                req.flash("success_msg", "You are now registered and can log in")
              res.redirect("/users/login") // Redirect to login page after sucessful registration 
            })
            .catch((err) => console.log(err));
        }))
}

});

//  Login Handle
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

// logout Handle
router.get("/logout", (req, res, next) => {
    // Logout logic
    req.logout((err) => {
     if(err) {return next(err);}
        req.flash("success_msg", "You are logged out");
        res.redirect("/users/login");
    });
});


module.exports = router;