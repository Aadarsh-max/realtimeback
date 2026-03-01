export const roundRobin = (tasks, timeQuantum = 2) => {
  const queue = [];
  const remaining = tasks.map(t => ({
    ...t,
    remainingTime: t.burstTime
  }));

  const timeline = [];
  let currentTime = 0;

  while (remaining.some(t => t.remainingTime > 0)) {

    remaining.forEach(t => {
      if (t.arrivalTime === currentTime) {
        queue.push(t);
      }
    });

    if (queue.length === 0) {
      currentTime++;
      continue;
    }

    const task = queue.shift();

    const executionTime = Math.min(timeQuantum, task.remainingTime);
    const start = currentTime;
    const end = start + executionTime;

    timeline.push({ taskId: task.id, start, end });

    task.remainingTime -= executionTime;
    currentTime = end;

    if (task.remainingTime > 0) {
      queue.push(task);
    } else {
      task.completionTime = currentTime;
    }
  }

  return { timeline, tasks: remaining };
};