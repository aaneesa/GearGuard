const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenanceTeamController");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");




router.get("/", authenticate, controller.getAll);


router.get("/:id", authenticate, controller.getById);



router.post("/", authenticate, authorize(["ADMIN", "MANAGER"]), controller.create);


router.put("/:id", authenticate, authorize(["ADMIN", "MANAGER"]), controller.update);


router.delete("/:id", authenticate, authorize(["ADMIN"]), controller.remove);

module.exports = router;
