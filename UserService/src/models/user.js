const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/db-connection');


const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true 
  }},
  {
    tableName: 'users',
    sequelize
  }
);

module.exports = User;