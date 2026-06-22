const jwt = require("jsonwebtoken");

async function generateJwt(payload) {
  let token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}

async function verifyToken(token) {
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (error) {
    return false;
  }
}


module.exports = { generateJwt, verifyToken };