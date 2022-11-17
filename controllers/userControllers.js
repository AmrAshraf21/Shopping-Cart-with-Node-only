const express = require("express");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.getRegister = (req, res, next) => {
  res.render("register", {
    title: "Register",
  });
};
exports.postRegister = (req, res, next) => {
  const { name, email, username, password, password2 } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("register", {
      title: "Register",
      errors: errors,
      user:null,
      errorMessage: errors.array()[0].msg,
    });
  }
  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        req.flash("danger", "Username exists , choose another");
        return res.redirect("/users/registers");
      }
      let newUser;
      bcrypt.hash(password, 12).then((hashedPw) => {
        newUser = new User({
          name: name,
          email: email,
          username: username,
          password: hashedPw,
          admin: 0,
        });
        return newUser.save();
      })
      .then((savedUser) => {
          req.flash("success", "You are now registered");
          return res.redirect("/users/login");

    })
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.getLogin = (req,res,next)=>{
    if(res.locals.user) res.redirect('/');

    res.render('login',{
        title:"Login"
    })
}
exports.postLogin = (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);


}

exports.getLogout = (req,res,next)=>{
    req.logout(function(err){
        if(err) return next(err);
        req.flash('success',"You are logout");
        return res.redirect('/users/login')
    })
   

}