var express = require('express');
var router = express.Router();

router.get('/', function(req, res){

	res.send('this is User Home')
})


router.get('/newUser', function(req, res){

	res.send('Form for new users')
})


module.exports = router;
