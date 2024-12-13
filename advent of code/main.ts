import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const machines = inputString.split("\n\r");

type pos = { x: number; y: number };

type pushedTally = { a: number; b: number };

let sum = 0;

machines.forEach((machine, index) => {
  console.log(index);
  const prizeX =
    +(machine.match(/X=\d+/g)?.[0].match(/\d+/g)?.[0] ?? "") + 10000000000000;
  const prizeY =
    +(machine.match(/Y=\d+/g)?.[0].match(/\d+/g)?.[0] ?? "") + 10000000000000;
  const buttonALine = machine.match(/Button A.*/g)?.[0] ?? "";
  const buttonBLine = machine.match(/Button B.*/g)?.[0] ?? "";
  const aX = +(buttonALine.match(/\d+/g)?.[0] ?? "");
  const aY = +(buttonALine.match(/\d+/g)?.[1] ?? "");
  const bX = +(buttonBLine.match(/\d+/g)?.[0] ?? "");
  const bY = +(buttonBLine.match(/\d+/g)?.[1] ?? "");
  const prizePos = { x: prizeX, y: prizeY };
  // can be graphed y = ax + c and y = bx +d
  // intersection x = (d - c)/(a - n)
  const a = -aX / bX;
  const c = prizePos.x / bX;
  const b = -aY / bY;
  const d = prizePos.y / bY;
  if (a === b) {
    // lines parallel
    return;
  }
  const intersectionX = Math.round((d - c) / (a - b));
  //x can be used to find y from either line
  const intersectionY = Math.round(a * intersectionX + c);

  console.log(Math.round(intersectionX), Math.round(intersectionY));

  if (
    intersectionX * aX + intersectionY * bX !== prizePos.x ||
    intersectionX * aY + intersectionY * bY !== prizePos.y
  ) {
    return;
  }
  console.log(intersectionX, intersectionY);
  console.log(a, b, c, d);
  sum += intersectionX * 3 + intersectionY;
});

console.log(sum);
