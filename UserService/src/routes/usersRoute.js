const usersController = require('../controllers/usersController')


function registerRoutes(app)
{
  app.post('/sign-up', usersController.signUp)  
  app.post('/sign-in', usersController.signIn)
}


module.exports={registerRoutes}

