export const priorityScheduling = (tasks) => {
  const remaining = [...tasks];
  const timeline = [];
  let currentTime = 0;

  while (remaining.length > 0) {

    const available = remaining.filter(
      t => t.arrivalTime <= currentTime
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    available.sort((a, b) => a.priority - b.priority);
    const task = available[0];

    const start = currentTime;
    const end = start + task.burstTime;

    timeline.push({ taskId: task.id, start, end });

    task.startTime = start;
    task.completionTime = end;

    currentTime = end;

    remaining.splice(remaining.indexOf(task), 1);
  }

  return { timeline, tasks };
};