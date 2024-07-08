import { EVM } from './src/evm';
import {bytesToHex, codeToBuffer} from './src/opcodes';

const main = async () => {
  const evm = new EVM();

  // Arguments are in hex
  const ARG1 = '05';
  const ARG2 = '04';

  const STOP = '00';
  const ADD = '01';
  const SUB = '03';
  const MUL = '02';
  const DIV = '04';
  const PUSH1 = '60';
  const AddInstruction = [PUSH1, ARG1, PUSH1, ARG2, ADD, STOP];

  const codeBuffer = codeToBuffer(AddInstruction);

  evm
    .runCode({
      code: codeBuffer,
    })
    .then((results) => {
      console.log(`Returned: ${bytesToHex(results.returnValue)}`)
    })
    .catch(console.error);
}

void main()
