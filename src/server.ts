import express from "express";
import cardRouter from "./routes/card.routes";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1/cards", cardRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Card Validation API",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});