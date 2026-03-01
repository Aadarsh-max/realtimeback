export class Clock {
  constructor(startTime = 0) {
    this.time = startTime;
  }

  // Get current simulation time
  getTime() {
    return this.time;
  }

  // Move clock forward by 1 unit (tick)
  tick() {
    this.time += 1;
  }

  // Move clock forward by custom units
  advance(units) {
    if (units < 0) return;
    this.time += units;
  }

  // Reset clock
  reset() {
    this.time = 0;
  }
}