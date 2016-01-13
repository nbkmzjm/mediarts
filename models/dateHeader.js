module.exports = function(sequelize, DataTypes) {

	return sequelize.define('dateHeader', {
		
		dateH: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			unique: true

			
		},
		datePos: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
			// autoIncrement: true
			
		}

	}, { timestamps: false})

};