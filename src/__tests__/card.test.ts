import request from "supertest";
import app from "../app";

describe("POST /api/v1/cards/validate", () => {
  it("returns valid for a valid card number", async () => {
    const response = await request(app)
      .post("/api/v1/cards/validate")
      .send({
        card_number: "4111111111111111",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: true,
    });
  });

  it("returns invalid for an invalid card number", async () => {
    const response = await request(app)
      .post("/api/v1/cards/validate")
      .send({
        card_number: "4111111111111112",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: false,
    });
  });

  it("returns 400 when card number is missing", async () => {
    const response = await request(app)
      .post("/api/v1/cards/validate")
      .send({});

    expect(response.status).toBe(400);
  });
});