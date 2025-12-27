const express = require('express');
const router = express.Router();
const controller = require('../controllers/equipment.controller');
const asyncHandler = require('../middlewares/asyncHandler');

router.post('/', asyncHandler(controller.create));
router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getById));
router.put('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.delete));
router.patch('/:id/scrap', asyncHandler(controller.scrap));

module.exports = router;
