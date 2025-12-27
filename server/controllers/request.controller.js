const service = require("../services/request.service");

const create = async (req, res) => {
  try {
    // Determine creator from authenticated user if not manually passed (though usually UI sends it)
    // We enforce creator to be the logged in user for integrity, or allow admin to set it.
    // For now, let's assume we take createdById from body, but fall back to req.user.id
    const data = { ...req.body, createdById: req.user.id };
    
    const request = await service.createRequest(data);
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const requests = await service.getAllRequests();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const request = await service.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const request = await service.updateRequest(req.params.id, req.body);
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await service.deleteRequest(req.params.id);
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};
