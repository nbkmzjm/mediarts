cryptojs = require('crypto-js')
module.exports = function(db) {

	return {

		requireAuthentication: function(req, res, next) {
			var token = req.get('Auth');
			console.log(token);

			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
			}).then(function (tokenIns){
				if (!tokenIns){
					throw new Error('token is not found');
				}
				request.token = tokenIns;
				return db.user.findByToken(token);
			}).then(function (user){
				req.user = user;
				next();
			}, function (e) {
				console.log(e);
				res.status(401).json({error:e.toString()});
			});

		},
		logger: function(req, res, next) {
			console.log('request: ' + req.method + ' ' + req.originalUrl + ' ' + new Date());
			next();
		}
	}
};