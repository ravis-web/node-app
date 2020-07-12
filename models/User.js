/* --- User Model --- */
const Sequelize = require('sequelize');
const sequelize = require('../utils/db-conn');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  mail: Sequelize.STRING
});

module.exports = User;
