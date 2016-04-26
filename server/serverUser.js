var express = require('express');
var router = express.Router();
var db = require('../db.js');
var _ = require('underscore');

var middleware = require('../middleware.js')(db);


router.get('/',middleware.requireAuthentication , function(req, res){
	var curUserTitle = req.user.title;

	var arrayTitle_UserTab = ['admin', 'manager']
	if (arrayTitle_UserTab.indexOf(curUserTitle)!== -1) {
		res.render('users/usersHome',{JSONdata:JSON.stringify({tabx:'userList'})})
	} else{
		res.render('index')
	}
	
})


router.get('/newUser', middleware.requireAuthentication, function(req, res){

	res.send('Form for new users')
})


router.get('/newAccountForm', function(req, res) {
	res.render('users/newAccountForm');
})


router.post('/addUser', function(req, res) {

	req.check('name', 'Full Name must be within 5-30 characters').len(5,30);
	req.check('email', 'Email is not valid').isEmail();
	req.check('username', 'Username must be within 5-20 characters').len(5,20)
	req.check('password', 'Password must be within 5-20 characters').len(5,20)
	req.check('title', 'Title must be assigned').len(3)

	var errors = req.validationErrors()

	if (errors){
		res.render('users/usersHome',{errors:errors, JSONdata:JSON.stringify({tabx:'userForm'})})
	}

	var body = _.pick(req.body, 'name', 'email', 'username', 'password', 'title', 'active')
	
	console.log(JSON.stringify(body, null, 4))

	db.user.create(body).then(function(user) {
		res.render('users/usersHome',{JSONdata:JSON.stringify({tabx:'userList'})})
	}, function(e) {
		res.render('error', {
			error: 'Can not Create Account due to :' + e

		});

	});
});


router.post('/editUser', function(req, res) {
	db.user.findOne({
		where: {
			id:req.body.userId
		} 
	}).then(function(user){
		console.log(JSON.stringify(user, null, 4))
		res.json({
			user:user
		})
	})
})

router.get('/userList', middleware.requireAuthentication, function(req, res){

	db.user.findAll().then(function(users){
		res.json({
			users:users
		})
	}, function(e){
		res.render('error', {
			error: e.toString()
		})

	})
})


router.post('/delUser', middleware.requireAuthentication, function(req, res){

	db.user.destroy({
		where: {
			id: req.body.taskOption
		}
	}).then(function(deleted){
		res.json({
			deleted:deleted
		});
	});

})


router.post('/login', function(req, res) {

	req.check('username', 'Username is required').isByteLength(5);
	req.check('username', 'Password is required').isByteLength(5);

	var errors = req.validationErrors();

	if (errors) {
		res.render('users/loginForm', {
			message: '',
			errors: errors
		});
	}

	var body = _.pick(req.body, 'username', 'password');
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
