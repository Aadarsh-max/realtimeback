export const calculateTurnaroundTime = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return {
      averageTurnaroundTime: 0,
      tasksWithTurnaround: []
    };
  }

  let totalTurnaround = 0;

  const tasksWithTurnaround = tasks.map(task => {
    const turnaroundTime =
      task.completionTime - task.arrivalTime;

    totalTurnaround += turnaroundTime;

    return {
      ...task,
      turnaroundTime
    };
  });

  const averageTurnaroundTime =
    totalTurnaround / tasks.length;

  return {
    averageTurnaroundTime: Number(
      averageTurnaroundTime.toFixed(2)
    ),
    tasksWithTurnaround
  };
};