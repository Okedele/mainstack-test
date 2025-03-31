import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
