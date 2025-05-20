const championController = require('../controllers/championsController')
const auth = require('../middlewares/auth')


function registerRoutes(app)
{
  app.post('/champions-update', auth.authenticate, championController.updateChampions)  
  app.get('/champions', championController.getChampions)  
}


module.exports={registerRoutes}

