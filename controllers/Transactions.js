const { transactionPayload } = require("../payloads");
var client = require("../redis/redis");
var { APIError } = require("../config/error");
const httpStatus = require("http-status");
const { roundToTwo } = require("../utils");

/*************************************
 * transaction split function
 *************************************/
const transaction = async (pay) => {
  try {
    const payload = await transactionPayload(pay);
    // ensuring payload exists
    if (!payload) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please fill in transaction details",
        errors: "No payload has been detected",
      });
    }

    // ensuring payload is valid
    if (!payload.ID) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "No transaction ID provided",
        errors: "No transaction ID provided",
      });
    }

    if (!payload.Amount) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "No transaction Amount provided",
        errors: "No transaction Amount provided",
      });
    }

    if (!payload.Currency) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please specify the Amount Currency",
        errors: "No Amount Currency provided",
      });
    }

    if (!payload.CustomerEmail) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please input your email address",
        errors: "Please input your email address",
      });
    }

    if (!payload.SplitInfo) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter atleast one split method",
        errors: "Please enter atleast one split method",
      });
    }

    if (!payload.SplitInfo[0]) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter atleast one split method",
        errors: "Please enter atleast one split method",
      });
    }

    const splitInfo = payload.SplitInfo;
    let splitInfoOrder = [];

    let output = {
      ID: payload.ID,
      Balance: "",
      SplitBreakdown: [],
    };

    //SORTING BY FLAT RATES
    for (let i = 0; i < splitInfo.length; i++) {
      if (splitInfo[i].SplitType === "FLAT") {
        splitInfoOrder.push(splitInfo[i]);
      }
    }

    //SORTING BY PERCENTAGE RATES
    for (let i = 0; i < splitInfo.length; i++) {
      if (splitInfo[i].SplitType === "PERCENTAGE") {
        splitInfoOrder.push(splitInfo[i]);
      }
    }

    //SORTING BY RATIO RATES
    for (let i = 0; i < splitInfo.length; i++) {
      if (splitInfo[i].SplitType === "RATIO") {
        splitInfoOrder.push(splitInfo[i]);
      }
    }

    //IMPLEMENTING THE RATES
    let balance = parseFloat(payload.Amount);
    let Amount = payload.Amount;
    let totalRatio = 0;

    for (let i = 0; i < splitInfoOrder.length; i++) {
      if (splitInfoOrder[i].SplitType === "FLAT") {
        balance = balance - splitInfoOrder[i].SplitValue;
        output.Balance = balance;
        output.SplitBreakdown.push({
          SplitEntityId: splitInfoOrder[i].SplitEntityId,
          Amount: roundToTwo(splitInfoOrder[i].SplitValue),
        });
      } else if (splitInfoOrder[i].SplitType === "PERCENTAGE") {
        const percent = (splitInfoOrder[i].SplitValue / 100) * balance;
        balance = balance - percent;
        output.Balance = balance;
        output.SplitBreakdown.push({
          SplitEntityId: splitInfoOrder[i].SplitEntityId,
          Amount: roundToTwo(percent),
        });
      }
    }

    // Getting the totalRatio
    for (let i = 0; i < splitInfoOrder.length; i++) {
      if (splitInfoOrder[i].SplitType === "RATIO") {
        totalRatio += splitInfoOrder[i].SplitValue;
      }
    }
    // solving for ratios
    let ratioBalance = balance;
    let ratioAmounts = [];

    for (let i = 0; i < splitInfoOrder.length; i++) {
      if (splitInfoOrder[i].SplitType === "RATIO") {
        let specificRatio = 0;
        specificRatio =
          parseFloat(splitInfoOrder[i].SplitValue / totalRatio) * ratioBalance;
        if (ratioAmounts[0]) {
          //   console.log(343, ratioAmounts[ratioAmounts.length - 1]);
          const ratioAmount =
            ratioAmounts[ratioAmounts.length - 1] - specificRatio;
          ratioAmounts.push(ratioAmount);
          output.Balance = ratioAmount;
        } else {
          const ratioAmount = parseFloat(ratioBalance - specificRatio);
          ratioAmounts.push(ratioAmount);
          output.Balance = ratioAmount;
        }
        output.SplitBreakdown.push({
          SplitEntityId: splitInfoOrder[i].SplitEntityId,
          Amount: roundToTwo(specificRatio),
        });
      }
    }

    // check if the balance is less than 0
    if (output.Balance < 0) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Insufficient Funds",
        errors: "Insufficient Funds",
      });
    }

    return output;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

module.exports = {
  transaction,
};
