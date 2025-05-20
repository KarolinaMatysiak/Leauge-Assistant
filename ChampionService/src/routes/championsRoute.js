const championController = require('../controllers/championsController')


function registerRoutes(app)
{
  app.post('/champions-update', championController.updateChampions)  
  app.get('/champions', championController.getChampions)  
}


module.exports={registerRoutes}

