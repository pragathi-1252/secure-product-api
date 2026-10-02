import type { Response } from "express";

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
): Response => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    ...(data !== undefined && { data }),
  });
};

export default sendResponse;
