
export class CircularQueue {
  constructor(capacity = 1000) {
    this.capacity = capacity;
    this.queue = new Array(capacity);
    this.front = 0;
    this.rear = 0;
    this.length = 0;
  }

  size() {
    return this.length;
  }

  isEmpty() {
    return this.length === 0;
  }

  isFull() {
    return this.length === this.capacity;
  }

  enqueue(value) {
    if (this.isFull()) {
      throw new Error("Queue Overflow");
    }

    this.queue[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    this.length++;
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const value = this.queue[this.front];
    this.front = (this.front + 1) % this.capacity;
    this.length--;

    return value;
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.queue[this.front];
  }

  clear() {
    this.front = 0;
    this.rear = 0;
    this.length = 0;
    this.queue = new Array(this.capacity);
  }
}