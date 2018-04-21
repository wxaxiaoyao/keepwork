import Sequelize from 'sequelize';
import config from "../config.js";

const dbconfig = config.database;

const sequelize = new Sequelize(dbconfig.database, dbconfig.username, dbconfig.password, {
  host: dbconfig.host,
  dialect: dbconfig.type,
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  //storage: 'path/to/database.sqlite'
});

//sequelize
  //.authenticate()
  //.then(() => {
    //console.log('Connection has been established successfully.');
  //})
  //.catch(err => {
    //console.error('Unable to connect to the database:', err);
  //});

export default sequelize;
