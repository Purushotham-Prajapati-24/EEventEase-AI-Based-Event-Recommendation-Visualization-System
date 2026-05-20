import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      
      // Fetch the actual user from database to ensure they still exist and have valid permissions
      const dbUser = await User.findById(decoded.id).select("-passwordHash");
      if (!dbUser) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      // normalise so both req.user.id and req.user._id work
      req.user = dbUser;
      return next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.warn("No token provided in request headers");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
