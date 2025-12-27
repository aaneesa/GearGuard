const express = require("express");
const router = express.Router();
const controller = require("../controllers/teamMember.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

// Add member to team (ADMIN or MANAGER)
router.post("/", authenticate, authorize(["ADMIN", "MANAGER"]), controller.add);

// Remove member from team (ADMIN or MANAGER)
router.delete("/:id", authenticate, authorize(["ADMIN", "MANAGER"]), controller.remove);

// Get members of a specific team
router.get("/team/:teamId", authenticate, controller.getByTeam);

module.exports = router;
