// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// need to implement routers https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
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
<<<<<<< HEAD
	app.get('/login', function (request, response) {
		response.render('login.ejs', { message: req.flash('loginMessage') });
=======
	app.get('/login', function (req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
>>>>>>> 7443b3df389e311c418507ea6ba429a64c21866d
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
<<<<<<< HEAD
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
=======
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
		passport.authenticate('local-signup', { successRedirect: '/',
												failureRedirect: '/signup',
												failureFlash: true })
	);

	// process login application
    app.post('/login', 
    	passport.authenticate('local-login', { successRedirect: '/',
    								           failureRedirect: '/login',
        									   failureFlash: true })
    );
>>>>>>> 7443b3df389e311c418507ea6ba429a64c21866d

}