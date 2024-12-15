import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const [initial, moves] = inputString.split("\r\n\r\n");

type Coord = { x: number; y: number };

type Move = "<" | ">" | "^" | "v";

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

const recursivelyCheckPosAndMove = (move: Move, pos: Coord): boolean => {
  const charToMove = map[pos.y][pos.x];
  const newPos = getNewPosFromMove(move, pos);
  const charAtNewPos = map[newPos.y][newPos.x];

  if (charAtNewPos === "#") {
    return false;
  } else if (charAtNewPos === ".") {
    map[newPos.y][newPos.x] = charToMove;
    map[pos.y][pos.x] = ".";
    if (charToMove === "@") {
      botPos = newPos;
    }
    return true;
  } else if (charAtNewPos === "O") {
    const moveSucceeded = recursivelyCheckPosAndMove(move, newPos);
    if (!moveSucceeded) {
      return false;
    }
    map[newPos.y][newPos.x] = charToMove;
    map[pos.y][pos.x] = ".";
    if (charToMove === "@") {
      botPos = newPos;
    }
    return true;
  }
  return false;
};

const map: Record<number, Record<number, string>> = {};

let botPos: Coord = { x: 0, y: 0 };

initial.split("\r\n").forEach((line, lineIndex) => {
  line.split("").forEach((char, charIndex) => {
    map[lineIndex] ??= {};
    map[lineIndex][charIndex] = char;
    if (char === "@") {
      botPos = { x: charIndex, y: lineIndex };
    }
  });
});

moves.split("").forEach((move) => {
  if (![">", "<", "^", "v"].includes(move)) return;
  console.log("Moving", move);
  recursivelyCheckPosAndMove(move as Move, botPos);
  Object.values(map).forEach((row) => {
    console.log(Object.values(row).join(""));
  });
});
let sum = 0;
Object.entries(map).forEach(([y, row]) => {
  Object.entries(row).forEach(([x, char]) => {
    if (char === "O") {
      sum += +y * 100 + +x;
    }
  });
});

console.log(sum);
