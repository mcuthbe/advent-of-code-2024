import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const lines = inputString.split("\r\n");
type locationKey = "top" | "bottom" | "left" | "right";

type Key = `${number},${number}`;
const map: Record<Key, string> = {};
type PerimeterMap = Record<`${number}a` | `${number}b`, Set<number>>;

lines.forEach((line, lineIndex) => {
  Array.from(line).forEach((char, charIndex) => {
    map[`${charIndex},${lineIndex}`] = char;
  });
});

const checked: Record<Key, boolean> = {};

const recursivelyCheckPlot = (
  pos: `${number},${number}` = "0,0",
  horizontalPerimeterMap: PerimeterMap,
  verticalPerimeterMap: PerimeterMap
) => {
  const char = map[pos];
  if (checked[pos]) {
    return { area: 0, perimeters: {}, sides: 0 };
  }
  checked[pos] = true;
  const [x, y] = pos.split(",").map(Number);
  let area = 1;

  const locations: Record<locationKey, Key> = {} as Record<locationKey, Key>;

  locations["left"] = `${x - 1},${y}`;
  locations["right"] = `${x + 1},${y}`;
  locations["top"] = `${x},${y - 1}`;
  locations["bottom"] = `${x},${y + 1}`;

  if (map[locations["left"]] !== char) {
    verticalPerimeterMap[`${x}a`] ??= new Set();
    verticalPerimeterMap[`${x}a`].add(y);
  }
  if (map[locations["right"]] !== char) {
    verticalPerimeterMap[`${x}b`] ??= new Set();
    verticalPerimeterMap[`${x}b`].add(y);
  }
  if (map[locations["top"]] !== char) {
    horizontalPerimeterMap[`${y}a`] ??= new Set();
    horizontalPerimeterMap[`${y}a`].add(x);
  }
  if (map[locations["bottom"]] !== char) {
    horizontalPerimeterMap[`${y}b`] ??= new Set();
    horizontalPerimeterMap[`${y}b`].add(x);
  }

  Object.entries(locations).forEach(([_key, newPos]) => {
    const [i, j] = newPos.split(",").map(Number);
    if (map[`${i},${j}`] === char) {
      const { area: returnedArea } = recursivelyCheckPlot(
        `${i},${j}`,
        horizontalPerimeterMap,
        verticalPerimeterMap
      );

      area += returnedArea;
    }
  });

  return { area };
};

let sum = 0;

lines.forEach((line, lineIndex) => {
  Array.from(line).forEach((char, charIndex) => {
    let sides = 0;
    const horizontalPerimeterMap: PerimeterMap = {};
    const verticalPerimeterMap: PerimeterMap = {};
    const { area } = recursivelyCheckPlot(
      `${charIndex},${lineIndex}`,
      horizontalPerimeterMap,
      verticalPerimeterMap
    );
    console.log(char);
    console.log(horizontalPerimeterMap, verticalPerimeterMap);

    Object.values(horizontalPerimeterMap).forEach((perimetersY) => {
      const perimetersYArray = Array.from(perimetersY).toSorted(
        (a, b) => a - b
      );
      perimetersYArray.forEach((y, index) => {
        // if the y location of the x perimeter is not adjacent to the previous y location, it's a new side
        if (y - 1 !== perimetersYArray[index - 1]) {
          sides++;
        }
      });
    });

    Object.values(verticalPerimeterMap).forEach((perimetersX) => {
      const perimetersXArray = Array.from(perimetersX).toSorted(
        (a, b) => a - b
      );
      perimetersXArray.forEach((x, index) => {
        if (x - 1 !== perimetersXArray[index - 1]) {
          sides++;
        }
      });
    });

    console.log("sides " + sides);
    console.log("area " + area);
    sum += area * sides;
    console.log(sum);
  });
});
