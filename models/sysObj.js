module.exports = function(sequelize, DataTypes) {

	return sequelize.define('sysObj', {
		// PTODate: {
		// 	type: DataTypes.DATE,
		// 	allowNull: false
			
		// },
		
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1, 50]	
			}

			
		},
		value:  {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 50]	
			}

			
		}

	}, { timestamps: false})

};