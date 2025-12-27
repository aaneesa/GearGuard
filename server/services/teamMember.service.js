const prisma = require("../prisma/client");

const addMember = async (userId, teamId) => {
  // Check if already exists to avoid unique constraint error
  const existing = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: parseInt(userId),
        teamId: parseInt(teamId)
      }
    }
  });

  if (existing) {
    throw new Error("User is already a member of this team");
  }

  return await prisma.teamMember.create({
    data: {
      userId: parseInt(userId),
      teamId: parseInt(teamId)
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      },
      team: {
        select: { id: true, name: true }
      }
    }
  });
};

const removeMember = async (id) => {
  return await prisma.teamMember.delete({
    where: { id: parseInt(id) }
  });
};

const getMembersByTeamId = async (teamId) => {
  return await prisma.teamMember.findMany({
    where: { teamId: parseInt(teamId) },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      }
    }
  });
};

module.exports = {
  addMember,
  removeMember,
  getMembersByTeamId
};
