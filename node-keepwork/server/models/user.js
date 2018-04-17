import Sequelize from 'sequelize';
import sequelize from "./database.js";

const User = sequelize.define('user', {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},
	
	username: {
		type: Sequelize.STRING(48),
		unique: true,
	},

	password: {
		type: Sequelize.STRING(48),

		set(val) {
			this.setDataValue("password", val.toUpperCase());
		},
	},

	email: {
		type: Sequelize.STRING(24),
		unique: true,
	},

	cellphone: {
		type: Sequelize.STRING(24),
		unique: true,
	},

	nickname: {
		type: Sequelize.STRING,
	},

	portrait: {
		type: Sequelize.STRING,
	},

	sex: {
		type: Sequelize.STRING(4),
	},
});

//User.sync({force:true}).then(() => {
	//console.log("create user table successfully");
//});


export default User;
