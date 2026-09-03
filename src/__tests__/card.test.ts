import request from "supertest";
import app from "../app";

const ENDPOINT = "/api/v1/card/validate";

describe(`POST ${ENDPOINT}`, () => {
  it("returns 200 and data.valid:true for a valid card number", async () => {
    const res = await request(app)
      .post(ENDPOINT)
      .send({ card_number: "4111111111111111" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.valid).toBe(true);
    expect(res.body.data.network).toBe("Visa");
  });

  it("returns 200 and data.valid:false for an invalid card number", async () => {
    const res = await request(app)
      .post(ENDPOINT)
      .send({ card_number: "4111111111111112" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.valid).toBe(false);
    expect(res.body.data.network).toBeNull();
  });

  it("returns 400 when card_number is missing", async () => {
    const res = await request(app).post(ENDPOINT).send({});
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBeDefined();
  });

  it("returns 400 when card_number is an empty string", async () => {
    const res = await request(app).post(ENDPOINT).send({ card_number: "" });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("returns 422 when card_number contains letters", async () => {
    const res = await request(app)
      .post(ENDPOINT)
      .send({ card_number: "4111abc111111111" });
    expect(res.status).toBe(422);
    expect(res.body.status).toBe("error");
  });

  it("accepts card numbers formatted with spaces", async () => {
    const res = await request(app)
      .post(ENDPOINT)
      .send({ card_number: "4111 1111 1111 1111" });
    expect(res.status).toBe(200);
    expect(res.body.data.valid).toBe(true);
  });

  it("returns 404 with the error envelope for an unknown route", async () => {
    const res = await request(app).post("/unknown");
    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
  });
});
