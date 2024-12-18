import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const getNewPosFromMove = (move: Move, pos: Coord): Coord => {
  switch (move) {
    case "<":
      return { x: pos.x - 1, y: pos.y };
    case ">":
      return { x: pos.x + 1, y: pos.y };
    case "^":
      return { x: pos.x, y: pos.y - 1 };
    case "v":
      return { x: pos.x, y: pos.y + 1 };
  }
};

const directions = ["<", ">", "^", "v"] as Move[];

const lines = inputString.split("\r\n");
const width = 70;
const moves = 1024;

type Coord = { x: number; y: number };

type Move = "<" | ">" | "^" | "v";

const map: Record<number, Record<number, string>> = {};

for (let i = 0; i <= width; i++) {
  for (let j = 0; j <= width; j++) {
    map[i] = map[i] || {};
    map[i][j] = ".";
  }
}

for (let i = 0; i < moves; i++) {
  const [x, y] = lines[i].split(",").map(Number);
  map[y][x] = "#";
}

const pos: Coord = { x: 0, y: 0 };
let foundSteps = 0;
let found = false;
const queue: Step[] = [{ pos, steps: 0 }];
type Step = { pos: Coord; steps: number };

const checked: Record<number, Record<number, boolean>> = {};

Object.keys(map).forEach((y) => {
  console.log(Object.values(map[+y]).join(""));
});

while (!found && queue.length > 0) {
  const firstStep = queue[0];
  const { pos, steps } = firstStep;
  const char = map[pos.y][pos.x];
  if (pos.x === width && pos.y === width) {
    found = true;
    foundSteps = steps;
    break;
  }
  if (char === ".") {
    const validPosition = directions
      .map((direction) => {
        const newPos = getNewPosFromMove(direction, pos);
        const newChar = map[newPos.y]?.[newPos.x];
        if (newChar && newChar !== "#" && !checked[newPos.y]?.[newPos.x]) {
          checked[newPos.y] = checked[newPos.y] || {};
          checked[newPos.y][newPos.x] = true;
          return newPos;
        }
        return undefined;
      })
      .filter((position) => !!position);
    validPosition.forEach((position) => {
      queue.push({ pos: position, steps: steps + 1 });
    });
  }
  queue.shift();
}

console.log(foundSteps);
