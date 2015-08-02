// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// need to implement routers https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
var routesHandler = require('./routesHandler.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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

	// getting profile page
	app.get('/profile', redirectVisitor, function (req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	// getting upload profile pic page
	app.get('/uploadProfilePic', redirectVisitor, function (req, res) {
		res.render('upload.ejs', {
		user : req.user
		});
	});
	
	app.get('/uploadSucceeded', redirectVisitor, function(req, res){
		// Do something here
	})

	// getting post page
	app.get('/post', redirectVisitor, function (req, res) {
		res.render('post.ejs', {
			user : req.user
		});
	});

	// getting request page
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
    app.post('/post', redirectVisitor, function(req, res){
    	routesHandler.postFormHandler(req, res);
	});

    // searching for a post
	app.post('/search', redirectVisitor, function(req, res){
		routesHandler.keywordsSearchHandler(req, res);
	});

	// upload finished page sent after upload is handled
	app.post('/uploadSucceeded', multipartMiddleware, function(req, res){
		routesHandler.uploadToDB(req, res);
	});

}