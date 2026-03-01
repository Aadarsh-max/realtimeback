// services/schedulerEngine/schedulerCore.js

import { Clock } from "./clock.js";
import { Dispatcher } from "./dispatcher.js";
import { TaskManager } from "./taskManager.js";

import { PriorityQueue } from "../dataStructures/priorityQueue.js";
import { CircularQueue } from "../dataStructures/circularQueue.js";

export class SchedulerCore {
  constructor(tasks, algorithm, options = {}) {
    this.algorithm = algorithm;
    this.options = options;

    this.clock = new Clock();
    this.taskManager = new TaskManager(tasks);
    this.dispatcher = new Dispatcher(this.clock);
  }

  run() {
    switch (this.algorithm) {
      case "FCFS":
        return this.runFCFS();

      case "SJF_NON_PREEMPTIVE":
        return this.runSJFNonPreemptive();
      case "SJF_PREEMPTIVE":
        return this.runSJFPreemptive();

      case "PRIORITY":
        return this.runPriority();

      case "ROUND_ROBIN":
        return this.runRoundRobin();

      default:
        throw new Error("Invalid scheduling algorithm");
    }
  }

  // ================= FCFS =================
  runFCFS() {
    while (!this.taskManager.allCompleted()) {
      const currentTime = this.clock.getTime();
      this.taskManager.updateTaskStates(currentTime);

      const ready = this.taskManager
        .getReadyTasks()
        .sort((a, b) => a.arrivalTime - b.arrivalTime);

      if (ready.length === 0) {
        this.clock.tick();
        continue;
      }

      const task = ready[0];
      task.state = "RUNNING";

      this.dispatcher.dispatch(task, task.remainingTime);
      this.taskManager.markCompleted(task.id, this.clock.getTime());
    }

    return this.buildResult();
  }

  // ================= SJF (Optimized with Min Heap) =================
  runSJFNonPreemptive() {
    const pq = new PriorityQueue((a, b) => a.remainingTime < b.remainingTime);

    while (!this.taskManager.allCompleted()) {
      const currentTime = this.clock.getTime();
      this.taskManager.updateTaskStates(currentTime);

      const readyTasks = this.taskManager.getReadyTasks();

      readyTasks.forEach((task) => {
        if (!task.inQueue && task.remainingTime > 0) {
          pq.insert(task);
          task.inQueue = true;
        }
      });

      if (pq.isEmpty()) {
        this.clock.tick();
        continue;
      }

      const task = pq.extractMin();
      task.state = "RUNNING";

      this.dispatcher.dispatch(task, task.remainingTime);
      this.taskManager.markCompleted(task.id, this.clock.getTime());
    }

    return this.buildResult();
  }

  // ================= PRIORITY (Optimized with Min Heap) =================
  runPriority() {
    const pq = new PriorityQueue((a, b) => a.priority < b.priority);

    while (!this.taskManager.allCompleted()) {
      const currentTime = this.clock.getTime();
      this.taskManager.updateTaskStates(currentTime);

      const readyTasks = this.taskManager.getReadyTasks();

      readyTasks.forEach((task) => {
        if (!task.inQueue && task.remainingTime > 0) {
          pq.insert(task);
          task.inQueue = true;
        }
      });

      if (pq.isEmpty()) {
        this.clock.tick();
        continue;
      }

      const task = pq.extractMin();
      task.state = "RUNNING";

      this.dispatcher.dispatch(task, task.remainingTime);
      this.taskManager.markCompleted(task.id, this.clock.getTime());
    }

    return this.buildResult();
  }
  // ================= SJF PREEMPTIVE (SRTF) =================
  runSJFPreemptive() {
    const pq = new PriorityQueue((a, b) => a.remainingTime < b.remainingTime);

    while (!this.taskManager.allCompleted()) {
      const currentTime = this.clock.getTime();
      this.taskManager.updateTaskStates(currentTime);

      const readyTasks = this.taskManager.getReadyTasks();

      readyTasks.forEach((task) => {
        if (!task.inQueue && task.remainingTime > 0) {
          pq.insert(task);
          task.inQueue = true;
        }
      });

      if (pq.isEmpty()) {
        this.clock.tick();
        continue;
      }

      const task = pq.extractMin();
      task.state = "RUNNING";

      // Execute 1 time unit
      this.dispatcher.dispatch(task, 1);

      if (task.remainingTime > 0) {
        task.state = "READY";
        pq.insert(task); // reinsert with updated remaining time
      } else {
        this.taskManager.markCompleted(task.id, this.clock.getTime());
      }
    }

    return this.buildResult();
  }

  // ================= ROUND ROBIN (Optimized with Circular Queue) =================
  runRoundRobin() {
    const timeQuantum = this.options.timeQuantum || 2;
    const queue = new CircularQueue(1000);

    while (!this.taskManager.allCompleted()) {
      const currentTime = this.clock.getTime();
      this.taskManager.updateTaskStates(currentTime);

      const readyTasks = this.taskManager.getReadyTasks();

      readyTasks.forEach((task) => {
        if (!task.inQueue && task.remainingTime > 0) {
          queue.enqueue(task);
          task.inQueue = true;
        }
      });

      if (queue.isEmpty()) {
        this.clock.tick();
        continue;
      }

      const task = queue.dequeue();
      task.state = "RUNNING";

      const executionTime = Math.min(task.remainingTime, timeQuantum);

      this.dispatcher.dispatch(task, executionTime);

      if (task.remainingTime > 0) {
        task.state = "READY";
        queue.enqueue(task);
      } else {
        this.taskManager.markCompleted(task.id, this.clock.getTime());
      }
    }

    return this.buildResult();
  }

  // ================= Common Result Builder =================
  buildResult() {
    return {
      timeline: this.dispatcher.getTimeline(),
      tasks: this.taskManager.getAllTasks(),
    };
  }
}
