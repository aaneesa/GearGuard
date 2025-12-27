const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenanceTeam.controller");
const asyncHandler = require("../middlewares/asyncHandler");

router.post("/", asyncHandler(controller.create));
router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.delete("/:id", asyncHandler(controller.delete));

module.exports = router;
