const express = require('express');
const cors = require('cors')
const championRoute = require("./routes/championsRoute")
const db = require('./connections/db-connection');



async function bootstrap() {
    const app = express()
    const port = 3000
    
    app.use(cors());
    await db.initConnection();
    
    //odpalenie funkcji i podanie aplikacji jako parametru
    championRoute.registerRoutes(app)
    
    //aplikacja nasluchuje na porcie 3000
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

bootstrap();