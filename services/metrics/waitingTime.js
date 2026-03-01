export const calculateWaitingTime = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return {
      averageWaitingTime: 0,
      tasksWithWaiting: []
    };
  }

  let totalWaitingTime = 0;

  const tasksWithWaiting = tasks.map(task => {
    const waitingTime =
      task.completionTime -
      task.arrivalTime -
      task.burstTime;

    totalWaitingTime += waitingTime;

    return {
      ...task,
      waitingTime
    };
  });

  const averageWaitingTime =
    totalWaitingTime / tasks.length;

  return {
    averageWaitingTime: Number(
      averageWaitingTime.toFixed(2)
    ),
    tasksWithWaiting
  };
};