const { Op } = require('sequelize');
const User = require('../models/user'); // ścieżka do modelu
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function signUp(req,res){
    console.log(req.body)
    if(!req.body.email)
    {
        res.status(400).send({message:"email is missing"})
        return

    }
        if(req.body.email.length<5)
    {
        res.status(400).send({message:"email is too short"})
         return
    }

       if(!req.body.password)
    {
        res.status(400).send({message:"password is missing"})
         return

    }
            if(req.body.password.length<5)
    {
        res.status(400).send({message:"password is too short"})
         return
    }

    
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
     const user = await User.create({
        email: req.body.email,
        password: hash
      });
      res.send()
});
}




  



module.exports={signUp}
