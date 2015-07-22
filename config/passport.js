// http://passportjs.org/docs
// https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local

var LocalStrategy = require('passport-local').Strategy;
var user = require('../control/businessObject/UserBO.js');
var userDAO = require('../model/dao/UserDAO.js');

module.exports = function (passport) {

	// User login session handler
    passport.serializeUser(function (user, done) {
      var sessionUser = new user(user.__id, user.password, user.username)
      done(null, sessionUser);
  });

    passport.deserializeUser(function (sessionUser, done) {
      done(null, sessionUser);
  });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : '__id',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        process.nextTick(function() {

            user.checkExistingUser (email, function (err, existing) {
                if (err)
                    return done(err);

                if (existing)
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

                else {
                    var newUser = new user(email, password);
                    newUser.signUpUser(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            })  

        });

    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : '__id',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        process.nextTick(function() {

            // check for existing user with email, then proceed to email and password combination check
            // throw any errors and sign in if combination is valid
            user.checkExistingUser(email, function (err, valid) {
                // return errors if error occurred
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!valid) {
                    return done(null, false, req.flash('loginMessage', 'User does not exist.'));
                } 

                if (valid) {
                    user.validateUserLogin(email, password, function (err, valid) {

                        if (err)
                            return done(err);

                        if(!valid)
                            return done(null, false, req.flash('loginMessage', 'Invalid password. Please try again!'));

                        return done(null, user);

                    });
                    
                }

                
            });

        });

    }));

}