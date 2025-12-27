const express = require("express");
const router = express.Router();
const controller = require("../controllers/request.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

// Create request (Any authenticated user can request maintenance)
router.post("/", authenticate, controller.create);

// Get all requests
router.get("/", authenticate, controller.getAll);

// Get specific request
router.get("/:id", authenticate, controller.getById);

// Update request (Managers/Admins or the creator/assigned tech - simplified to ADMIN/MANAGER/TECHNICIAN for now)
router.put("/:id", authenticate, authorize(["ADMIN", "MANAGER", "TECHNICIAN"]), controller.update);

// Delete request (ADMIN only)
router.delete("/:id", authenticate, authorize(["ADMIN"]), controller.remove);

module.exports = router;
