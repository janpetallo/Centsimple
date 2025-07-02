const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

async function register(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      },
    });

    const { password: _, ...user } = newUser; // remove password before sending the response
    res.status(201).json(user);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { register };
