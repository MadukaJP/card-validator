import { Request, Response, NextFunction } from "express";
import { customContent } from "../utils/custom-response";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json(customContent("error", { message: "Route not found." }));
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(err.stack);
  res
    .status(500)
    .json(customContent("error", { message: "An unexpected error occurred." }));
}
