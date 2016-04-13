var express = require('express');
var router = express.Router();
var db = require('../db.js');
var _ = require('underscore');

var middleware = require('../middleware.js')(db);


router.get('/', function(req, res){

	res.send('this is User Home')
})


router.get('/newUser', function(req, res){

	res.send('Form for new users')
})


router.post('/login', function(req, res) {

	req.check('email', 'length is required').isByteLength(5);
	req.check('email', 'Not valid email').isEmail();

	var errors = req.validationErrors();

	if (errors) {
		res.render('users/loginForm', {
			message: '',
			errors: errors
		});
	}

	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function(user) {
		var token = user.generateToken('authentication')
		userInstance = user;
		return db.token.create({
			token: token
		});

	}).then(function(tokenInstance) {
		// res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
		res.cookie('token', tokenInstance.get('token'), {
			maxAge: 9000000
		});
		res.redirect('/');
	}).catch(function(e) {
		console.log(e);
		arrErr = [{
			param: "account",
			msg: 'Username and Password do not match!!!'
		}];
		res.render('users/loginForm', {
			errors: arrErr
		});
		res.status(401).json({
			error: e.toString()
		});
	});

});




router.get('/logout', middleware.requireAuthentication, function(req, res) {
	req.token.destroy().then(function() {
		res.redirect('loginForm');
	}).catch(function(e) {
		res.status(500).send();
	});
});


router.get('/loginForm', function(req, res) {
	res.render('users/loginForm')
})


module.exports = router;
