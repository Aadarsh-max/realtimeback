
import express from "express";
import { runScheduler } from "../controllers/schedulerController.js";

const router = express.Router();

// POST /api/scheduler/run
router.post("/run", runScheduler);

export default router;