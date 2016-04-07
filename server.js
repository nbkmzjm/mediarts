var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var expValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var debug = require('debug')('http')

var moment = require('moment');
var now = moment();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var _ = require('underscore');



var db = require('./db.js');

var middleware = require('./middleware.js')(db);

app.use(cookieParser());
// app.use(middleware.logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname + '/public', 'views'));
app.set("view options", {
	layout: true
});

app.locals.pretty = true;
app.use(express.static(__dirname));
app.use(expValidator());

app.use('/test', function(req, res, next){
	dtime = 'Time : '+ new Date().toLocaleDateString()
	console.log(dtime)

	next();
	res.send(dtime)
})

app.get('/test', function(req, res){
	// res.render('test')
	res.send('hey hey')
})


app.get('/', middleware.requireAuthentication, function(req, res, next) {

	db.assign.findAll({
		include: [db.user]
	}).then(function(assigns) {

		// next();

		return [assigns, db.user.findAll(), db.dateHeader.findAll()];
	}).spread(function(assigns, users, dateHeader) {
		// console.log('suerssssssssss' + JSON.stringify(users));
		// console.log('ggggggggggggg' + JSON.stringify(assigns));
		// console.log('yyyyyyyyyy' + JSON.stringify(dateHeader));
		res.render('index', {
			// users: users,
			// assigns: assigns,
			// dateHeader: dateHeader
		});
	}).catch(function(e) {
		res.render('error', {
			error: "eeeeee" + e.toString()

		});

	});



});


app.post('/sysObjRead', middleware.requireAuthentication, function(req, res){
	var varList = req.body.pData
	var date21LK = req.body.pData.date21LK
	
	db.sysObj.findAll({
		where:{
			name: varList
		} 
	}).then(function(sysObjs){
		var sysObjList = {}
		sysObjs.forEach(function(sysObj,i){
		sysObjList[sysObj.name] = sysObj.value
		
		})
		
		res.json(sysObjList)
	});
})

app.post('/sysObjUpdate', middleware.requireAuthentication, function(req, res){
	var name = req.body.pData.name
	var value = req.body.pData.value
	// console.log(name+'--'+value)
	db.sysObj.upsert({
			name: name,
			value: value
	}).then(function(created){
		console.log(created)
		if (created === undefined){
			console.log(value)
			res.json({lockoutDate:value})
		}
		
	}).catch(function(e){
		console.log(e)
	});
})



app.post('/sclog', middleware.requireAuthentication, function(req, res) {
	res.render
});


app.post('/taskSC', middleware.requireAuthentication, function(req, res) {
	var userId = req.body.postdata.userId;
	var dateSC = req.body.postdata.dateSC;

	// console.log('taskSCCCCCCx: ' + userId + dateSC);
	// res.json({
	// 		userId: userId,
	// 		dateSC: dateSC
	// 	});
	db.assign.findOne({
		where: {
			userId: userId,
			datePos: dateSC
		}

	}).then(function(assign) {
		// console.log('assingXXX' + assign);
		// console.log('userIdXXX' + userId);

		if (!!assign) {
			res.json({
				assign: assign
			});
		} else {
			res.json({
				userId: userId
			});
		};

	}).catch(function(e) {

		// console.log("eeroorr" + e);

		// res.json({
		// 	error: e.toString()
		// });
	});
});

app.post('/dateSC', middleware.requireAuthentication, function(req, res) {
	var userId = req.body.postdata.userId;
	var dateSC = req.body.postdata.dateSC;
	var taskSC = req.body.postdata.taskSC;
	var curUserId = req.user.id

	// console.log('dateSCCCCCC: ' + userId + dateSC + taskSC);

	if (userId != curUserId){
		console.log('aaauu')
		res.json({authorized: false});


	} else if (taskSC=='SELECT'){
		


	} else if (taskSC=='DELETE'){
		db.user.findOne({
			where: {
				id: userId
			}
		}).then(function(user) {
			return db.assign.destroy({
						where: {
							userId: user.id,
							datePos: dateSC

						}
					});
		}).then(function(deleted){
			// console.log('deleted: ' + deleted)
			res.json({
					deleted: deleted
				});


		}).catch(function(e) {
			// console.log("eeroorrx" + e);

			res.render('error', {
				error: e.toString()
			});
		});



	} else {
		
		db.user.findOne({
			where: {
				id: userId
			}
		}).then(function(user) {


			return [
				db.assign.findOrCreate({
					where: {
						userId: user.id,
						datePos: dateSC

					}
				}),
				user
			];


		}).spread(function(assign, user) {
			user.addAssign(assign[0]).then(function() {
								
			});

			res.json({
					Note: taskSC
				});

			return db.assign.update({
				Note: taskSC
			}, {
				where: {
					userId: user.id,
					datePos: dateSC
				}
			});



			

		}).then(function(assign) {
			console.log('updateeee new taskSC: ' + assign);
		}).catch(function(e) {
			console.log("eeroorr" + e);

			res.render('error', {
				error: e.toString()
			});
		});
	}




	
});

app.get('/taskOption', middleware.requireAuthentication, function(req, res){

	db.taskOption.findAll().then(function(taskOption){
		res.json({
			taskOption:taskOption
		})
	}, function(e){
		res.render('error', {
			error: e.toString()
		})

	})

})

app.post('/taskOption', middleware.requireAuthentication, function(req, res) {


	db.taskOption.findOrCreate({
		where:{
		description: req.body.taskOption
		}
	}).spread(function(taskOption, created) {
			
			res.json({
				taskOption:taskOption,
				created:created
			})
		
	}, function(e) {
		res.render('error', {
			error: e.toString()
		})
	});
	


});

app.post('/delTaskOption', middleware.requireAuthentication, function(req, res){

	db.taskOption.destroy({
		where: {
			description: req.body.taskOption
		}
	}).then(function(deleted){
		res.json({
			deleted:deleted
		});
	});

})

app.post('/ajaxUser', middleware.requireAuthentication, function(req, res) {

	db.user.findAll().then(function(users) {
		
		if (req.body.clickedData){
			res.json({
				pData: {
					users: users,
					clickedData: true
				}
			});
		}else{
			res.json({
				pData: {
					users: users,
					clickedData: false
				}
			});
		}
		
		

	}, function(e) {
		res.render('error', {
			error: e.toString()

		});

	});
})


app.get('/loginForm', function(req, res) {
	res.render('users/loginForm')
})


app.post('/login', function(req, res) {

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


app.get('/logout', middleware.requireAuthentication, function(req, res) {
	req.token.destroy().then(function() {
		res.redirect('/loginForm');
	}).catch(function(e) {
		res.status(500).send();
	});
});


app.get('/newAccountForm', function(req, res) {
	res.render('users/newAccountForm');
})

app.post('/createAccount', function(req, res) {

	body = {};
	body.email = req.body.email;
	body.password = req.body.password;

	db.user.create(body).then(function(user) {
		res.redirect('/');
	}, function(e) {
		res.render('error', {
			error: 'Can not Create Account due to :' + e

		});

	});
});


io.on('connection', function(socket) {
	console.log('user connect to socket io');

	socket.emit('message', {
		text: 'welcomex to schedule app',
		Note: 'first'
	});


});






app.post('/user/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function(user) {
		var token = user.generateToken('authentication')
		userInstance = user;
		return db.token.create({
			token: token
		});

	}).then(function(tokenInstance) {
		console.log("tookenInstance created");
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function(e) {
		res.status(401).json({
			error: e.toString()
		});
	});
});

app.delete('/user/logout', middleware.requireAuthentication, function(req, res) {
	req.token.destroy().then(function() {
		res.status(204).send();
	}).catch(function(e) {
		res.status(500).send();
	});

});


db.sequelize.sync(
	// {force: true}
).then(function() {
	
	http.listen(PORT, function() {
		console.log('Helllo Express server started on PORT ' + PORT);
	});

});