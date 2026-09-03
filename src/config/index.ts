import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ?? 3000,
  corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
