const jwt = require("jsonwebtoken");

function generateJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // token expiration
    algorithm: "HS256",
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null; // better than false
  }
}

module.exports = { generateJwt, verifyToken };