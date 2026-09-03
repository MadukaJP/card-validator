import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config";
import { generalLimiter } from "./middleware/rate-limit.middleware";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";
import { customContent } from "./utils/custom-response";
import cardRoutes from "./routes/card.routes";

const app: Application = express();

app.disable("x-powered-by");

app.use(helmet());

// Allow requests from configured origins. With no allowlist configured, all
// origins are permitted, which is convenient for local development.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsAllowedOrigins.length === 0) {
        return callback(null, true);
      }
      if (config.corsAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api", generalLimiter);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json(customContent("success", { message: "Card validator API is running" }));
});

app.use("/api/v1/card", cardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
