export class Dispatcher {
  constructor(clock) {
    this.clock = clock;
    this.timeline = [];
  }

  // Execute a task for a given duration
  dispatch(task, duration) {
    const start = this.clock.getTime();
    const end = start + duration;

    // Record execution in timeline
    this.timeline.push({
      taskId: task.id,
      start,
      end
    });

    // Update task state
    task.startTime = task.startTime ?? start;
    task.remainingTime =
      task.remainingTime !== undefined
        ? task.remainingTime - duration
        : 0;

    task.lastExecutedAt = end;

    // Advance simulation time
    this.clock.advance(duration);

    // If task finished
    if (task.remainingTime === 0) {
      task.completionTime = end;
      task.state = "COMPLETED";
    } else {
      task.state = "READY";
    }
  }

  // Return execution timeline
  getTimeline() {
    return this.timeline;
  }

  // Reset timeline
  reset() {
    this.timeline = [];
  }
}