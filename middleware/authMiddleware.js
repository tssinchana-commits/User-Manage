const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contains id, email, roles

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles;

    const hasAccess = userRoles.some(role =>
      allowedRoles.includes(role)
    );

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied. Insufficient role."
      });
    }

    next();
  };
};