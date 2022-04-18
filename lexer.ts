import fs from 'fs'
import { operators, ponctuations, reservedTokens } from './reservedWords';

enum TokenClass {
  reserved = 'palavra reservada',
  ponctuation = 'pontuação',
  operator = 'operador',
  real = 'real',
  integer = 'inteiro',
  variable = 'variável',
}

type AnalizeResult = {
  tokenClass: string;
  lineNumber: number;
  ocurrence: string;
  token: string;
}

function readFile(fileName: string) {
  return fs.readFileSync(fileName).toString();
}

function checkTokenType(token: string): keyof typeof TokenClass {
  if(!Number.isNaN(Number(token))) {
    if (Number.isInteger(token)) return 'integer'
    return 'real';
  }
  if(reservedTokens.includes(token)) return 'reserved';
  if(ponctuations.includes(token)) return 'ponctuation';
  if(operators.includes(token)) return 'operator';
  return 'variable'
}

function analize(fileContent: string): AnalizeResult[] {
  let tokenNumber = 0;
  let classOccurences: Record<string, number> = Object.keys(TokenClass).reduce((obj, current) => ({...obj, [current]: 0}), {});
  
  return fileContent.split(/\r?\n/).map((line, lineNumber) => line.split(' ').map<AnalizeResult>((token) => {
    const type = checkTokenType(token);
    classOccurences[type] += 1;
    tokenNumber += 1;
    return {
      lineNumber: lineNumber + 1,
      token,
      tokenClass: TokenClass[type],
      ocurrence: `${classOccurences[type]}/${tokenNumber}`,
    }
  })).reduce((arr, line) => [...arr, ...line]);
}

const result = analize(readFile('test.p'));

console.table(result);
console.log(result.length);