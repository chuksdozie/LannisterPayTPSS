const { expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const client = require("../redis/redis");

describe("Transaction POST Endpoint", () => {
  it("should throw error when wrong input formats are dropped", async () => {
    const res = await request(app).post("/split-payments/compute").send({
      userId: 1,
      title: "test is cool",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Fees Configuration POST Endpoint", () => {
  it("should return correct output when no error", async () => {
    const res = await request(app)
      .post("/split-payments/compute")
      .send({
        ID: 13082,
        Amount: 4500,
        Currency: "NGN",
        CustomerEmail: "anon8@customers.io",
        SplitInfo: [
          {
            SplitType: "FLAT",
            SplitValue: 450,
            SplitEntityId: "LNPYACC0019",
          },
          {
            SplitType: "FLAT",
            SplitValue: 2300,
            SplitEntityId: "LNPYACC0011",
          },
        ],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("ID");
    expect(res.body).toHaveProperty("Balance");
    expect(res.body).toHaveProperty("SplitBreakdown");
  });
});
