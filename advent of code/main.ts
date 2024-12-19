import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const [optionsString, designsString] = inputString.split(`

`);
const options = optionsString.split(", ");
const designs = designsString.split("\n");
let recursivelyBuildDesign = (
  target: string,
  current: string = "",
  sum = 0
): number => {
  if (current === target) {
    return sum + 1;
  } else if (current.length > target.length || !target.startsWith(current)) {
    return 0;
  }
  const sums = options.map((option) => {
    const newCurrent = current + option;
    if (newCurrent.length > target.length || !target.startsWith(newCurrent)) {
      return undefined;
    }
    return recursivelyBuildDesign(target, current + option, sum);
  });
  return sums
    .filter((sum) => sum !== undefined)
    .reduce((acc, curr) => acc + curr, 0);
};

recursivelyBuildDesign = memoise(recursivelyBuildDesign);

let sums = 0;
designs.forEach((design, index) => {
  console.log(index);

  const sum = recursivelyBuildDesign(design);
  sums += sum;
});

console.log(sums);
