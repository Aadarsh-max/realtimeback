export const sjfPreemptive = (tasks) => {
  const remaining = tasks.map(t => ({
    ...t,
    remainingTime: t.burstTime
  }));

  const timeline = [];
  let currentTime = 0;

  while (remaining.some(t => t.remainingTime > 0)) {

    const available = remaining.filter(
      t => t.arrivalTime <= currentTime && t.remainingTime > 0
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    available.sort((a, b) => a.remainingTime - b.remainingTime);
    const task = available[0];

    const start = currentTime;
    task.remainingTime--;
    currentTime++;

    timeline.push({ taskId: task.id, start, end: currentTime });

    if (task.remainingTime === 0) {
      task.completionTime = currentTime;
    }
  }

  return { timeline, tasks: remaining };
};