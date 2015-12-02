var express = require('express');
var app = express();
var PORT = process.env.PORT||3000;
var todos = [
{id:1, description: 'meet for lunch', done: false },
{id:2, description: 'meet for tennis', done: false },
{id:3, description: 'meet for monvie', done: false }

];
var middeware = require('./middleware.js');

app.use(middeware.logger);


app.get('/about', middeware.requireAuthentication,function(req, res){
	res.send('About us');
});

app.get('/todos', function(req, res){
	res.json(todos);
})
app.use(express.static(__dirname+'/public'));

app.get('/todos/:id', function(req, res){
	var matchedTodo;
	var todoId = parseInt(req.params.id);

	todos.forEach(function(todo){
		if(todoId === todo.id){
			matchedTodo = todo;
		}
	});

	if (matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
	
})

app.listen(PORT, function(){
	console.log('Helllo Express server started on PORT '+ PORT);
});