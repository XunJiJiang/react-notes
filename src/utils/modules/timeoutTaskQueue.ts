interface Task {
  timeout: number;
  callback: () => void;
}

/**
 * 创建延时任务队列，按照添加任务的顺序执行
 */
class TimeoutTaskQueue {
  private promise: [Promise<void>, () => void] | [null, null] = [null, null];

  private finallyCallback: (() => void) | null = null;

  private isRan = false;

  constructor() {
    this.promise[0] = new Promise((resolve) => {
      this.promise[1] = resolve;
    });
  }

  addTask({ timeout, callback }: Task): TimeoutTaskQueue {
    const task = { timeout, callback };
    this.promise[0] = this.promise[0]!.then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          task.callback();
          resolve();
        }, task.timeout);
      });
    });
    return this;
  }

  finally(callback: () => void): TimeoutTaskQueue {
    if (this.finallyCallback) {
      throw new Error('TimeoutTaskQueue: finally callback already exists');
    }
    this.finallyCallback = callback;
    return this;
  }

  run(): void {
    if (this.isRan) {
      throw new Error('TimeoutTaskQueue: already ran');
    }
    this.promise[0]!.finally(() => {
      this.finallyCallback?.();
      this.isRan = true;
    });
    this.promise[1]!();
  }
}

export default TimeoutTaskQueue;
