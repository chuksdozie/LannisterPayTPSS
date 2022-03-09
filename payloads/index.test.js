const { expect } = require("@jest/globals");
const client = require("../redis/redis");
const { feesSetupPayload, transactionsPayload } = require("./index");

test("recieves an object and not empty", () => {
  let payload = {};
  expect(payload).not.toBeUndefined();
  expect(payload).not.toBeNull();
  expect(feesSetupPayload(payload)).toBe(payload);
  expect(transactionsPayload(payload)).toBe(payload);
});
