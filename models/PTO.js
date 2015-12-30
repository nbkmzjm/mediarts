module.exports = function(sequelize, DataTypes) {

	return sequelize.define('PTO', {
		PTODate: {
			type: DataTypes.DATE,
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