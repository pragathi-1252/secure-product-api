import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const errorHandler = (
  err: Error & {
    statusCode?: number;
    isOperational?: boolean;
  },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  const message = err.isOperational
    ? err.message
    : "Something went wrong";

  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err.message,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
export default errorHandler;