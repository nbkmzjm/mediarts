var PORT = process.env.PORT || 3000;
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var moment = require('moment');
var now = moment();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var _ = require('underscore');

var db = require('./db.js');

var middleware = require('./middleware.js')(db);

var app = express();
	app.use(middleware.logger);
	app.use(bodyParser.json());
	app.set("view options", {layout:false});
	app.use(express.static(__dirname + '/public'));




io.on('connection', function(socket) {
	console.log('user connect to socket io');

	socket.emit('message', {
		text: 'welcome to schedule app',
		Note: 'first'
	});
});

app.get('/about', function(req, res) {
	res.render('public/about.html');
	
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
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
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

app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'PTODate', 'Note');
	db.PTO.create(body).then(function(PTO) {
		req.user.addPTO(PTO).then(function() {
			return PTO.reload();
		}).then(function(PTO) {
			res.json(PTO.toJSON());
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

app.post('/user', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');


	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);

	});
})


app.post('/user/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication')
		userInstance = user;
		return db.token.create({
			token: token
		});
		
	}).then(function (tokenInstance) {
		console.log("tookenInstance created");
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function (e) {
		res.status(401).json({error:e.toString()});
	});
});

app.delete('/user/logout', middleware.requireAuthentication, function(req, res) {
	req.token.destroy().then(function (){
		res.status(204).send();
	}).catch( function (e){
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