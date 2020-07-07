//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
//const session = require('express-session');
//const passport = require("passport");
//const passportLocalMongoose = require("passport-local-mongoose");
//const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const findOrCreate = require('mongoose-findorcreate');

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

/*app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));*/

//app.use(passport.initialize());
//app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true, useNewUrlParser: true});
//mongoose.connect('mongodb+srv://manivannan:puppy@2019@contactkeeper-baa0z.mongodb.net/todolistDB',{useUnifiedTopology: true, useNewUrlParser: true})

//mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
  //googleId: String,
  //secret: String
});

//const secret = "thisisourlittlesecret.";

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

//userSchema.plugin(passportLocalMongoose);
//userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

//passport.use(User.createStrategy());

/*passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});*/

/*passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));*/

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password:req.body.password
  })
  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets")
    }
  })
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      } else {
        console.log("User not found!");
      }
    }
  })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
//app.listen(port);

app.listen(port, function(){
  console.log("Server started on port %d in %s mode", this.address().port, app.settings.env);
})
