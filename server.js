var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var expValidator = require('express-validator');
var cookieParser = require('cookie-parser');

var moment = require('moment');
var now = moment();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var _ = require('underscore');



var db = require('./db.js');

var middleware = require('./middleware.js')(db);

app.use(cookieParser());
app.use(middleware.logger);
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

app.get('/', middleware.requireAuthentication, function(req, res, next) {

	db.assign.findAll({
		include: [db.user]
	}).then(function(assigns) {

		// next();

		return [assigns, db.user.findAll(), db.dateHeader.findAll()];
	}).spread(function(assigns, users, dateHeader) {
		console.log('suerssssssssss' + JSON.stringify(users));
		console.log('ggggggggggggg' + JSON.stringify(assigns));
		console.log('yyyyyyyyyy' + JSON.stringify(dateHeader));
		res.render('index', {
			users: users,
			assigns: assigns,
			dateHeader: dateHeader
		});
	}).catch(function(e) {
		res.render('error', {
			error: "eeeeee" + e.toString()

		});

	});



	// , function(req, res){
	// 	db.user.findAll().then(function(users){
	// 		console.log('suerssssssssss'+JSON.stringify(users));
	// 		console.log('ggggggggggggg'+ JSON.stringify(req.data));

	// 	})

	// }
});

app.post('/mainSC', middleware.requireAuthentication, function(req, res) {
	// req.accepts('application/json');
	console.log('mainSCCCCCC receiving' + req.body.postdata.name);
	db.assign.findAll({
		include: [db.user]
	}).then(function(assigns) {

		// next();

		return [assigns, db.user.findAll(), db.dateHeader.findAll()];
	}).spread(function(assigns, users, dateHeader) {

		console.log('suerssssssssss' + JSON.stringify(users));
		console.log('ggggggggggggg' + JSON.stringify(assigns));
		console.log('yyyyyyyyyy' + JSON.stringify(dateHeader));
		res.json({
			users: users,
			dateHeader: dateHeader
				// {
				// users: users, 
				// assigns: assigns,
				// dateHeader: dateHeader
				// }
		});
	}).catch(function(e) {
		res.render('error', {
			error: "eeeeee" + e.toString()

		});

	});

})

app.post('/dateSC', middleware.requireAuthentication, function(req, res) {
	var userId = req.body.postdata.userId;
	var dateSC = req.body.postdata.dateSC;

	console.log('dateSCCCCCC: ' + userId + dateSC);

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
			// if (assign[1]) {
				console.log('assigned is: rrrr' + assign)
				// return assign[0].reload();
			// }
		});
		console.log(user.email + "  ")
	}).


	catch(function(e) {
		console.log("eeroorr" + e);

		res.render('error', {
			error: e.toString()
		});
	});


	// db.assign.create({

	// 	datePos:dateSC
	// }).then(function(assign){
	// 	userId.addAssign(assign).then(function(
	// 		){
	// 		return assign.reload();
	// 	}).then(function(assign){

	// 	});
	// console.log(assign);

	// 	// console.log(ins + ":::::::"+ ini)
	// }).catch(function(e) {
	// 	console.log(e);
	// 	res.render('error', {
	// 		error: e.toString()

	// 	});

	// });
})


app.post('/ajaxUser', middleware.requireAuthentication, function(req, res) {

	db.user.findAll().then(function(users) {
		console.log('ajaxUser: ' + users);
		res.json({
			users: users
		});

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
			errors: errorsno
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
		console.log("tookenInstance created");
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
		res.render('index', {
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
// app.use('token', )



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


app.get('/assignInput', middleware.requireAuthentication, function(req, res) {
	res.render('assignInput');
});



app.post('/assign', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'datePos', 'Note');
	console.log('body is xxxxxxxxx: ' + body);
	db.assign.create(body).then(function(datePos) {
		req.user.addAssign(datePos).then(function() {
			return assign.reload();
		}).then(function(datePos) {
			res.json(datePos.toJSON());
		});



	}, function(e) {
		res.status(400).json(e);
	});


	res.redirect('/');
});

io.on('connection', function(socket) {
	console.log('user connect to socket io');

	socket.emit('message', {
		text: 'welcomex to schedule app',
		Note: 'first'
	});


});

todoItems = [{
	id: 1,
	desc: 'foo'
}, {
	id: 2,
	desc: 'far'
}, {
	id: 3,
	desc: 'fuk'
}];

app.get('/about', middleware.requireAuthentication, function(req, res) {

	console.log(typeof(todoItems));
	todoItems.forEach(function(item) {
		console.log(item.desc);
	})
	res.render('about', {
		title: 'My App',
		items: todoItems
	});

});

app.post('/add', function(req, res) {
	var newItem = req.body.newItem;
	console.log(newItem);
	todoItems.push({
		id: todoItems.length + 1,
		desc: newItem
	});
	res.redirect('/about');

});

app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var query = req.query;
	var where = {
		userId: req.user.get('id')
	};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {

		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {

		res.json(todos);

	}, function(e) {
		res.status(500).send;

	});
});
app.get('/todos/:id', middleware.requireAuthentication,
	function(req, res) {
		var todoId = parseInt(req.params.id);

		db.todo.findOne({
			where: {
				id: todoId,
				userId: req.user.get('id')
			}
		}).then(function(todo) {
			if (!!todo) {
				res.json(todo.toJSON());
			} else {
				res.status(404).send();
			}
		}, function(e) {
			res.status(500).send();

		});


	});

app.post('/todos', middleware.requireAuthentication,
	function(req, res) {
		var body = _.pick(req.body, 'datePos', 'Note');
		console.log(body);
		db.assign.create(body).then(function(datePos) {
			req.user.addAssign(datePos).then(function() {
				return assign.reload();
			}).then(function(datePos) {
				res.json(datePos.toJSON());
			});



		}, function(e) {
			res.status(400).json(e);
		});


	});



app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}

	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	})
})



app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attr = {};

	if (body.hasOwnProperty('completed')) {
		attr.completed = body.completed
	}

	if (body.hasOwnProperty('description')) {
		attr.description = body.description
	}

	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
		if (todo) {
			todo.update(attr).then(function() {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);

			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(400).send();
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
	var arrDateHeader = [];
	var dateOrigin = moment(new Date([2015, 12, 31]));
	console.log(dateOrigin);
	var dateAdd = dateOrigin;


	for (var i = 1; i < 100; i++) {
		var objDateHeader = {};

		dateAdd = dateOrigin.add(1, 'days').format('MM-DD-YYYY');
		objDateHeader.dateH = dateAdd;
		objDateHeader.datePos = i;


		arrDateHeader.push(objDateHeader);

	};
	console.log(arrDateHeader);

	// db.dateHeader.bulkCreate(arrDateHeader).then(function(dateHeader) {
	// 	console.log('dateHeader created');
	// }, function(e) {
	// 	console.log('error created dateHeader');

	// });
	http.listen(PORT, function() {
		console.log('Helllo Express server started on PORT ' + PORT);
	});

});