var express = require('express');
var app = express();
var PORT = process.env.PORT;

var middeware = require('./middleware.js');

app.use(middeware.logger);


app.get('/about', middeware.requireAuthentication,function(req, res){
	res.send('About us');
});


app.use(express.static(__dirname+'/public'));

app.listen(PORT, function(){
	console.log('Helllo Express server started on PORT '+ PORT);
});