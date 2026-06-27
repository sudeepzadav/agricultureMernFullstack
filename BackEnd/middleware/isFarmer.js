function isFarmer(req, res, next) {
  if (!req.user || req.user.role !== "farmer") {
    return res.status(403).json({
      success: false,
      message: "Only farmers are allowed",
    });
  }

  next();
}

module.exports = isFarmer;