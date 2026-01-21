const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretkey");

    // Normal users should NOT be forced to be admin
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token expired or invalid" });
  }
};
