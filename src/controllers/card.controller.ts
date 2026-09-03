import { Request, Response } from "express";
import { validateCard } from "../services/card.service";

export function validateCardController(_req: Request, res: Response): void {
  const { card_number } = _req.body;

  const valid = validateCard(card_number);

  res.json({
    valid,
  });
}
