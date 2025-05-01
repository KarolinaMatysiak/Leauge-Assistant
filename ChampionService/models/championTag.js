const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/connections/db-connection");
const Champion = require("./champion");

const ChampionTag = sequelize.define('ChampionTag', {
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    championId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    }},
    {
        tableName: 'champions_tags',
        sequelize
      }
    
 )

 module.exports = ChampionTag;