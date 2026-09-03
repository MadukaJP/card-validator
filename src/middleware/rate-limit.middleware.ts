import rateLimit from "express-rate-limit";
import { customContent } from "../utils/custom-response";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: customContent("error", {
    message: "Too many requests, please try again later.",
  }),
});

export const validateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: customContent("error", {
    message: "Too many validation attempts, please try again later.",
  }),
});
