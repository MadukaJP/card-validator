import { isValidLuhn } from "../utils/luhn";

export function validateCard(cardNumber: string): boolean {
   return isValidLuhn(cardNumber);
}
