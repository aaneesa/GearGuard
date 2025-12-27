const service = require("../services/maintenanceTeam.service");

exports.create = async (req, res) => {
  const team = await service.createTeam(req.body);
  res.status(201).json(team);
};

exports.getAll = async (req, res) => {
  const teams = await service.getAllTeams();
  res.json(teams);
};

exports.getById = async (req, res) => {
  const team = await service.getTeamById(req.params.id);
  res.json(team);
};

exports.delete = async (req, res) => {
  const team = await service.deleteTeam(req.params.id);
  res.json(team);
};
