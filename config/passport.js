const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// load user Model
const User = require("../models/user");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({usernameField: "email"}, (email,password,done) => {
        //    match User
        User.findOne({email: email})
         .then((user) => {
            if(!user) {
                return done(null, false, {message: "This email is not registered"});
            }
            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) =>{
                if (err) throw err;

                if(isMatch) {
                    return done(null, user);
                }else {
                    return done(null, false, {message: "Password Incorrect"})
                }
            })
        
         })
         .catch(err => console.log(err))
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
        });
      
        passport.deserializeUser(async (id, done) => {
           try{
            const foundUser = await User.findById(id);
            done(null, foundUser);
           }catch (error){
            done(error, null)
           }
            
     });


}