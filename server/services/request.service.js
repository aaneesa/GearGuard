const prisma = require("../prisma/client");

const createRequest = async (data) => {
  const { subject, description, requestType, priority, equipmentId, teamId, createdById, assignedToId } = data;

  return await prisma.maintenanceRequest.create({
    data: {
      subject,
      description,
      requestType,
      priority,
      equipmentId: parseInt(equipmentId),
      teamId: parseInt(teamId),
      createdById: parseInt(createdById),
      assignedToId: assignedToId ? parseInt(assignedToId) : null
    }
  });
};

const getAllRequests = async () => {
  return await prisma.maintenanceRequest.findMany({
    include: {
      equipment: { select: { id: true, name: true, serialNumber: true } },
      team: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    }
  });
};

const getRequestById = async (id) => {
  return await prisma.maintenanceRequest.findUnique({
    where: { id: parseInt(id) },
    include: {
      equipment: true,
      team: true,
      createdBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      statusLogs: true
    }
  });
};

const updateRequest = async (id, data) => {
  // If status is changing, we should log it - but for now just basic update
  return await prisma.maintenanceRequest.update({
    where: { id: parseInt(id) },
    data
  });
};

const deleteRequest = async (id) => {
  return await prisma.maintenanceRequest.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest
};
