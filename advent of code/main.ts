// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const lines = inputString.split("\r\n");

type operator = "*" | "+";

const permutator = (inputArr: operator[]) => {
  let result: string[] = [];

  const permute = (arr: operator[], m: operator[] = []) => {
    if (arr.length === 0) {
      result.push(m.join());
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

let sum = 0;

const nums = inputString.split(" ").map((n) => parseInt(n));

let newNums = [...nums];

const map: Record<number, number> = Object.values(nums).reduce(
  (acc, curr) => ({ ...acc, [curr]: acc[curr] ? acc[curr] + 1 : 1 }),
  {} as Record<number, number>
);

// const recursivelyCheckNums = (nums: number[], depth: number = 0) => {
//   if (depth === 75) {
//     return nums.length;
//   }
//   console.log(depth);
//   console.log(nums);
//   const results: number[] = nums.map((num: number) => {
//     const numString = num.toString();
//     if (num === 0) {
//       return recursivelyCheckNums([1], depth + 1);
//     } else if (numString.length % 2 === 0) {
//       return recursivelyCheckNums(
//         [
//           +numString.slice(0, numString.length / 2),
//           +numString.slice(numString.length / 2, numString.length),
//         ],
//         depth + 1
//       );
//     } else {
//       return recursivelyCheckNums([num * 2024], depth + 1);
//     }
//   });
//   return results.reduce((acc: number, cur: number) => acc + cur, 0);
// };

let newMap: Record<number, number> = { ...map };
for (let i = 1; i <= 75; i++) {
  const newMapStep: Record<number, number> = {};
  Object.entries(newMap).forEach(([num, count]) => {
    const numString = num;
    if (+num === 0) {
      newMapStep[1] = newMapStep[1] ? newMapStep[1] + count : count;
    } else if (numString.length % 2 === 0) {
      const firstHalf = +numString.slice(0, numString.length / 2);
      const secondHalf = +numString.slice(
        numString.length / 2,
        numString.length
      );
      newMapStep[firstHalf] = newMapStep[firstHalf]
        ? newMapStep[firstHalf] + count
        : count;
      newMapStep[secondHalf] = newMapStep[secondHalf]
        ? newMapStep[secondHalf] + count
        : count;
    } else {
      newMapStep[+num * 2024] = newMapStep[+num * 2024]
        ? newMapStep[+num * 2024]! + count
        : count;
    }
  });
  newMap = { ...newMapStep };
}

console.log(Object.values(newMap).reduce((acc, curr) => acc + curr, 0));
