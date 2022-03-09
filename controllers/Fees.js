const { feesSetupPayload } = require("../payloads");
var client = require("../redis/redis");
var createError = require("http-errors");
var { APIError } = require("../config/error");
const httpStatus = require("http-status");

/*************************************
 * initial fee configuration function
 *************************************/
const feesSetup = async (x) => {
  try {
    const payload = await feesSetupPayload(x);
    // ensuring payload exists
    if (!payload) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter an input",
        errors: "No payload has been detected",
      });
    }
    // ensuring payload is valid
    if (!payload.FeeConfigurationSpec) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the right input format",
        errors: "Wrong payload has been detected",
      });
    }

    var value = payload.FeeConfigurationSpec;
    value = value.split("\n");

    // create an empty object
    let data = {};
    for (let i = 0; i < value.length; i++) {
      data = { ...data, [i + 1]: value[i] };
    }
    const newData = JSON.stringify(data);
    client.setEx("fees", 500, newData);
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

/****************************************
 * get all available fee configurations
 ****************************************/
const fees = async () => {
  try {
    const payload = await client.get("fees");
    // ensuring payload exists
    if (!payload) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: "No Fee configuration found",
        errors: "No Fee configuration found",
      });
    }
    const data = JSON.parse(payload);
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

module.exports = {
  feesSetup,
  fees,
};
