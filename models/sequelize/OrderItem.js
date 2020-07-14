/* --- Sequelize - Order : Join Model --- */
const Sequelize = require('sequelize');
const sequelize = require('../../utils/db-conn');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = OrderItem;
