import { Request, Response } from "express";
import { validateCard } from "../services/card.service";
import { customContent } from "../utils/custom-response";

export function validateCardController(req: Request, res: Response): void {
  const { card_number } = req.body as { card_number?: unknown };

  if (card_number === undefined || card_number === null || card_number === "") {
    res
      .status(400)
      .json(customContent("error", { message: "card_number is required." }));
    return;
  }

  if (typeof card_number !== "string" && typeof card_number !== "number") {
    res.status(400).json(
      customContent("error", {
        message: "card_number must be a string or number.",
      }),
    );
    return;
  }

  const input = String(card_number).trim();

  if (!/^\d[\d\s-]*\d$/.test(input) && !/^\d+$/.test(input)) {
    res.status(422).json(
      customContent("error", {
        message: "card_number contains invalid characters.",
      }),
    );
    return;
  }

  const result = validateCard(input);

  res.status(200).json(
    customContent("success", {
      message: result.message,
      data: { valid: result.valid, network: result.network },
    }),
  );
}
