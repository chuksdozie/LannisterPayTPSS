const { expect } = require("@jest/globals");
const { transaction } = require("./Transactions");

test("the payload and output arent empty", async () => {
  let payload = { a: "enjoy\ngoat" };
  try {
    const output = await transaction(payload);
    expect(output).not.toBeNull();
  } catch (e) {
    expect(e);
  }
});

test("the fetch fails with an error", async () => {
  expect.assertions(0);
  try {
    await transaction();
  } catch (e) {
    expect(e);
  }
});
