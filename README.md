# Simple Ethereum EVM

A simple implementation of the Ethereum Virtual Machine (EVM) that can execute basic opcodes such as `STOP`, `ADD`, `SUB`, `MUL`, `DIV`, and `PUSH1`. This project demonstrates the core principles of EVM bytecode execution, including stack management and opcode handling.

## Features

- Supports basic EVM opcodes: `STOP`, `ADD`, `SUB`, `MUL`, `DIV`, and `PUSH1`
- Simple stack-based execution model
- Demonstrates core EVM concepts
- No external dependencies


## Usage

To run the example provided in `index.ts`:

1. Install dev dependencies:
    ```bash
    npm install
    ```

2. Run the example:
    ```bash
    npm start
    ```

You should see the result of the EVM execution in the console output.

## Example

The provided example demonstrates pushing two values onto the stack, adding them, and then stopping execution:

```typescript
import { EVM } from './src/evm';
import { bytesToHex } from './utils'; // Assuming utils is a custom module for hex conversion

const main = async () => {
  const evm = new EVM();

  const STOP = '00';
  const ADD = '01';
  const SUB = '02';
  const MUL = '03';
  const DIV = '04';
  const PUSH1 = '60';

  const code = [PUSH1, '03', PUSH1, '05', ADD, STOP];

  const codeBuffer = Buffer.from(code.join(''), 'hex');

  evm.runCode({ code: codeBuffer })
    .then((results) => {
      console.log(`Returned: ${bytesToHex(results.returnValue)}`);
    })
    .catch(console.error);
};

void main();
```

This example pushes 3 and 5 onto the stack, adds them to get 8, and then stops execution.

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/licenses/MIT
) file for details.

## Contributions

Contributions are welcome! Please feel free to submit a pull request or open an issue.