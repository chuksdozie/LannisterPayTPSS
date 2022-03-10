var express = require("express");
var router = express.Router();
const { transaction } = require("../controllers/Transactions");
const { getFeesCache } = require("../middlewares/FeesMiddleware");

/* Make a transaction */
router.post("/split-payments/compute", async function (req, res, next) {
  try {
    const transactionObject = req.body;
    const data = await transaction(transactionObject);
    res.status(200).json(data);
    return;
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    next(error);
  }
});

module.exports = router;
