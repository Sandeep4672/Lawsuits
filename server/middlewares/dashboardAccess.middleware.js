export const canAcessDashboard = (req, res, next) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
};
