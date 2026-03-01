import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import schedulerRoutes from "./routes/schedulerRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/scheduler", schedulerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "RTOS Scheduler Backend Running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
