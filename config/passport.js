// http://passportjs.org/docs
// https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local\
// https://github.com/jaredhanson/passport-local/blob/master/examples/express3/app.js

var LocalStrategy = require('passport-local').Strategy;
var UserBO = require('./../control/businessObject/UserBO.js');

module.exports = function (passport) {

    // User login session handler
    passport.serializeUser(function (user, done) {
      var sessionUser = new UserBO(user._userId, user._password)
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
    function(req, email, password, done) {

        //process.nextTick(function() {

            UserBO.validateId(email, function (err, valid) {

                if (err) {
                    // return any existing errors
                    return done(err);
                }

                // set up flash message if entered email is already taken
                if (valid) {
                    return done(null, false, req.flash('signupMessage', 'Email is already taken!'));
                } 
                // create the user otherwise
                else {

                    var newUser = new UserBO(email, password);
                    newUser.save(function (err) {
                        if (err) {
                            return done(err);
                            //console.log("shit happened again");
                        } else {
                            return done(null, newUser);
                        }
                    });

                }

            })

        //});

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
        UserBO.validateId(email, function (err, valid) {

            // return any existing errors
            if (err) {
                return done(err);
            }                 
            if (!valid) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            UserBO.validateIdPw(email, password, function (err, validUser) {
                if (err) {
                    return done(err);
                }
                if (!validUser) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                return done(null, validUser);
            })
        })
    }));

}