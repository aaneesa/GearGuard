const service = require("../services/teamMember.service");

const add = async (req, res) => {
  try {
    const { teamId } = req.body;
    const user = req.user; // <-- MUST get logged-in user from JWT

    // Validation
    if (!teamId) {
      return res.status(400).json({ error: "teamId is required" });
    }

    // Only technicians can join maintenance teams
    if (user.role !== "TECHNICIAN") {
      return res.status(403).json({
        error: "Only technicians can join maintenance teams"
      });
    }

    // Call service to add the technician
    const member = await service.addMember(user.id, teamId);

    res.status(201).json({
      message: "Successfully joined maintenance team",
      member
    });
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
