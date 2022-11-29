const router = require("express").Router();

// api/v1/user
router.use("/user", require("./user"));

router.use('/task', require("./task"));

module.exports = router;