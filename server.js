require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const Role = require("./models/Role");
const customerRoutes = require("./routes/customerRoutes");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


// 🔥 Node API calling Spring Boot API
app.get("/api/java-customers", async (req, res) => {
  try {

    const response = await axios.get("http://localhost:8081/customer/api/v1/customers");

    res.json(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error calling Java API");
  }
});


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


// ✅ Start Server
const startServer = async () => {
  try {

    await connectDB();
    await seedRoles();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();