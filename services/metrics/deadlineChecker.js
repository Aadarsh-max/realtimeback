export const checkDeadlines = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return {
      missedCount: 0,
      missRatio: 0,
      tasksWithDeadlineInfo: []
    };
  }

  let missedCount = 0;

  const tasksWithDeadlineInfo = tasks.map(task => {
    // If no deadline provided, ignore
    if (task.deadline === undefined || task.deadline === null) {
      return {
        ...task,
        deadlineMissed: false
      };
    }

    const missed = task.completionTime > task.deadline;

    if (missed) missedCount++;

    return {
      ...task,
      deadlineMissed: missed
    };
  });

  const missRatio = (missedCount / tasks.length) * 100;

  return {
    missedCount,
    missRatio: Number(missRatio.toFixed(2)),
    tasksWithDeadlineInfo
  };
};