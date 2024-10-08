const debounce = <T extends unknown[]>(
  task: (...arg: T) => void,
  delay = 300
) => {
  let timeout: number | null = null;

  return function (this: unknown, ...args: T) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      task.apply(this, args);
    }, delay);
  };
};

export default debounce;
