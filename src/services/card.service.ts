import { luhnCheck } from "./luhn";
import { detectNetwork, CardNetwork } from "./card.network";

export interface ValidationResult {
  valid: boolean;
  network: CardNetwork | null;
  message: string;
}

export function validateCard(cardNumber: string): ValidationResult {
  const digits = cardNumber.replace(/\D/g, "");

  const valid = luhnCheck(digits);
  const network = valid ? detectNetwork(digits) : null;

  return {
    valid,
    network,
    message: valid ? "Card number is valid." : "Card number is invalid.",
  };
}
