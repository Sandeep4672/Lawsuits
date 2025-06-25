export const canAccessDashboard = (req, res, next) => {
  if (!req.user || !req.user._id || !req.params.id) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (req.user._id.toString() !== req.params.id.toString()) {
    return res.status(403).json({ message: "Access denied. You can only access your own dashboard." });
  }

  next();
};
