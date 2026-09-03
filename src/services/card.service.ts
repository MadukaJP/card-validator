import { luhnCheck } from "./luhn";
import { detectNetwork, CardNetwork } from "./card.network";

export interface ValidationResult {
  valid: boolean;
  network: CardNetwork | null;
  message: string;
}

export function validateCard(cardNumber: string): ValidationResult {
  // Strip anything that is not a digit so the Luhn check and network
  // detection only ever see a clean number.
  const digits = cardNumber.replace(/\D/g, "");

  const valid = luhnCheck(digits);
  // Only meaningful to name a network for a number that actually passes.
  const network = valid ? detectNetwork(digits) : null;

  return {
    valid,
    network,
    message: valid ? "Card number is valid." : "Card number is invalid.",
  };
}
