const authMiddleware = (req, res, next) => {
  try {
    const auth = req.auth || {};
    const userId = auth.userId || (typeof req.auth === "function" ? req.auth().userId : null);

    if (!userId) {
      return res.status(401).json({ success: false, message: "No authenticated user" });
    }

    req.body.userId = userId;
    next();
  } catch (error) {
    return res.status(401).send({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;