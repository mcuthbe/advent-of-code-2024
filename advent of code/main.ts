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
let checked: Record<`${number},${number},${Direction}`, number> = {};
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

const isVertical = (direction: Direction) => {
  return direction === "^" || direction === "v";
};

const pos: Coord = { x: 0, y: 0 };

const getTurns = (currentDirection: Direction, finalDirection: Direction) => {
  if (
    (isHorizontal(currentDirection) && isHorizontal(finalDirection)) ||
    (isVertical(currentDirection) && isVertical(finalDirection))
  ) {
    return currentDirection === finalDirection ? 0 : 2;
  } else return 1;
};

type Queue = Set<{ location: Location; steps: string; score: number }>;

const scoreSeats: Record<number, string> = {};

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

let minScore = Infinity;

const queue: Queue = new Set([
  { location: { position: startPos, direction: ">" }, steps: ``, score: 0 },
]);

while (queue.size) {
  if (queue.size % 10000 === 0) {
    console.log(queue.size);
  }
  const current = queue.values().next().value;
  queue.delete(current!);

  if (!current) continue;

  const { location, steps, score } = current;
  const { position, direction: currentDirection } = location;
  if (score > checked[`${position.y},${position.x},${currentDirection}`]) {
    continue;
  }
  checked[`${position.y},${position.x},${currentDirection}`] = score;
  // console.log(position);
  const { x, y } = position;

  // console.log(steps);
  const char = map[y][x];

  // console.log({ x, y, currentDirection, char, score, steps });
  if (score > minScore) {
    continue;
  }

  if (char === "E") {
    console.log("found");
    if (score < minScore) {
      minScore = score;
    }
    scoreSeats[score] ??= "";
    scoreSeats[score] = scoreSeats[score] + steps;
  } else if (!char || char === "#") {
    continue;
  } else {
    const validDirections = ([">", "<", "^", "v"] as Direction[]).filter(
      (direction) => {
        const newPos = getNewPosFromMove(direction, location.position);
        // if (steps.split("|").includes(`${newPos.y},${newPos.x}`)) {
        //   return false;
        // }
        const { x: newX, y: newY } = newPos;
        const char = map[newY]?.[newX];
        return char !== "#" && char !== undefined;
      }
    );

    validDirections.forEach((direction) => {
      if (!direction) return;
      const newPos = getNewPosFromMove(direction, location.position);

      const { x: newX, y: newY } = newPos;
      const turns = getTurns(currentDirection, direction);

      const newScore =
        score + Math.abs(newY - y) + Math.abs(newX - x) + 1000 * turns;

      queue.add({
        location: { position: newPos, direction },
        steps: steps + `|${newY},${newX}`,
        score: newScore,
      });
    });
  }
}

const minScoreSeatsScore = Math.min(...Object.keys(scoreSeats).map(Number));
const seats = new Set(scoreSeats[minScoreSeatsScore].split("|"));

console.log(scoreSeats);

Object.values(map).forEach((row, rowIndex) => {
  console.log(
    Object.values(row)
      .map((char, charIndex) => {
        if (Array.from(seats).includes(`${rowIndex},${charIndex}`)) {
          return "O";
        }
        return char;
      })
      .join("")
  );
});

console.log(seats.size);
