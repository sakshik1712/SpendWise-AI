const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");

router.get("/", ctrl.getUser);
router.put("/", ctrl.updateUser);

module.exports = router;
