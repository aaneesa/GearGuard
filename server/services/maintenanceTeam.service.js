const prisma = require("../prisma/client");

async function createTeam(data) {
  return prisma.maintenanceTeam.create({
    data: {
      name: data.name,
      description: data.description
    }
  });
}

async function getAllTeams() {
  return prisma.maintenanceTeam.findMany({
    include: {
      members: {
        include: { user: true }
      }
    }
  });
}

async function getTeamById(id) {
  const team = await prisma.maintenanceTeam.findUnique({
    where: { id: Number(id) },
    include: {
      members: {
        include: { user: true }
      },
      equipment: true
    }
  });

  if (!team) throw new Error("Maintenance team not found");
  return team;
}

async function deleteTeam(id) {
  return prisma.maintenanceTeam.delete({
    where: { id: Number(id) }
  });
}

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  deleteTeam
};
