const equipmentService = require('../services/equipment.service');

exports.create = async (req, res) => {
  const equipment = await equipmentService.createEquipment(req.body);
  res.status(201).json(equipment);
};

exports.getById = async (req, res) => {
  const equipment = await equipmentService.getEquipmentById(req.params.id);
  res.json(equipment);
};

exports.getAll = async (req, res) => {
  const equipments = await equipmentService.listEquipments(req.query);
  res.json(equipments);
};

exports.update = async (req, res) => {
  const updated = await equipmentService.updateEquipment(req.params.id, req.body);
  res.json(updated);
};

exports.delete = async (req, res) => {
  const deleted = await equipmentService.deleteEquipment(req.params.id);
  res.json(deleted);
};

exports.scrap = async (req, res) => {
  const scrapped = await equipmentService.scrapEquipment(req.params.id);
  res.json(scrapped);
};
