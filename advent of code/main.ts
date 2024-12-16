import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const [initial, moves] = inputString.split("\r\n\r\n");

type Coord = { x: number; y: number };

type Map = Record<number, Record<number, string>>;
type Direction = ">" | "<" | "^" | "v";
type Location = { position: Coord; direction: Direction };

let map: Map = {};
let startPos: Coord = { x: 0, y: 0 };
let endPos: Coord = { x: 0, y: 0 };
let checked: Record<`${number},${number}`, number> = {};
let startDirection: Direction = ">";
type Move = "Go" | "Clockwise" | "CounterClockwise";

const getNewPosFromMove = (direction: Direction, pos: Coord): Coord => {
  switch (direction) {
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

const move = (position: Coord, type: Move, currentDir: Direction): Location => {
  switch (type) {
    case "Go":
      return {
        position: getNewPosFromMove(currentDir, position),
        direction: currentDir,
      };
    case "Clockwise":
      switch (currentDir) {
        case "^":
          return { position, direction: ">" };
        case ">":
          return { position, direction: "v" };
        case "v":
          return { position, direction: "<" };
        case "<":
          return { position, direction: "^" };
      }
      break;
    case "CounterClockwise":
      switch (currentDir) {
        case "^":
          return { position, direction: "<" };
        case ">":
          return { position, direction: "^" };
        case "v":
          return { position, direction: ">" };
        case "<":
          return { position, direction: "v" };
      }
      break;
  }
};

const isVertical = (direction: Direction) => {
  return direction === "^" || direction === "v";
};

const isHorizontal = (direction: Direction) => {
  return direction === ">" || direction === "<";
};

const getOppositeDirection = (direction: Direction) => {
  switch (direction) {
    case "^":
      return "v";
    case "v":
      return "^";
    case ">":
      return "<";
    case "<":
      return ">";
  }
};

const getTurns = (currentDirection: Direction, finalDirection: Direction) => {
  if (
    (isHorizontal(currentDirection) && isHorizontal(finalDirection)) ||
    (isVertical(currentDirection) && isVertical(finalDirection))
  ) {
    return 0;
  } else return 1;
};

let minScore: number | undefined = undefined;

let recursivelyCheckMoves = (currentLocation: Location, score = 0) => {
  const directions: Direction[] = [">", "<", "^", "v"];
  const { position: currentPosition } = currentLocation;
  const { x: currentX, y: currentY } = currentPosition;

  if (score >= checked[`${currentX},${currentY}`]) return;

  checked[`${currentX},${currentY}`] = score;

  directions.forEach((direction) => {
    const newPos = getNewPosFromMove(direction, currentLocation.position);

    const { x: newX, y: newY } = newPos;

    const char = map[newY]?.[newX];

    const turns = getTurns(currentLocation.direction, direction);

    const newScore =
      score +
      Math.abs(newY - currentY) +
      Math.abs(newX - currentX) +
      1000 * turns;

    if (char === "E") {
      console.log("Found the end");
      minScore = minScore ? Math.min(minScore, newScore) : newScore;
      console.log(newScore);
      return newScore;
    } else if (char === ".") {
      return recursivelyCheckMoves(
        {
          position: newPos,
          direction: direction,
        },
        newScore
      );
    }
  });
  return 0;
};

initial.split("\r\n").forEach((line, lineIndex) => {
  line.split("").forEach((char, charIndex) => {
    map[lineIndex] ??= {};
    if (char === "S") {
      startPos = { x: charIndex, y: lineIndex };
    } else if (char === "E") {
      endPos = { x: charIndex, y: lineIndex };
    }
    map[lineIndex][charIndex] = char;
  });
});

const score = recursivelyCheckMoves({ position: startPos, direction: ">" });

Object.values(map).forEach((row) => {
  console.log(Object.values(row).join(""));
});

console.log(minScore);
