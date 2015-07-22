// http://passportjs.org/docs
// https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local

var LocalStrategy = require('passport-local').Strategy;
var UserBO = require('../control/bussinessObject/UserBO.js');

module.exports = function (passport) {

    // User login session handler
    passport.serializeUser(function (user, done) {
      var sessionUser = new UserBO(user.__id, user.password)
      done(null, sessionUser);
  });

    passport.deserializeUser(function (sessionUser, done) {
      done(null, sessionUser);
  });

    //WARNING: SIGNUP PART NEEDS FIXING
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    function(email, password, done) {

        process.nextTick(function() {

            User.validateId (email, function (err, existing) {
                if (err) {
                    return done(err);
                }

                if (existing)
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

                else {
                    var newUser = new User(email, password);
                    newUser.save(function (err) {
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
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // check if user exists, then the user password combination validity
        // pass any error messages to flash module
        UserBO.validateId(email, function (err, user) {
            if (err) {
                return done(err);
            }                 
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            UserBO.validateIdPw(email, password, function (err, valid) {
                if (err) {
                    return done(err);
                }
                if (!valid) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                return done(null, user);
            })
        })
    }));

}
