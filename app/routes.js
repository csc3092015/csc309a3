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
		res.render('home.ejs', {
			userBO : req.user
		});
	});

	app.get('/profile', redirectVisitor, function (req, res) {
		res.render('profile.ejs', {
			userBO : req.user
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


    // doing a search
	app.post('/search', function(req, res){
		routesHandler.keywordsSearchHandler(req, res);
	});

	// click interested, create mutual agreement
	app.post('/interested', function(req, res){
		routesHandler.establishMutualAgreement(req, res);
	});

	app.get("/serviceAgreement/:mutualAgreementId(^[0-9a-fA-F]{24}$)", redirectVisitor, function(req, res){
		routesHandler.mutualAgreementInfoHandler(req, res);
	});

	app.post("/serviceAgreement/:mutualAgreementId(^[0-9a-fA-F]{24}$/change)", redirectVisitor, function(req, res){
		routesHandler.mutualAgreementInfoUpdateHandler(req, res);
	});

	

	// Error handlers from https://github.com/strongloop/express/blob/master/examples/error-pages/index.js

	// Since this is the last non-error-handling
	// middleware use()d, we assume 404, as nothing else
	// responded.

	// $ curl http://localhost:3000/notfound
	// $ curl http://localhost:3000/notfound -H "Accept: application/json"
	// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

	app.use(function(req, res, next){
		res.status(404);

	  // respond with html page
	  if (req.accepts('html')) {
	  	res.render('404', { url: req.url });
	  	return;
	  }

	  // respond with json
	  if (req.accepts('json')) {
	  	res.send({ error: 'Not found' });
	  	return;
	  }

	  // default to plain-text. send()
	  res.type('txt').send('Not found');
	});

	// error-handling middleware, take the same form
	// as regular middleware, however they require an
	// arity of 4, aka the signature (err, req, res, next).
	// when connect has an error, it will invoke ONLY error-handling
	// middleware.

	// If we were to next() here any remaining non-error-handling
	// middleware would then be executed, or if we next(err) to
	// continue passing the error, only error-handling middleware
	// would remain being executed, however here
	// we simply respond with an error page.

	app.use(function(err, req, res, next){
	  // we may use properties of the error object
	  // here and next(err) appropriately, or if
	  // we possibly recovered from the error, simply next().
	  res.status(err.status || 500);
	  res.render('500', { error: err });
	});

	/* istanbul ignore next */
	if (!module.parent) {
		app.listen(3000);
		console.log('Express started on port 3000');
	}

}