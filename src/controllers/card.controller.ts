import { Request, Response } from "express";
import { validateCard } from "../services/card.service";

export function validateCardController(req: Request, res: Response): void {
  const { card_number } = req.body;

  if (typeof card_number !== "string" || !card_number.trim()) {
    res.status(400).json({
      error: "card_number is required and must be a non-empty string",
    });
    return;
  }

  if (!/^\d+$/.test(card_number)) {
    res.status(422).json({
      error: "card_number must contain only digits",
    });
    return;
  }

  const valid = validateCard(card_number);

  res.status(200).json({
    valid,
  });
}
