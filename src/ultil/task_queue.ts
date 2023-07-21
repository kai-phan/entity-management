export class TaskQueue {
  private running: Promise<any>[];
  private completed: Promise<any>[];
  private concurrent: number;

  constructor(private tasks: Promise<any>[] = [], concurrent?: number) {
    this.running = [];
    this.completed = [];
    this.concurrent = concurrent || 1;
  }

  private canRun() {
    return this.running.length < this.concurrent && this.tasks.length > 0;
  }

  run() {
    while (this.canRun()) {
      const task = this.tasks.shift();
      if (!task) return;

      const taskPromise = task.then((res) => {
        // console.log(res);
        this.completed.push(this.running.shift()!);
        this.run();
      });

      this.running.push(taskPromise);
      console.log(`Running ${this.running.length} tasks...`);
      console.log(`Completed ${this.completed.length} tasks...`);
    }
  }

  getCompleted() {
    return this.completed;
  }

  getRunning() {
    return this.running;
  }
}

const transactionStatus = (seconds: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Transaction ${seconds}s completed`);
    }, seconds * 1000);
  });

const tasks = [
  transactionStatus(5),
  transactionStatus(15),
  transactionStatus(2),
  transactionStatus(4),
  transactionStatus(6),
  transactionStatus(9),
  transactionStatus(11),
  transactionStatus(5),
  transactionStatus(10),
];

const taskQueue = new TaskQueue(tasks, 5);

taskQueue.run();
