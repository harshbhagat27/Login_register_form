const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");


const app = express();

// DB config in localhost 27017
require("./config/keys")
const passportConfig = require('./config/passport');


// EJS
app.use(expressLayouts);


app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use the Passport configuration
passportConfig(passport);

// connect flash
app.use(flash());

// Global vars
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");

   next();
});

// Router
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const POST = process.env.PORT || 5000;

app.listen(POST, console.log(`Server started on port ${POST}`));