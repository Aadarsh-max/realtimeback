// controllers/schedulerController.js

import { SchedulerCore } from "../services/schedulerEngine/schedulerCore.js";

import { calculateCPUUtilization } from "../services/metrics/cpuUtilization.js";
import { calculateTurnaroundTime } from "../services/metrics/turnaroundTime.js";
import { calculateWaitingTime } from "../services/metrics/waitingTime.js";
import { checkDeadlines } from "../services/metrics/deadlineChecker.js";
import { detectStarvation } from "../services/metrics/starvationDetector.js";

export const runScheduler = async (req, res) => {
  try {
    const { tasks, algorithm, options } = req.body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tasks array is required"
      });
    }

    if (!algorithm) {
      return res.status(400).json({
        success: false,
        message: "Algorithm is required"
      });
    }

    // Run Scheduler
    const scheduler = new SchedulerCore(tasks, algorithm, options);
    const result = scheduler.run();

    // Metrics
    const cpuUtil = calculateCPUUtilization(result.timeline);

    const turnaround = calculateTurnaroundTime(result.tasks);
    const waiting = calculateWaitingTime(result.tasks);

    const deadlineInfo = checkDeadlines(result.tasks);
    const starvationInfo = detectStarvation(
      result.tasks,
      options?.starvationThreshold || 10
    );

    return res.status(200).json({
      success: true,
      algorithm,
      timeline: result.timeline,
      metrics: {
        cpuUtilization: cpuUtil,
        averageTurnaroundTime: turnaround.averageTurnaroundTime,
        averageWaitingTime: waiting.averageWaitingTime,
        deadlineMissRatio: deadlineInfo.missRatio,
        starvationRatio: starvationInfo.starvationRatio
      },
      tasks: result.tasks
    });

  } catch (error) {
    console.error("Scheduler Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};