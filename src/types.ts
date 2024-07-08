import type { ExecResult } from './evm';
import {OpcodeList } from "./opcodes";

export interface EVMRunCodeOpts {
    code?: Buffer
}

/**
 * API of the EVM
 */
export interface EVMInterface {
    runCode?(opts: EVMRunCodeOpts): Promise<ExecResult>
    getActiveOpcodes?(): OpcodeList
}
