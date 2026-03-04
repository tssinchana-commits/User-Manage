require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const Role = require("./models/Role");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", require("./routes/authRoutes"));

// 🔥 Seed Roles Function
const seedRoles = async () => {
  const roles = ["Admin", "Representative", "Verifier", "Manager"];

  for (let roleName of roles) {
    const existingRole = await Role.findOne({ name: roleName });
    if (!existingRole) {
      await Role.create({ name: roleName });
      console.log(`${roleName} role created`);
    }
  }
};

// ✅ Start Server Properly
const startServer = async () => {
  try {
    await connectDB();      // Connect DB first
    await seedRoles();      // Then seed roles

    app.use("/api/roles", require("./routes/roleRoutes"));
    app.use("/api/users", require("./routes/userRoutes"));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();