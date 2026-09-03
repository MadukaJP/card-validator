import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import cardRouter from "./routes/card.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(limiter);

app.get("/", (_req, res) => {
  res.json({
    message: "Card Validation API",
  });
});

app.use("/api/v1/cards", cardRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (err instanceof SyntaxError) {
      res.status(400).json({
        error: "Invalid JSON payload",
      });
      return;
    }

    console.error(err);

    res.status(500).json({
      error: "Internal server error",
    });
  },
);

export default app;
