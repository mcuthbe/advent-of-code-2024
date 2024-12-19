import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const [optionsString, designsString] = inputString.split(`

`);
const options = optionsString.split(", ");
const designs = designsString.split("\n");

const recursivelyBuildDesign = (
  target: string,
  current: string = ""
): boolean => {
  if (current === target) {
    return true;
  } else if (current.length > target.length || !target.startsWith(current)) {
    return false;
  }
  return options.some((option) => {
    return recursivelyBuildDesign(target, current + option);
  });
};

let possibles = 0;
designs.forEach((design, index) => {
  console.log(index);
  if (recursivelyBuildDesign(design)) {
    possibles++;
  }
});
console.log(possibles);
