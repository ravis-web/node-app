/* --- Cart Model --- */
const { Sequelize } = require('sequelize');
const sequelize = require('../utils/db-conn');

const Cart = sequelize.define();

module.exports = sequelize;