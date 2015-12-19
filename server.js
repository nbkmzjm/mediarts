var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var db = require('./db.js');

var _ = require('underscore');

var PORT = process.env.PORT||3000;

var todoNext=1;
var todos = [
{id:1, description: 'meet for lunch', done: false },
{id:2, description: 'meet for tennis', done: false },
{id:3, description: 'meet for monvie', done: false }
];
var middeware = require('./middleware.js');

app.use(middeware.logger);

app.use(bodyParser.json());


app.get('/about', middeware.requireAuthentication,function(req, res){
	res.send('About us');
});

app.get('/todos', function(req, res){
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true'){
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false'){
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length>0){

		where.description = { $like: '%'+query.q+'%' };
	}

	db.todo.findAll({where: where}).then(function (todos){
		
		res.json(todos);
		
	}, function (e){
		res.status(500).send;

	});


})
app.use(express.static(__dirname+'/public'));

app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);

	db.todo.findById(todoId).then(function (todo){
		if (!!todo){
			res.json(todo.toJSON());
		}else{
			res.status(404).send();
		}
	}, function (e){
		res.status(500).send();

	});
		
	
});

app.post('/todos', function (req, res){
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function (todo){
		res.json(todo);
	}, function (e){
		res.status(400).json(e);
	});

	
});

app.delete('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where:{
			id:todoId
		}

	}).then(function (rowsDeleted){
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else{
			res.status(204).send();
		}
	}, function (){
		res.status(500).send();
	})
})

db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
	console.log('Helllo Express server started on PORT '+ PORT);
	});

});

app.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attr = {};

	if (body.hasOwnProperty('completed')){
		attr.completed = body.completed
	}

	if (body.hasOwnProperty('description')){
		attr.description = body.description
	}

	db.todo.findById(todoId).then(function (todo){
		if (todo){
			todo.update(attr).then(function(){
				res.json(todo.toJSON());
			}, function (e){
				res.status(400).json(e);

			});
		} else {
			res.status(404).send();
		}
	}, function(){
		res.status(400).send();
	});



});

