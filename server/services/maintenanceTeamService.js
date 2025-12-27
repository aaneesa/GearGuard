const prisma = require("../prisma/client");

const createTeam = async (data) => {
  return await prisma.maintenanceTeam.create({
    data
  });
};

const getAllTeams = async () => {
  return await prisma.maintenanceTeam.findMany({
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      },
      equipment: true
    }
  });
};

const getTeamById = async (id) => {
  return await prisma.maintenanceTeam.findUnique({
    where: { id: parseInt(id) },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      },
      equipment: true
    }
  });
};

const updateTeam = async (id, data) => {
  return await prisma.maintenanceTeam.update({
    where: { id: parseInt(id) },
    data
  });
};

const deleteTeam = async (id) => {
  return await prisma.maintenanceTeam.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam
};
