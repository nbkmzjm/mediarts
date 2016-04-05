module.exports = function(sequelize, DataTypes) {

	return sequelize.define('assign', {
		// PTODate: {
		// 	type: DataTypes.DATE,
		// 	allowNull: false
			
		// },
		datePos: {
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				isDate:true
			}
			
		},
		Note: {
			type: DataTypes.STRING,
			allowNull: true,
			
		}

	})

};