export const calculateCPUUtilization = (timeline) => {
  if (!timeline || timeline.length === 0) {
    return 0;
  }

  // Total busy time (sum of execution durations)
  const totalBusyTime = timeline.reduce((sum, block) => {
    return sum + (block.end - block.start);
  }, 0);

  // Total simulation time (end time of last execution block)
  const totalTime = timeline[timeline.length - 1].end;

  if (totalTime === 0) return 0;

  const utilization = (totalBusyTime / totalTime) * 100;

  // Round to 2 decimal places
  return Number(utilization.toFixed(2));
};