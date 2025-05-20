const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  if (req.headers.authorization) {
    try {
        const token = req.headers.authorization.slice('Bearer '.length)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      next()
    } catch (err) {
      res.status(401).send("Nie jestes zalogowany");
    }
  } else {
    res.status(401).send("Nie jestes zalogowany");
  }
};

module.exports = { authenticate };
