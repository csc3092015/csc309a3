// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// need to implement routers https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
var routesHandler = require('./routesHandler.js');

module.exports = function (app, passport) {

	// welcome page
	app.get('/', redirectUser, function (req, res) {
		res.render('index.ejs', { message: req.flash('fbSignupMessage') }); // load the index.ejs file
	});

	// sign up page
	app.get('/signup', function (req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// login page
	app.get('/login', function (req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// log out
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	// home page for logged in users
	app.get('/home', redirectVisitor, function (req, res) {
		routesHandler.renderHomePage(req, res);
	});

	app.get('/profile', redirectVisitor, function (req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/post', redirectVisitor, function (req, res) {
		res.render('post.ejs', {
			user : req.user
		});
	});

	app.get('/req', redirectVisitor, function (req, res) {
		res.render('request.ejs', {
			user : req.user
		});
	});

	// check is user is logged in
	function loginStatus (req) {
		return req.isAuthenticated();
	}

	// route middleware to redirect users that aren't logged in
	function redirectVisitor (req, res, next) {
		if (loginStatus(req))
			next();
		else
			res.redirect('/');
	}

	// route middleware to redirect logged in users to home
	function redirectUser (req, res, next) {
		if (!loginStatus(req))
			next();
		else
			res.redirect('/home');
	}

	// process signup application
	app.post('/signup', 
		passport.authenticate('local-signup', { successRedirect: '/home',
												failureRedirect: '/signup',
												failureFlash: true })
	);

	// process login application
    app.post('/login', 
    	passport.authenticate('local-login', { successRedirect: '/home',
    								           failureRedirect: '/login',
        									   failureFlash: true })
    );

    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : [ 'email', 'user_about_me' ] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect : '/home',
            								failureRedirect : '/',
            								failureFlash: true })
    );



    // submitting a post
    app.post('/post', function(req, res){
    	routesHandler.postFormHandler(req, res);
	});

	app.post('/search', function(req, res){
		routesHandler.keywordsSearchHandler(req, res);
	});

}