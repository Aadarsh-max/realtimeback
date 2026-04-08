export const roundRobin = (tasks, timeQuantum = 2) => {
  const queue = [];
  const remaining = tasks.map(t => ({
    ...t,
    remainingTime: t.burstTime,
    added: false //  track if already added
  }));

  const timeline = [];
  let currentTime = 0;

  // initially add first arriving processes
  remaining.forEach(t => {
    if (t.arrivalTime === 0) {
      queue.push(t);
      t.added = true;
    }
  });

  while (remaining.some(t => t.remainingTime > 0)) {

    if (queue.length === 0) {
      currentTime++;
      remaining.forEach(t => {
        if (t.arrivalTime <= currentTime && !t.added) {
          queue.push(t);
          t.added = true;
        }
      });
      continue;
    }

    const task = queue.shift();

    const start = currentTime;
    const executionTime = Math.min(timeQuantum, task.remainingTime);
    const end = start + executionTime;

    timeline.push({ taskId: task.id, start, end });

    task.remainingTime -= executionTime;
    currentTime = end;

    // add newly arrived processes during execution
    remaining.forEach(t => {
      if (t.arrivalTime <= currentTime && !t.added) {
        queue.push(t);
        t.added = true;
      }
    });

    // First add newly arrived processes
remaining.forEach(t => {
  if (t.arrivalTime <= currentTime && !t.added) {
    queue.push(t);
    t.added = true;
  }
});

if (task.remainingTime > 0) {
  queue.push(task);
} else {
      task.completionTime = currentTime;
    }
  }

  return { timeline, tasks: remaining };
};