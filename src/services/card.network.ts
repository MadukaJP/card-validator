export type CardNetwork =
  | "Visa"
  | "Mastercard"
  | "American Express"
  | "Discover"
  | "Unknown";

// Identifies the card network from the IIN/BIN prefix (the leading digits).
// The checks here only cover the most common networks, so anything that does
// not match falls through to "Unknown".
export function detectNetwork(cardNumber: string): CardNetwork {
  const digits = cardNumber.replace(/\D/g, "");

  // Visa starts at 4.
  if (/^4/.test(digits)) return "Visa";
  // Mastercard uses 51-55 and the newer 2221-2720 range.
  if (
    /^5[1-5]/.test(digits) ||
    /^2(2[2-9]\d|[3-6]\d\d|7[01]\d|720)/.test(digits)
  )
    return "Mastercard";
  // American Express starts at 34 or 37.
  if (/^3[47]/.test(digits)) return "American Express";
  // Discover starts at 6011 or 65.
  if (/^6(?:011|5)/.test(digits)) return "Discover";

  return "Unknown";
}
