const prisma = require('../prisma/client');
const { Prisma } = require('@prisma/client');

async function createEquipment(data) {
  try {
    return await prisma.equipment.create({
      data: {
        name: data.name,
        serialNumber: data.serialNumber,
        category: data.category,
        location: data.location,
        status: data.status || 'ACTIVE',
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : undefined,
        department: { connect: { id: data.departmentId } },
        maintenanceTeam: { connect: { id: data.maintenanceTeamId } },
        ...(data.assignedUserId && {
          assignedUser: { connect: { id: data.assignedUserId } }
        })
      }
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new Error('Equipment with this serial number already exists');
    }
    throw err;
  }
}

async function getEquipmentById(id) {
  const equipment = await prisma.equipment.findUnique({
    where: { id: Number(id) },
    include: {
      department: true,
      assignedUser: true,
      maintenanceTeam: true,
      requests: true,
      logs: true
    }
  });

  if (!equipment) throw new Error('Equipment not found');
  return equipment;
}

async function listEquipments(query) {
  return prisma.equipment.findMany({
    where: {
      status: query.status,
      category: query.category
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function updateEquipment(id, data) {
  return prisma.equipment.update({
    where: { id: Number(id) },
    data: {
      ...data,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : undefined,
      ...(Object.prototype.hasOwnProperty.call(data, 'assignedUserId') && (
        data.assignedUserId === null
          ? { assignedUser: { disconnect: true } }
          : { assignedUser: { connect: { id: data.assignedUserId } } }
      ))
    }
  });
}

async function deleteEquipment(id) {
  return prisma.equipment.delete({
    where: { id: Number(id) }
  });
}

async function scrapEquipment(id) {
  return prisma.equipment.update({
    where: { id: Number(id) },
    data: { status: 'SCRAPPED' }
  });
}

module.exports = {
  createEquipment,
  getEquipmentById,
  listEquipments,
  updateEquipment,
  deleteEquipment,
  scrapEquipment
};
