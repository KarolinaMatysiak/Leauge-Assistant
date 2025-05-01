const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/connections/db-connection');
const ChampionTag = require('./championTag')

const Champion = sequelize.define('Champion', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true 
  }},
  {
    tableName: 'champions',
    sequelize
  }
);

module.exports = Champion;