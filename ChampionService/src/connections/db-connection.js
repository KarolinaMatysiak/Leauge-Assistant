const { Sequelize } = require('sequelize');


//konstruktor
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './roulette.db'
  });





async function initConnection(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
  }



  


  module.exports={sequelize, initConnection}