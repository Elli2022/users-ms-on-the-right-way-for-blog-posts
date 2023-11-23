//src/middleware/jwtMiddleware.ts
const jwt = require("jsonwebtoken");
const secretKey = "din_jwt_secret"; // Byt ut mot din faktiska hemliga nyckel

export const validateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = validateToken;
