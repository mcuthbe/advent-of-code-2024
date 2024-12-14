import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const lines = inputString.split("\r\n");

const width = 101;
const height = 103;
const seconds = 100;

type Coords = { x: number; y: number };
const positions: Record<number, Coords> = {};
const velocities: Record<number, Coords> = {};

lines.forEach((line, index) => {
  const [left, right] = line.split(" ");
  const [x, y] = left.split("=")[1].split(",").map(Number);
  const [vX, vY] = right.split("=")[1].split(",").map(Number);
  const id = index;
  positions[id] = { x, y };
  velocities[id] = { x: vX, y: vY };
});

for (let i = 1; i <= seconds; i++) {
  Object.entries(velocities).forEach(([id, velocity]) => {
    const position = positions[+id];
    position.x += velocity.x;
    position.y += velocity.y;
    if (position.x < 0) {
      position.x = position.x + width;
    }
    if (position.y < 0) {
      position.y = position.y + height;
    }
    if (position.x >= width) {
      position.x = position.x - width;
    }
    if (position.y >= height) {
      position.y = position.y - height;
    }
  });
}

console.log(positions);

const quadrants: Record<1 | 2 | 3 | 4, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

Object.entries(positions).forEach(([id, position]) => {
  console.log(position);
  if (
    position.x < Math.ceil(width / 2) - 1 &&
    position.y < Math.ceil(height / 2) - 1
  ) {
    quadrants[1] = (quadrants[1] || 0) + 1;
    console.log("1");
  } else if (
    position.x > Math.ceil(width / 2) - 1 &&
    position.y < Math.ceil(height / 2) - 1
  ) {
    quadrants[2] = (quadrants[2] || 0) + 1;
    console.log("2");
  } else if (
    position.x < Math.ceil(width / 2) - 1 &&
    position.y > Math.ceil(height / 2) - 1
  ) {
    quadrants[3] = (quadrants[3] || 0) + 1;
    console.log("3");
  } else if (
    position.x > Math.ceil(width / 2) - 1 &&
    position.y > Math.ceil(height / 2) - 1
  ) {
    quadrants[4] = (quadrants[4] || 0) + 1;
    console.log("4");
  }
});

console.log(quadrants[1], quadrants[2], quadrants[3], quadrants[4]);
console.log(quadrants[1] * quadrants[2] * quadrants[3] * quadrants[4]);
