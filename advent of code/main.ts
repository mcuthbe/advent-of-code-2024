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

type Map = Record<number, Record<number, string>>;
let map: Map = {};
let mapClone: Map = {};
let checked: Record<number, Record<number, boolean>> = {};

let recursivelyCheckPosAndMove = (move: Move, pos: Coord): boolean => {
  const isChecked = checked[pos.y]?.[pos.x];
  if (isChecked) {
    return isChecked;
  }
  checked[pos.y] ??= {};
  checked[pos.y][pos.x] = true;
  const charToMove = mapClone[pos.y][pos.x];
  const newPos = getNewPosFromMove(move, pos);
  const charAtNewPos = mapClone[newPos.y]?.[newPos.x];
  if (!charAtNewPos) {
    return false;
  }

  if (charAtNewPos === "#") {
    return false;
  } else if (charAtNewPos === ".") {
    mapClone[newPos.y][newPos.x] = charToMove;
    mapClone[pos.y][pos.x] = ".";
    if (charToMove === "@") {
      botPos = newPos;
    }
    return true;
  } else if (charAtNewPos === "[") {
    const moveSucceededL = recursivelyCheckPosAndMove(move, newPos);
    const moveSucceededR = recursivelyCheckPosAndMove(move, {
      ...newPos,
      x: newPos.x + 1,
    });
    if (!moveSucceededL || !moveSucceededR) {
      return false;
    }
    mapClone[newPos.y][newPos.x] = charToMove;
    mapClone[pos.y][pos.x] = ".";
    if (charToMove === "@") {
      botPos = newPos;
    }
    return true;
  } else if (charAtNewPos === "]") {
    const moveSucceededL = recursivelyCheckPosAndMove(move, {
      ...newPos,
      x: newPos.x - 1,
    });
    const moveSucceededR = recursivelyCheckPosAndMove(move, newPos);
    if (!moveSucceededL || !moveSucceededR) {
      return false;
    }
    mapClone[newPos.y][newPos.x] = charToMove;
    mapClone[pos.y][pos.x] = ".";
    if (charToMove === "@") {
      botPos = newPos;
    }
    return true;
  }
  return false;
};

let botPos: Coord = { x: 0, y: 0 };

initial.split("\r\n").forEach((line, lineIndex) => {
  line.split("").forEach((char, charIndex) => {
    const wideX = 2 * charIndex;
    map[lineIndex] ??= {};
    if (char === "@") {
      botPos = { x: wideX, y: lineIndex };
      map[lineIndex][wideX] = "@";
      map[lineIndex][wideX + 1] = ".";
    } else if (char === "O") {
      map[lineIndex][wideX] = "[";
      map[lineIndex][wideX + 1] = "]";
    } else {
      map[lineIndex][wideX] = char;
      map[lineIndex][wideX + 1] = char;
    }
  });
});

moves.split("").forEach((move) => {
  if (![">", "<", "^", "v"].includes(move)) return;

  console.log("Moving " + move);

  mapClone = JSON.parse(JSON.stringify(map));
  checked = {};

  const succeeded = recursivelyCheckPosAndMove(move as Move, botPos);
  if (succeeded) {
    map = mapClone;
  }

  // Object.values(map).forEach((row) => {
  //   console.log(Object.values(row).join(""));
  // });
});

let sum = 0;
Object.entries(map).forEach(([y, row]) => {
  Object.entries(row).forEach(([x, char]) => {
    if (char === "[") {
      sum += +y * 100 + +x;
    }
  });
});

console.log(sum);
