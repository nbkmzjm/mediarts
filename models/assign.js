module.exports = function(sequelize, DataTypes) {

	return sequelize.define('assign', {
		// PTODate: {
		// 	type: DataTypes.DATE,
		// 	allowNull: false
			
		// },
		datePos: {
			type: DataTypes.INTEGER,
			allowNull: false
			
		},
		Note: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		}

	})

};