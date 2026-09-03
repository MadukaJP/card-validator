import express from "express";
import cardRouter from "./routes/card.routes";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Card Validation API",
  });
});

app.use("/api/v1/cards", cardRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({
      error: "Invalid JSON payload",
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
  });
});


export default app;
