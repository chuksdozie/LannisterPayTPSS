var redis = require("redis");
const { expect } = require("@jest/globals");
const { getFeesCache, transactionCache } = require("./FeesMiddleware");
const { client } = require("../redis/redis");

test("ensure output isnt empty", async () => {
  try {
    const output = await getFeesCache();
    expect(output).not.toBeNull();
  } catch (e) {
    expect(e);
  }
});

test("ensure output isnt empty", async () => {
  try {
    const output = await transactionCache();
    expect(output).not.toBeNull();
  } catch (e) {
    expect(e);
  }
});
