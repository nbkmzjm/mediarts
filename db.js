var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;
if (env === 'production'){

	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect':'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
	});
}

var db = {};
		
db.assign = sequelize.import(__dirname + '/models/assign.js');
db.taskOption = sequelize.import(__dirname + '/models/taskOption.js');
db.dateHeader = sequelize.import(__dirname + '/models/dateHeader.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.assign.belongsTo(db.user);
db.user.hasMany(db.assign);
db.assign.belongsTo(db.dateHeader);
db.dateHeader.hasMany(db.assign);

module.exports = db;