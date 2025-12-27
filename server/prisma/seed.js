const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  /**
   * 1. Departments
   */
  await prisma.department.createMany({
    data: [
      { name: "IT", description: "Information Technology" },
      { name: "Biomedical", description: "Biomedical Engineering" },
      { name: "Operations", description: "Hospital Operations" }
    ],
    skipDuplicates: true
  });

  const itDept = await prisma.department.findUnique({ where: { name: "IT" } });
  const bioDept = await prisma.department.findUnique({ where: { name: "Biomedical" } });

  /**
   * 2. Hash passwords
   */
  const adminHash = await bcrypt.hash("admin123", 10);
  const managerHash = await bcrypt.hash("manager123", 10);
  const techHash = await bcrypt.hash("tech123", 10);
  const employeeHash = await bcrypt.hash("employee123", 10);

  /**
   * 3. Users
   */
  await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@gearguard.com",
        passwordHash: adminHash,
        role: "ADMIN",
        departmentId: itDept.id
      },
      {
        name: "Manager Alice",
        email: "alice.manager@gearguard.com",
        passwordHash: managerHash,
        role: "MANAGER",
        departmentId: bioDept.id
      },
      {
        name: "Tech John",
        email: "tech.john@gearguard.com",
        passwordHash: techHash,
        role: "TECHNICIAN",
        departmentId: bioDept.id
      },
      {
        name: "Tech Sarah",
        email: "tech.sarah@gearguard.com",
        passwordHash: techHash,
        role: "TECHNICIAN",
        departmentId: bioDept.id
      },
      {
        name: "Tech Mike",
        email: "tech.mike@gearguard.com",
        passwordHash: techHash,
        role: "TECHNICIAN",
        departmentId: bioDept.id
      },
      {
        name: "Tech Priya",
        email: "tech.priya@gearguard.com",
        passwordHash: techHash,
        role: "TECHNICIAN",
        departmentId: bioDept.id
      },
      {
        name: "Ops Bob",
        email: "bob.ops@gearguard.com",
        passwordHash: employeeHash,
        role: "EMPLOYEE",
        departmentId: itDept.id
      }
    ],
    skipDuplicates: true
  });

  /**
   * 4. Fetch users
   */
  const admin = await prisma.user.findUnique({ where: { email: "admin@gearguard.com" } });
  const manager = await prisma.user.findUnique({ where: { email: "alice.manager@gearguard.com" } });
  const techJohn = await prisma.user.findUnique({ where: { email: "tech.john@gearguard.com" } });
  const techSarah = await prisma.user.findUnique({ where: { email: "tech.sarah@gearguard.com" } });
  const techMike = await prisma.user.findUnique({ where: { email: "tech.mike@gearguard.com" } });
  const techPriya = await prisma.user.findUnique({ where: { email: "tech.priya@gearguard.com" } });
  const opsBob = await prisma.user.findUnique({ where: { email: "bob.ops@gearguard.com" } });

  /**
   * 5. Maintenance Teams
   */
  await prisma.maintenanceTeam.createMany({
    data: [
      { name: "Electrical Team", description: "Handles electrical equipment" },
      { name: "Mechanical Team", description: "Handles mechanical equipment" }
    ],
    skipDuplicates: true
  });

  const electricalTeam = await prisma.maintenanceTeam.findUnique({
    where: { name: "Electrical Team" }
  });

  const mechanicalTeam = await prisma.maintenanceTeam.findUnique({
    where: { name: "Mechanical Team" }
  });

  /**
   * 6. Team Members
   */
  await prisma.teamMember.createMany({
    data: [
      { userId: techJohn.id, teamId: electricalTeam.id },
      { userId: techSarah.id, teamId: electricalTeam.id },
      { userId: techMike.id, teamId: electricalTeam.id },
      { userId: opsBob.id, teamId: electricalTeam.id },

      { userId: admin.id, teamId: mechanicalTeam.id },
      { userId: manager.id, teamId: mechanicalTeam.id },
      { userId: techPriya.id, teamId: mechanicalTeam.id }
    ],
    skipDuplicates: true
  });

  /**
   * 7. Equipment
   */
  await prisma.equipment.createMany({
    data: [
      {
        name: "ECG Monitor",
        serialNumber: "ECG-1001",
        category: "Cardiology",
        location: "ICU-1",
        purchaseDate: new Date("2023-01-15"),
        warrantyExpiry: new Date("2026-01-15"),
        departmentId: bioDept.id,
        maintenanceTeamId: electricalTeam.id,
        assignedUserId: techJohn.id
      },
      {
        name: "Ventilator",
        serialNumber: "VENT-2001",
        category: "Respiratory",
        location: "ICU-2",
        purchaseDate: new Date("2022-05-10"),
        warrantyExpiry: new Date("2025-05-10"),
        departmentId: bioDept.id,
        maintenanceTeamId: mechanicalTeam.id,
        assignedUserId: techSarah.id
      },
      {
        name: "Defibrillator",
        serialNumber: "DEF-3001",
        category: "Emergency",
        location: "ER",
        departmentId: bioDept.id,
        maintenanceTeamId: electricalTeam.id
      }
    ],
    skipDuplicates: true
  });

  console.log("✅ Database seed completed successfully");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
