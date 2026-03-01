export class TaskManager {
  constructor(tasks) {
    this.tasks = tasks.map(task => ({
      ...task,
      state: "NEW",                 // NEW → READY → RUNNING → COMPLETED
      remainingTime: task.burstTime,
      startTime: null,
      completionTime: null
    }));
  }

  // Get all tasks
  getAllTasks() {
    return this.tasks;
  }

  // Update task states based on current time
  updateTaskStates(currentTime) {
    this.tasks.forEach(task => {
      if (task.state === "NEW" && task.arrivalTime <= currentTime) {
        task.state = "READY";
      }
    });
  }

  // Get tasks that are ready to execute
  getReadyTasks() {
    return this.tasks.filter(task => task.state === "READY");
  }

  // Mark a task as running
  markRunning(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.state = "RUNNING";
      if (task.startTime === null) {
        task.startTime = task.lastExecutedAt ?? 0;
      }
    }
  }

  // Mark task as completed
  markCompleted(taskId, completionTime) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.state = "COMPLETED";
      task.remainingTime = 0;
      task.completionTime = completionTime;
    }
  }

  // Check if all tasks finished
  allCompleted() {
    return this.tasks.every(task => task.state === "COMPLETED");
  }
}