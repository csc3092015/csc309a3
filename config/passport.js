// http://passportjs.org/docs
// https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local

var localStrategy = require('passport-local').Strategy;
var user = require('../model/dao/UserDAO');

module.exports = function (passport) {

	// User login session handler
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
    	User.findById(id, function(err, user) {
    		done(err, user);
    	});
    });

	/* passport.serializeUser(function (user, done) {
		var sessionUser = new user(user.__id, user.password, user.username)
		done(null, sessionUser);
	});

	passport.deserializeUser(function (sessionUser, done) {
		done(null, sessionUser);
	}); */

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ '__id' :  email }, function (err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } 

            else {

                // create new user
                var newUser = userDAOSchema.create(email, password, userName, 'member');

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

}