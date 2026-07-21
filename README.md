# Real-Time Task Scheduler - Backend

High-performance CPU scheduling simulator backend built with Node.js and Express. Implements five major CPU scheduling algorithms with real-time metric calculations, timeline generation, and comprehensive performance analysis for operating system education and analysis.

## Project Overview

This backend service powers an interactive CPU scheduling simulator designed as a 4th semester capstone project. It processes user-provided process details and executes simulations of different CPU scheduling algorithms, returning detailed timeline visualizations and performance metrics. The system demonstrates both operating systems concepts and algorithm analysis techniques.

## Key Features

**Algorithm Implementation**
- FCFS (First Come First Serve)
- SJF Non-Preemptive (Shortest Job First)
- SJF Preemptive (Shortest Remaining Time First / SRTF)
- Priority Scheduling (with aging support)
- Round Robin with configurable time quantum

**Comprehensive Metrics Calculation**
- Waiting time per process
- Turnaround time calculation
- CPU utilization percentage
- Average waiting time across all processes
- Starvation detection and reporting
- Deadline miss ratio for real-time tasks

**Timeline Generation**
- Gantt chart data structure
- Execution order with timestamps
- Context switch tracking
- Process state transitions

**Performance Analysis**
- Algorithm comparison data
- Time complexity analysis
- Optimization suggestions
- Visual timeline export data

## Tech Stack

**Core**
- Node.js - JavaScript runtime
- Express.js - REST API framework
- JavaScript (ES6+) - Algorithm implementation

**Development**
- npm - Package manager
- Nodemon - Auto-reload for development
- Dotenv - Environment variable management

**No Database**
- In-memory computation only
- No persistence needed (simulation data is temporary)
- All calculations done at request time

## Architecture Overview

**Stateless Design**
- Each request is independent
- No session state required
- Highly scalable for concurrent simulations

**Algorithm Engine**
- Core scheduling logic in separate modules
- Each algorithm encapsulated independently
- Consistent interface across all algorithms

**Metrics Calculator**
- Processes algorithm output
- Computes performance metrics
- Formats results for frontend

**Validation Layer**
- Input validation for process data
- Algorithm parameter verification
- Error handling and response formatting

## How It Works

**Request Flow**

```
1. Frontend sends process array and algorithm choice
2. Backend validates input data
3. Scheduler algorithm processes the data
4. Metrics calculator computes statistics
5. Gantt chart timeline generated
6. Results sent back to frontend
```

**Scheduling Algorithm Workflow**

```
Process Array → Schedule Execution → Calculate Metrics → Generate Timeline → Return JSON
```

## Scheduling Algorithms Detailed

### FCFS (First Come First Serve)

**Algorithm Logic**
```
1. Sort processes by arrival time
2. Execute processes in arrival order
3. Each process runs to completion
4. Move to next process when current completes
```

**Implementation Details:**
- Time Complexity: O(n) for execution, O(n log n) if sorting needed
- Space Complexity: O(n)
- Data Structure: Queue (FIFO)

**Characteristics:**
- Non-preemptive (no interruptions)
- Simple and deterministic
- No process starvation
- High waiting time for shorter jobs

**Performance Issues:**
- Convoy effect: short jobs wait behind long jobs
- Poor average waiting time
- Unsuitable for interactive systems

**Viva Answer:** "FCFS executes processes sequentially in arrival order without preemption using a queue structure. It guarantees no starvation but suffers from high waiting time due to the convoy effect, making it unsuitable for modern multitasking systems."

---

### SJF Non-Preemptive (Shortest Job First)

**Algorithm Logic**
```
1. Among all available processes, select one with minimum burst time
2. Execute selected process completely
3. Repeat until all processes complete
```

**Implementation Details:**
- Time Complexity: O(n²) simple implementation, O(n log n) with heap
- Space Complexity: O(n)
- Data Structure: Priority Queue or sorted array
- Greedy Algorithm approach

**Characteristics:**
- Non-preemptive
- Optimal for minimizing average waiting time
- Requires knowing burst time in advance
- Can lead to starvation of long processes

**Performance Benefits:**
- Lowest average waiting time among non-preemptive algorithms
- Efficient for batch processing
- Good for systems where burst time is predictable

**Limitations:**
- Starvation: longer processes may never execute
- Requires burst time prediction (not available in real systems)
- Context switching overhead when switching to shortest job

**Viva Answer:** "SJF uses a greedy approach selecting the shortest job first (O(n²) or O(n log n) with heap). While it minimizes average waiting time optimally, it causes starvation of longer processes and requires burst time knowledge unavailable in real systems."

---

### SRTF (Shortest Remaining Time First / SJF Preemptive)

**Algorithm Logic**
```
1. At each time unit, select process with minimum remaining burst time
2. If new process arrives with shorter remaining time, preempt current process
3. Switch to shorter remaining time process
4. Repeat until all processes complete
```

**Implementation Details:**
- Time Complexity: O(n log n) due to priority queue operations
- Space Complexity: O(n)
- Data Structure: Min Heap / Priority Queue
- Preemptive scheduling

**Characteristics:**
- Preemptive (allows interruptions)
- Best average waiting time among all algorithms
- More context switches than non-preemptive versions
- Still allows starvation of long processes
- Requires dynamic burst time information

**Performance Advantages:**
- Optimal average waiting time
- Better responsiveness than SJF
- Efficient CPU utilization
- Reduces idle time

**Overhead & Issues:**
- Context switching overhead (more than SJF)
- Requires tracking remaining burst time
- Starvation still possible
- More complex implementation

**Viva Answer:** "SRTF improves SJF by adding preemption, always selecting the process with shortest remaining time using a min-heap (O(n log n)). This achieves optimal average waiting time but introduces context switching overhead and still risks starvation."

---

### Priority Scheduling

**Algorithm Logic**
```
1. Assign priority value to each process
2. Select highest priority process available
3. Execute (either preemptive or non-preemptive)
4. On new process arrival, if higher priority → preempt current
5. If no process executes, increment priority (aging) to prevent starvation
```

**Implementation Details:**
- Time Complexity: O(n log n) with priority queue
- Space Complexity: O(n)
- Data Structure: Priority Queue / Heap
- Static or dynamic priority assignment

**Characteristics:**
- Flexible priority assignment
- Can be preemptive or non-preemptive
- Suitable for important task prioritization
- Subject to starvation without mitigation

**Starvation Problem:**
- Low priority processes may never execute
- Solution: Aging - increase priority over time
- Aging ensures eventual execution

**Implementation Options:**
- Static priority: assigned at process creation
- Dynamic priority: changes during execution
- Aging: periodic priority increase

**Performance:**
- Good for systems with mixed importance tasks
- Real-time systems use this heavily
- Suitable for OS task management

**Viva Answer:** "Priority scheduling assigns CPU based on priority levels using a priority queue. While effective for important task execution, it causes starvation of low-priority processes, solved through aging techniques that periodically increase priority over time."

---

### Round Robin (RR)

**Algorithm Logic**
```
1. Set fixed time quantum (time slice)
2. Select process from front of queue
3. Execute for time quantum
4. If process not finished, move to back of queue
5. If process finished, remove from queue
6. Repeat until queue empty
```

**Implementation Details:**
- Time Complexity: O(n × number_of_cycles) where cycles = total_time / time_quantum
- Space Complexity: O(n)
- Data Structure: Circular Queue
- Each process gets equal CPU time

**Characteristics:**
- Fair scheduling (all processes get equal time)
- Preemptive
- No starvation (guaranteed CPU access)
- Suitable for time-sharing systems
- Performance depends on time quantum selection

**Time Quantum Impact:**

| Time Quantum | Effect |
|-------------|--------|
| Very small | High context switching overhead, wasted CPU time |
| Optimal | Good balance between fairness and efficiency |
| Large | Behaves like FCFS, unfair to short jobs |
| Very large | One process may complete before switching |

**Performance Characteristics:**
- Average waiting time: medium (between FCFS and SJF)
- Fairness: excellent (equal CPU time for all)
- Starvation: none (guaranteed execution)
- Context switches: many (depends on quantum)
- Responsiveness: good for interactive systems

**Implementation Considerations:**
- Queue management critical for performance
- Time quantum selection affects overall performance
- Context switch overhead significant
- Suitable for multitasking and interactive systems

**Viva Answer:** "Round Robin uses a circular queue, giving each process fixed time quantum. While ensuring fairness and preventing starvation, performance heavily depends on time quantum selection: too small causes overhead, too large behaves like FCFS."

---

## Metrics Calculation

### Waiting Time

**Definition:** Total time a process spends in ready queue waiting for CPU.

**Formula:**
```
Waiting Time = Turnaround Time - Burst Time
```

**Calculation Method:**
- Track when process starts execution
- Track when process arrives
- Subtract arrival to start = wait time
- Or use: Turnaround time - Burst time

**Importance:**
- Key metric for system responsiveness
- Lower is better
- Varies significantly between algorithms

### Turnaround Time

**Definition:** Total time from process arrival to completion.

**Formula:**
```
Turnaround Time = Completion Time - Arrival Time
```

**Includes:**
- Waiting in queue
- Actual execution
- Any preemption periods

**Characteristics:**
- Always ≥ Burst Time
- Indicates total process overhead
- Used to calculate average system efficiency

### CPU Utilization

**Definition:** Percentage of time CPU is busy executing processes.

**Formula:**
```
CPU Utilization = (Total Busy Time / Total Available Time) × 100
```

**Calculation:**
- Total Busy Time = sum of all process burst times
- Total Available Time = completion time of last process
- Idle time = Total Time - Total Busy Time

**Range:** 0-100%
**Goal:** Maximize utilization (higher is better)

### Starvation

**Definition:** A process that never gets CPU time due to scheduling algorithm bias.

**When It Occurs:**
- Priority Scheduling: low priority processes starved
- SJF/SRTF: long processes may never execute
- FCFS/RR: prevents starvation

**Detection:**
- If process never enters execution state
- If process repeatedly preempted
- If time exceeds maximum expected time

**Solutions:**
- Aging (increase priority over time)
- Guaranteed minimum CPU time
- Separate queues for different priorities

### Deadline Miss Ratio

**Definition:** For real-time systems, percentage of tasks missing deadlines.

**Calculation:**
```
Deadline Miss Ratio = (Tasks Missed / Total Tasks) × 100
```

**Critical For:**
- Real-time systems (robots, medical devices)
- Multimedia systems (video playback)
- Safety-critical systems

## API Endpoints

### Simulate Scheduling

**Endpoint:** `POST /api/schedule`

**Request Body:**
```json
{
  "processes": [
    {
      "id": 1,
      "arrivalTime": 0,
      "burstTime": 8,
      "priority": 3
    }
  ],
  "algorithm": "fcfs",
  "timeQuantum": 4
}
```

**Response:**
```json
{
  "algorithm": "fcfs",
  "timeline": [
    {
      "processId": 1,
      "startTime": 0,
      "endTime": 8
    }
  ],
  "metrics": {
    "avgWaitTime": 0,
    "avgTurnaroundTime": 8,
    "cpuUtilization": 100,
    "starvation": false
  }
}
```

## Environment Setup

Create `.env` file:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Installation & Setup

```bash
# Clone repository
git clone https://github.com/yourusername/task-scheduler-backend.git
cd task-scheduler-backend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

**Core Modules**
- Scheduling algorithms (FCFS, SJF, SRTF, Priority, RR)
- Metrics calculator
- Timeline generator
- Input validator

**API Layer**
- Express routes
- Request handlers
- Response formatters

**Utilities**
- Helper functions
- Data formatters
- Error handlers

## Testing

```bash
# Run tests
npm test

# Run specific algorithm tests
npm test -- fcfs

# Generate coverage report
npm run test:coverage
```

## Performance Considerations

**Algorithm Efficiency:**
- FCFS: O(n) - fastest
- SJF: O(n²) - slower
- SRTF: O(n log n) - balanced
- Priority: O(n log n) - balanced
- RR: O(n × cycles) - depends on quantum

**Optimization Strategies:**
- Cache sorting results
- Use efficient data structures (heaps)
- Lazy evaluation of metrics
- Batch process multiple simulations

## Deployment

Deployed on server (Render, Heroku, or custom):
- Environment variables configured
- CORS enabled for frontend
- Error logging enabled
- Monitoring setup

## Why No Database?

This simulation requires no database because:
- Data is temporary (simulated only)
- All computation happens in-memory
- No persistence needed
- No user accounts or history tracking
- Stateless design allows horizontal scaling

**Viva Answer:** "We used an in-memory computation model without database because scheduling simulation data is temporary and computation-focused; all results are calculated at request time without persistence requirements."

## Key Design Decisions

**In-Memory Processing**
- Faster computation
- No I/O overhead
- Suitable for simulations

**Algorithm Modularity**
- Each algorithm independent
- Easy to add new algorithms
- Consistent interface

**Metrics Calculation**
- Computed after scheduling
- Flexible output formatting
- Easy to extend

**REST API**
- Stateless requests
- Horizontal scalability
- Easy frontend integration

## Real-World Applications

These concepts apply to:
- Operating System design
- Cloud computing resource allocation
- Job scheduling in distributed systems
- Real-time embedded systems
- Multimedia and interactive applications
- Server workload management

## Academic Value

Demonstrates understanding of:
- Operating Systems core concepts
- Algorithm design and analysis
- Data structures (queues, heaps)
- Performance metrics and analysis
- Backend system design
- REST API development

## Interview Preparation

This project helps explain:
- CPU scheduling algorithms and trade-offs
- Time complexity analysis
- Real-world OS concepts
- System design thinking
- Algorithm optimization techniques

## Troubleshooting

**Algorithm not producing correct results?**
- Verify input process data
- Check algorithm selection
- Review metric calculations
- Test with simple cases first

**Performance issues?**
- Profile algorithm execution time
- Optimize data structure usage
- Cache computation results
- Monitor memory usage

**API errors?**
- Check request payload format
- Verify all required fields
- Review error logs
- Test with sample data

## Future Enhancements

- Multi-level feedback queue scheduling
- Advanced real-time scheduling (EDF, Rate Monotonic)
- Simulation comparison tools
- Performance prediction algorithms
- Parallel scheduler simulation
- Machine learning for optimal parameter selection

## Contributing

Contributions welcome for:
- New scheduling algorithms
- Performance optimizations
- Improved metrics
- Documentation enhancements
- Test coverage

## References

Learning resources used:
- Operating Systems: Three Easy Pieces (OSTEP)
- Algorithm Design Manual
- Real-Time Systems textbooks
- Academic scheduling papers

---

**Built to educate and demonstrate CPU scheduling concepts through practical implementation.**
