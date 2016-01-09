var PORT = 3000;
var express = require('express');
var app = express();

app.get('/',function(req, res){
	res.send('hello');
})

app.listen(PORT, function(){
	console.log('Port listen at' + PORT);
})