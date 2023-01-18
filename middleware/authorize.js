const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  let token = req.header("Authorization");
  if (!token) return res.status(400).send("Access denied! No token Provided?");
  else token = token.split(" ")[1].trim();
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send("Invalid Token!");
  }
};
