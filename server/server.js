require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const maintenanceTeamRoutes = require("./routes/maintenanceTeamRoutes");
const equipmentRoutes = require("./routes/equipment.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/equipments", equipmentRoutes);
app.use("/api/maintenance-teams", maintenanceTeamRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
