const { expect } = require("@jest/globals");
const client = require("../redis/redis");
const { transactionPayload } = require("./index");

test("recieves an object and not empty", () => {
  let payload = {};
  expect(payload).not.toBeUndefined();
  expect(payload).not.toBeNull();
  expect(transactionPayload(payload)).toBe(payload);
});
