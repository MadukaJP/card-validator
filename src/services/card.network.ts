export type CardNetwork =
  | "Visa"
  | "Mastercard"
  | "American Express"
  | "Discover"
  | "Unknown";

export function detectNetwork(cardNumber: string): CardNetwork {
  const digits = cardNumber.replace(/\D/g, "");

  if (/^4/.test(digits)) return "Visa";
  if (
    /^5[1-5]/.test(digits) ||
    /^2(2[2-9]\d|[3-6]\d\d|7[01]\d|720)/.test(digits)
  )
    return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  if (/^6(?:011|5)/.test(digits)) return "Discover";

  return "Unknown";
}
