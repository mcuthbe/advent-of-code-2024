export const memoise = <T extends (...args: any[]) => any>(
  functionToMemoise: T
) => {
  const cache: Record<string, ReturnType<T>> = {};
  const memoisedFunction: (...args: Parameters<T>) => ReturnType<T> = (
    ...args: unknown[]
  ) => {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    const result = functionToMemoise(...args);
    cache[key] = result;
    return result;
  };
  return memoisedFunction;
};

export const permutator = <T>(inputArr: T[]): T[][] => {
  let result: T[][] = [];

  const permute = (arr: T[], m: T[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return Array.from(new Set(result));
};
