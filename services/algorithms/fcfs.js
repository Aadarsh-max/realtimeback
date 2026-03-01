export const fcfs = (tasks) => {
  const sorted = [...tasks].sort(
    (a, b) => a.arrivalTime - b.arrivalTime
  );

  let currentTime = 0;
  const timeline = [];

  sorted.forEach(task => {
    if (currentTime < task.arrivalTime) {
      currentTime = task.arrivalTime;
    }

    const start = currentTime;
    const end = start + task.burstTime;

    timeline.push({ taskId: task.id, start, end });

    task.startTime = start;
    task.completionTime = end;

    currentTime = end;
  });

  return { timeline, tasks: sorted };
};