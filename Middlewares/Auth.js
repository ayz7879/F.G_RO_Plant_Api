import { verifyToken } from "../utils/jwt.js";
import Admin from "../models/Admin.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("auth");
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token, authorization denied", success: false });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    return res.status(401).json({ message: "Admin not found", success: false });
  }

  req.admin = admin;
  next();
};

export default authMiddleware;
