module.exports = function(sequelize, DataTypes) {

	return sequelize.define('taskOption', {
		// PTODate: {
		// 	type: DataTypes.DATE,
		// 	allowNull: false
			
		// },
		
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [3, 20]	
			}
			
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [3, 20]	
			}
			
		},

	}, { timestamps: false})

};