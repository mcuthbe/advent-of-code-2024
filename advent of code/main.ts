import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const lines = inputString.split("\r\n");

const width = 101;
const height = 103;

type Coords = { x: number; y: number };
type Positions = Record<number, Coords>;
type PositionCoords = Record<number, number>;
const positions: Positions = {};
const velocities: Positions = {};
let positionCoords: PositionCoords = {};

lines.forEach((line, index) => {
  const [left, right] = line.split(" ");
  const [x, y] = left.split("=")[1].split(",").map(Number);
  const [vX, vY] = right.split("=")[1].split(",").map(Number);
  const id = index;
  positions[id] = { x, y };
  velocities[id] = { x: vX, y: vY };
});

let getNextPosition = (position: Coords, velocity: Coords) => {
  const newPosition = {
    x: position.x + velocity.x,
    y: position.y + velocity.y,
  };
  if (newPosition.x < 0) {
    newPosition.x = newPosition.x + width;
  }
  if (newPosition.y < 0) {
    newPosition.y = newPosition.y + height;
  }
  if (newPosition.x >= width) {
    newPosition.x = newPosition.x - width;
  }
  if (newPosition.y >= height) {
    newPosition.y = newPosition.y - height;
  }
  return newPosition;
};

getNextPosition = memoise(getNextPosition);

let secondsElapsed = 0;

var encoder = new TextEncoder();

while (secondsElapsed < 130000) {
  secondsElapsed++;
  positionCoords = {};
  Object.entries(velocities).forEach(([id, velocity]) => {
    const position = positions[+id];
    const newPosition = getNextPosition(position, velocity);
    positions[+id] = newPosition;
    positionCoords[newPosition.y] = positionCoords[newPosition.y]
      ? positionCoords[newPosition.y] + 1
      : 1;
  });
  console.log(secondsElapsed);
  if ((secondsElapsed - 48)%101 === 0 || (secondsElapsed - 1) % 103 === 0){//I don't know why, just looks like it based on output
    let map = "";
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const found = Object.values(positions).find(
          (position) => position.x === x && position.y === y
        );
        map += found ? "#" : ".";
      }
      map += "\n";
    }
    console.log(secondsElapsed);
    var data = encoder.encode(secondsElapsed + "\n" + map);
    Deno.writeFile("outputLMults.txt", data, { append: true });
  }
}

console.log(secondsElapsed);
