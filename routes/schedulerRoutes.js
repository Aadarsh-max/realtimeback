
import express from "express";
import { runScheduler } from "../controllers/schedulerController.js";
import { compareAllAlgorithms } from "../controllers/schedulerController.js";

const router = express.Router();

router.post("/run", runScheduler);
router.post("/compare", compareAllAlgorithms);

export default router;