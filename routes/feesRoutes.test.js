const { expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const client = require("../redis/redis");

describe("Fees Configuration POST Endpoint", () => {
  it("should throw error when wrong fee configurations are dropped", async () => {
    const res = await request(app).post("/fees").send({
      userId: 1,
      title: "test is cool",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Fees Configuration POST Endpoint", () => {
  it("should return fee configurations when no error", async () => {
    const res = await request(app).post("/fees").send({
      FeeConfigurationSpec:
        "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status");
  });
});

describe("Fees Configuration GET Endpoint", () => {
  it("should throw error when fee configurations not found and should return fee configurations when FC'S are found", async () => {
    const payload = await client.get("fees");
    const res = await request(app).get("/fees");
    if (!payload) {
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error");
    } else {
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ data: JSON.parse(payload) });
      expect(res.body).toHaveProperty("data");
    }
  });
});
