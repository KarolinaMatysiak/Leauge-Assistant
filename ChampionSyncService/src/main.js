const championController = require('./controllers/championsController')
const express = require('express');
const cors = require('cors')
const app = express()
const port = 3000

//sprawdzanie czy uzytkownik jest zalogowany w sciezce home
// app.get('/', isLoggedIn, (req,res) =>
// {
//    res.send('Witaj w panelu użytkownika');
// })

app.use(cors());

app.get('/champions', championController.getChampions)


//aplikacja nasluchuje na porcie 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


//udostepnianie plikow statycznych z folderu 'public' takich jak obrazy, jsony etc bez robienia dedykowanych sciezek
//pliki beda dostepne pod //http://localhost:3000/nazwa_pliku, nazwa pliku - nazwa pliku znajdujacego sie w folderze
// app.use(express.static(path.join(__dirname,'public')));