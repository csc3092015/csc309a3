// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
module.exports = function (app, passport) {

	// welcome page
	app.get('/', function (request, redirectUser, response) {
		response.render('index.ejs'); // load the index.ejs file
	});

	// sign up page
	app.get('/signup', function (request, response) {
		response.render('signup.ejs');
	});

	// login page
	app.get('/login', function (request, response) {
		response.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// log out
	app.get('/logout', function (request, response) {
		request.logout();
		response.redirect('/');
	});

	// home page for logged in users
	app.get('/home', redirectVisitor, function (request, response) {
		response.render('home.ejs', {
			user : request.user
		});
	});

	app.get('/profile', redirectVisitor, function (request, response) {
		response.render('profile.ejs', {
			user : request.user
		});
	});

	// check is user is logged in
	function loginStatus (request) {
		return request.isAuthenticated();
	}

	// route middleware to redirect users that aren't logged in
	function redirectVisitor (request, response, next) {
		if (loginStatus(request))
			return next;

		response.redirect('/');
	}

	// route middleware to redirect logged in users to home
	function redirectUser (request, response, next) {
		if (!loginStatus(request))
			return next;

		response.redirect('/home');
	}

	// process signup application
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	// process login application
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

}