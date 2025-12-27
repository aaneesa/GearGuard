const service = require("../services/teamMember.service");

const add = async (req, res) => {
  try {
    const { userId, teamId } = req.body;
    if (!userId || !teamId) {
      return res.status(400).json({ error: "userId and teamId are required" });
    }
    const member = await service.addMember(userId, teamId);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await service.removeMember(req.params.id);
    res.json({ message: "Team member removed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getByTeam = async (req, res) => {
  try {
    const members = await service.getMembersByTeamId(req.params.teamId);
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  add,
  remove,
  getByTeam
};
