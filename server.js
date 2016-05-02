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
console.log(__dirname)
app.use(express.static(__dirname));
app.use('/users', express.static(__dirname));
app.use(expValidator());


app.get('/test', function(req, res){
	res.render('test')
	// res.send('hey hey')
})


app.get('/', middleware.requireAuthentication, function(req, res, next) {

	db.assign.findAll({
		include: [db.user]
	}).then(function(assigns) {
		// next();
		return [assigns, db.user.findAll()];
	}).spread(function(assigns, users) {
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

app.get('/getTaskSC', middleware.requireAuthentication, function(req, res){
	var curUserTitle = req.user.title;

	db.assign.findAll({
		attributes:['datePos', 'Memo', 'userId', 'Note']
	}).then(function(assign){
		res.json({
			assign:assign,
			 curUserTitle
		})
	})
})

app.post('/taskSC', middleware.requireAuthentication, function(req, res) {
	var userId = req.body.postdata.userId;
	var dateSC = req.body.postdata.dateSC;
	var curUserTitle = req.user.title;

	db.assign.findOne({
		where: {
			userId: userId,
			datePos: dateSC
		}
	}).then(function(assign) {

		if (!!assign) {
			res.json({
				assign: assign,
				curUserTitle: curUserTitle
			});
		} else {
			res.json({
				userId: userId,
				curUserTitle: curUserTitle
			});
		};

	}).catch(function(e) {

	});
});

app.post('/dateSC', middleware.requireAuthentication, function(req, res) {
	var userId = req.body.postdata.userId;
	var dateSC = req.body.postdata.dateSC;
	var taskSC = req.body.postdata.taskSC;
	var memo = req.body.postdata.memo;
	var curUser = req.user

	console.log('memo: '+memo)

	if (userId != curUser.id && (curUser.title != 'admin' && curUser.title != 'manager')){
		
		res.json({authorized: false});
	} else if (taskSC=='SELECT'){
		// db.assign.findOne({
		// 	where: {
		// 		userId: userId,
		// 		datePos: dateSC
		// 	}
		// }).then(function(assign){
		// 	console.log(JSON.stringify(assign,null,4))
		// 	res.json({
		// 		Memo:assign.Memo
		// 	})
		// });

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
			res.json({
					deleted: deleted
				});

		}).catch(function(e) {
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
			console.log(assign[0]+'--'+assign[1])
			user.addAssign(assign[0]).then(function() {

			});

			res.json({
					Note: taskSC
				});

			return db.assign.update({
				Note: taskSC,
				Memo: memo
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
	var curUserTitle = req.user.title;
	db.taskOption.findAll().then(function(taskOption){
		res.json({
			taskOption:taskOption,
			curUserTitle:curUserTitle
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

	db.user.findAll({
		where:{
			active:1
		}, 
		order:[
				['title']
				]
		,
	}).then(function(users) {
		res.json({
			pData: {
				users: users
				
			}
		});
	}, function(e) {
		res.render('error', {
			error: e.toString()
		});

	});
})







io.on('connection', function(socket) {
	console.log('user connect to socket io');

	socket.emit('message', {
		text: 'welcomex to schedule app',
		Note: 'first'
	});


});


var user = require('./server/serverUser.js');
// var user = express.static(__dirname + '/server');
app.use('/users', user);





db.sequelize.sync(
	{force: true}
).then(function() {
	
	http.listen(PORT, function() {
		console.log('Helllo Express server started on PORT ' + PORT);
	});

});