import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const machines = inputString.split("\n\r");

type pos = { x: number; y: number };

type pushedTally = { a: number; b: number };

let recursivelyCalculateMoves = (
  currentPos: pos,
  a: pos,
  b: pos,
  prizePos: pos,
  pushedTally: pushedTally = { a: 0, b: 0 }
): "failed" | pushedTally => {
  if (currentPos.x === prizePos.x && currentPos.y === prizePos.y) {
    return pushedTally;
  }
  if (currentPos.x > prizePos.x || currentPos.y > prizePos.y) {
    return "failed";
  }
  const aPushedPos = { x: currentPos.x + a.x, y: currentPos.y + a.y };
  const bPushedPos = { x: currentPos.x + b.x, y: currentPos.y + b.y };

  const aPushedTally = recursivelyCalculateMoves(aPushedPos, a, b, prizePos, {
    a: pushedTally.a + 1,
    b: pushedTally.b,
  });
  if (aPushedTally !== "failed") {
    return aPushedTally;
  }

  const bPushedTally = recursivelyCalculateMoves(bPushedPos, a, b, prizePos, {
    a: pushedTally.a,
    b: pushedTally.b + 1,
  });

  if (bPushedTally !== "failed") {
    return bPushedTally;
  }
  return "failed";
};

recursivelyCalculateMoves = memoise(recursivelyCalculateMoves);

let sum = 0;

machines.forEach((machine, index) => {
  console.log(index);
  const prizeX = +(machine.match(/X=\d+/g)?.[0].match(/\d+/g)?.[0] ?? "");
  const prizeY = +(machine.match(/Y=\d+/g)?.[0].match(/\d+/g)?.[0] ?? "");
  const buttonALine = machine.match(/Button A.*/g)?.[0] ?? "";
  const buttonBLine = machine.match(/Button B.*/g)?.[0] ?? "";
  const aX = +(buttonALine.match(/\d+/g)?.[0] ?? "");
  const aY = +(buttonALine.match(/\d+/g)?.[1] ?? "");
  const bX = +(buttonBLine.match(/\d+/g)?.[0] ?? "");
  const bY = +(buttonBLine.match(/\d+/g)?.[1] ?? "");
  const prizePos = { x: prizeX, y: prizeY };
  const a = { x: aX, y: aY };
  const b = { x: bX, y: bY };
  const result = recursivelyCalculateMoves({ x: 0, y: 0 }, a, b, prizePos);
  if (result !== "failed") {
    sum += result.a * 3 + result.b;
  }
});

console.log(sum);
