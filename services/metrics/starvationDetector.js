export const detectStarvation = (tasks, threshold = 10) => {
  if (!tasks || tasks.length === 0) {
    return {
      starvedCount: 0,
      starvationRatio: 0,
      tasksWithStarvationInfo: []
    };
  }

  let starvedCount = 0;

  const tasksWithStarvationInfo = tasks.map(task => {
    const waitingTime =
      task.startTime !== undefined
        ? task.startTime - task.arrivalTime
        : 0;

    const isStarved = waitingTime > threshold;

    if (isStarved) starvedCount++;

    return {
      ...task,
      waitingTime,
      starved: isStarved
    };
  });

  const starvationRatio = (starvedCount / tasks.length) * 100;

  return {
    starvedCount,
    starvationRatio: Number(starvationRatio.toFixed(2)),
    tasksWithStarvationInfo
  };
};