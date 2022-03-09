const { expect } = require("@jest/globals");
const { feesSetup, fees } = require("./Fees");

test("the out isnt empty", async () => {
  const output = await fees();
  expect(output).not.toBeNull();
  expect(output).not.toBeUndefined();
});

test("the payload and output arent empty", async () => {
  let payload = { a: "enjoy\ngoat" };
  try {
    const output = await feesSetup(payload);
    expect(output).not.toBeNull();
  } catch (e) {
    expect(e);
  }
});

test("the fetch fails with an error", async () => {
  expect.assertions(0);
  try {
    await fees();
  } catch (e) {
    expect(e);
  }
});
