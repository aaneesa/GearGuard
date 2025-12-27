const bcrypt = require("bcrypt");
const prisma = require("../prisma/client");
const { createToken } = require("../utils/jwt");

const registerUser = async (data) => {
  const { name, email, password, role, departmentName } = data;


  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      role,
      department: {
        connectOrCreate: {
          where: { name: departmentName }, // look for existing department
          create: { name: departmentName } // create if it doesn't exist
        }
      }
    }
  });


  return user;
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = createToken({
    id: user.id,
    role: user.role
  });

  return { token, user };
};

module.exports = {
  registerUser,
  loginUser
};
