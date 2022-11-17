const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "No user found" });
          }
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Wrong password found" });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user,err) => {
        done(err,user);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
