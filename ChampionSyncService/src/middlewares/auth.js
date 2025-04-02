const isLoggedIn = (req,res,next) =>
 {
    if (req.user) 
    {
        next();
    }
    else
    {
        res.status(401).send('Nie jestes zalogowany');
    }
}