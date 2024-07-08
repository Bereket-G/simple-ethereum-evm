import { EvmError } from './exceptions';
import { Stack } from './stack';

import type { EVM } from './evm';
import type { OpHandler, Opcode } from './opcodes';

/**
 * Immediate (unprocessed) result of running an EVM bytecode.
 */
export interface RunResult {
  returnValue?: Buffer;
}

export interface RunState {
  opCode: number;
  stack: Stack;
  returnStack?: Stack;
  code: Buffer;
  pc: number; // Program counter to keep track of the current position in the code
  returnBytes: Uint8Array;
}

export interface InterpreterResult {
  runState: RunState;
  exceptionError?: EvmError;
}

/**
 * Parses and executes EVM bytecode.
 */
export class Interpreter {
  protected _runState: RunState;
  public _evm: EVM;

  // Keep track of this Interpreter run result
  // TODO move into Env?
  _result: RunResult;

  // Opcode debuggers (e.g. { 'push': [debug Object], 'sstore': [debug Object], ...})
  private opDebuggers: { [key: string]: (debug: string) => void } = {};

  // TODO remove eei from constructor this can be directly read from EVM
  // EEI gets created on EVM creation and will not be re-instantiated
  // TODO remove gasLeft as constructor argument
  constructor(evm: EVM) {
    this._evm = evm;
    this._runState = {
      opCode: 0xfe, // INVALID opcode
      code: Buffer.alloc(0),
      stack: new Stack(),
      pc: 0, // Initialize program counter,
      returnBytes: new Uint8Array(0),
    };
    this._result = {
      returnValue: undefined,
    };
  }

  async run(code: Buffer): Promise<InterpreterResult> {
    this._runState.code = code;
    while (this._runState.pc < code.length) {
      this._runState.opCode = code[this._runState.pc];
      const opInfo = this.lookupOpInfo(this._runState.opCode);

      // Execute opcode handler
      const opFn = this.getOpHandler(opInfo);
      opFn.apply(null, [this._runState]);

      // Move to the next opcode
      this._runState.pc += 1;
    }

    this._result.returnValue = Buffer.from(this._runState.returnBytes);
    return {
      runState: this._runState,
    };
  }

  /**
   * Get the handler function for an opcode.
   */
  getOpHandler(opInfo: Opcode): OpHandler {
    return this._evm._handlers.get(opInfo.code)!;
  }

  /**
   * Get info for an opcode from EVM's list of opcodes.
   */
  lookupOpInfo(op: number): Opcode {
    // if not found, return 0xfe: INVALID
    return this._evm._opcodes.get(op) ?? this._evm._opcodes.get(0xfe)!;
  }
}
