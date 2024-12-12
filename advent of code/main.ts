import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const lines = inputString.split("\r\n");

type key = `${number},${number}`;
const map: Record<key, string> = {};
type plot = { area: number; perimeter: number };
const perimeters: Record<string, number> = {};
type permiter = {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
};

lines.forEach((line, lineIndex) => {
  Array.from(line).forEach((char, charIndex) => {
    map[`${charIndex},${lineIndex}`] = char;
  });
});

const checked: Record<key, boolean> = {};

let recursivelyCheckPlot = (pos: `${number},${number}` = "0,0") => {
  const char = map[pos];
  if (checked[pos]) {
    return { area: 0, perimeter: 0 };
  }
  checked[pos] = true;
  const [x, y] = pos.split(",").map(Number);
  let area = 1;
  let perimeter = perimeters[pos] || 0;

  const left = `${x - 1},${y}`;
  const right = `${x + 1},${y}`;
  const top = `${x},${y - 1}`;
  const bottom = `${x},${y + 1}`;

  [left, right, top, bottom].forEach((newPos) => {
    const [i, j] = newPos.split(",").map(Number);
    if (map[`${i},${j}`] === char) {
      const { area: returnedArea, perimeter: returnedPerimeter } =
        recursivelyCheckPlot(`${i},${j}`);
      area += returnedArea;
      perimeter += returnedPerimeter;
    }
  });

  console.log(area, perimeter);
  return { area, perimeter };
};

let sum = 0;
lines.forEach((line, lineIndex) => {
  Array.from(line).forEach((char, charIndex) => {
    const { area, perimeter } = recursivelyCheckPlot(
      `${charIndex},${lineIndex}`
    );
    sum += area * perimeter;
  });
});
console.log(sum);
