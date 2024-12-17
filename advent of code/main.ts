import { memoise } from "./helpers.ts";

// Define the path to the text file
const filePath = "./input.txt";

let inputString = (await Deno.readTextFile(filePath)) as string;

const [registers, program] = inputString.split("\r\n\r\n");

let [registerA, registerB, registerC] =
  registers.match(/(\d+)/g)?.map((value) => +value) ?? [];

const instructions = program.match(/\d+/g)?.map((value) => +value) ?? [];

const getValueFromComboOperand = (operand: number) => {
  switch (operand) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return registerA;
    case 5:
      return registerB;
    case 6:
      return registerC;
    default:
      return operand;
  }
};

const getCodeFromInstruction = (instruction: number) => {
  switch (instruction) {
    case 0:
      return "adv";
    case 1:
      return "bxl";
    case 2:
      return "bst";
    case 3:
      return "jnz";
    case 4:
      return "bxc";
    case 5:
      return "out";
    case 6:
      return "bdv";
    case 7:
      return "cdv";
    default:
      return "invalid";
  }
};

let halted = false;

const outs: number[] = [];

let pointer = 0;

while (!halted) {
  const instruction = instructions[pointer];

  console.log(getCodeFromInstruction(instruction));
  console.log(instructions, pointer);
  console.log(instructions[pointer]);

  const literalOperand = instructions[pointer + 1];
  const comboOperand = getValueFromComboOperand(instructions[pointer + 1]);

  console.log({ instruction, literalOperand, comboOperand });
  console.log({ registerA, registerB, registerC });

  if (instruction === undefined) {
    halted = true;
    break;
  }
  switch (instruction) {
    case 0: //adv
      registerA = Math.floor(registerA / Math.pow(2, comboOperand));
      break;
    case 1: //bxl
      registerB = registerB ^ literalOperand;
      break;
    case 2: //bst
      registerB = comboOperand % 8;
      break;
    case 3: //jnz
      if (registerA === 0) {
        break;
      }
      pointer = literalOperand;
      continue;
    case 4: //bxc
      registerB = registerB ^ registerC;
      break;
    case 5: //out
      outs.push(comboOperand % 8);
      break;
    case 6: //bdv
      registerB = Math.floor(registerA / Math.pow(2, comboOperand));
      break;
    case 7: //cdv
      registerC = Math.floor(registerA / Math.pow(2, comboOperand));
      break;
  }
  pointer += 2;
  console.log(outs.join(","));
}
console.log(outs.join(","));
