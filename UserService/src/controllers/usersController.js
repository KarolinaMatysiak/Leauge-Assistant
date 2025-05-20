const { Op } = require("sequelize");
const User = require("../models/user"); // ścieżka do modelu
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRounds = 10;

async function signUp(req, res) {
  console.log(req.body);
  if (!req.body?.email) {
    res.status(400).send({ message: "email is missing" });
    return;
  }
  if (req.body.email.length < 5) {
    res.status(400).send({ message: "email is too short" });
    return;
  }

  if (!req.body?.password) {
    res.status(400).send({ message: "password is missing" });
    return;
  }
  if (req.body.password.length < 5) {
    res.status(400).send({ message: "password is too short" });
    return;
  }

  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
try{
    const user = await User.create({
      email: req.body.email,
      password: hash,
    });
    res.send();

}
catch (error) {
    res.status(400).send({message: "registration error"})
}
  });
}

async function signIn(req, res) {
  if (!req.body?.email) {
    res.status(400).send({ message: "authentication failed" });
    return;
  }
  if (!req.body?.password) {
    res.status(400).send({ message: "authentication failed" });
    return;
  }

  const user = await User.findOne({
    where: { email: req.body.email },
  });
  if (!user) {
    res.status(400).send({message:"authentication failed"});
  }

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (result)
    {
     
const token = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET,  { expiresIn: '1h' });
        res.status(200).send({ token })
    }
    else{
        res.status(400).send({message:"authentication failed"})
    }
  });
}

module.exports = { signUp, signIn };
