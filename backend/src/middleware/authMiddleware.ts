import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      console.log("Token verified for user:", (decoded as any).id);
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
