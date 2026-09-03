import { luhnCheck } from "../services/luhn";

describe("luhnCheck", () => {
  it("returns true for a valid Visa test number", () => {
    expect(luhnCheck("4111111111111111")).toBe(true);
  });

  it("returns true for a valid Mastercard test number", () => {
    expect(luhnCheck("5500005555555559")).toBe(true);
  });

  it("returns true for a valid Amex test number", () => {
    expect(luhnCheck("378282246310005")).toBe(true);
  });

  it("returns false for a number that fails the Luhn check", () => {
    expect(luhnCheck("4111111111111112")).toBe(false);
  });

  it("returns false for a number that is too short", () => {
    expect(luhnCheck("41115")).toBe(false);
  });

  it("returns false for a number that is too long", () => {
    expect(luhnCheck("41111111111111111111")).toBe(false);
  });

  it("strips spaces and dashes before checking", () => {
    expect(luhnCheck("4111 1111 1111 1111")).toBe(true);
    expect(luhnCheck("4111-1111-1111-1111")).toBe(true);
  });
});
