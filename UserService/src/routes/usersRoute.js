const usersController = require('../controllers/usersController')


function registerRoutes(app)
{
  app.post('/sign-up', usersController.signUp)  
}


module.exports={registerRoutes}

