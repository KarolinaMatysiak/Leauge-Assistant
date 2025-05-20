require('dotenv').config()
const express = require('express');
const cors = require('cors')
const db = require('./connections/db-connection');
const userRoute = require("./routes/usersRoute")

async function bootstrap() {
    const app = express()
    const port = 3001
    
     app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cors());
    await db.initConnection();

    userRoute.registerRoutes(app)
    
    //aplikacja nasluchuje na porcie 3001
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

bootstrap();