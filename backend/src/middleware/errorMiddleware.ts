import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the complete error trace securely on the server side
  console.error("Express Error Handler caught error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    // Mask details and stack traces when running in production to avoid system leaks
    error: isProduction ? {} : (err.message ? err.message : err),
    stack: isProduction ? undefined : err.stack,
  });
};
