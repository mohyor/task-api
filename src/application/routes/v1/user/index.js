const router = require("express").Router();

// api/v1/admins
router.use("/", require("./user"));

module.exports = router;
