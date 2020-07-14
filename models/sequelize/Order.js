/* --- Sequelize : Order Model --- */
const Sequelize = require('sequelize');
const sequelize = require('../../utils/db-conn');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;
