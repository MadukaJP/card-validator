import { isValidLuhn } from "../utils/luhn";

describe("isValidLuhn", () => {
  it("returns true for a valid card number", () => {
    expect(isValidLuhn("4111111111111111")).toBe(true);
  });

  it("returns false for an invalid card number", () => {
    expect(isValidLuhn("4111111111111112")).toBe(false);
  });
});