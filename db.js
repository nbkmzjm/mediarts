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
		
db.PTO = sequelize.import(__dirname + '/models/PTO.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.PTO.belongsTo(db.user);
db.user.hasMany(db.PTO);

module.exports = db;