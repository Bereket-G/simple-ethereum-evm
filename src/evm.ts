import { Interpreter } from './interpreter'
import { getOpcodes, OpcodeList, OpHandler } from './opcodes'
import type { RunState } from './interpreter'
import type {
    EVMInterface,
    EVMRunCodeOpts,
} from './types';

/**
 * EVM is responsible for executing an EVM message fully
 * (including any nested calls and creates), processing the results
 * and storing them to state (or discarding changes in case of exceptions).
 * @ignore
 */
export class EVM implements EVMInterface {
    /**
     * This opcode data is always set since `getActiveOpcodes()` is called in the constructor
     * @hidden
     */
    _opcodes!: OpcodeList


    /**
     * @hidden
     */
    _handlers!: Map<number, OpHandler>

    public get opcodes() {
        return this._opcodes
    }

    constructor() {
        // Initialize the opcode data
        this.getActiveOpcodes()
    }

    /**
     * Returns a list with the currently activated opcodes
     * available for EVM execution
     */
    getActiveOpcodes(): OpcodeList {
        const data = getOpcodes();
        this._opcodes = data.opcodes
        this._handlers = data.handlers
        return data.opcodes
    }

    /**
     * Starts the actual bytecode processing for a CALL or CREATE, providing
     * it with the {@link EEI}.
     */
    protected async runInterpreter(
        message: EVMRunCodeOpts
    ): Promise<ExecResult> {
        const interpreter = new Interpreter(this);

        const interpreterRes = await interpreter.run(message.code as Buffer);
        let result = interpreter._result;

        return {
            ...result,
            runState: {
                opCode: interpreterRes.runState.opCode,
                stack: interpreterRes.runState.stack,
                returnStack: interpreterRes.runState.returnStack,
                code: interpreterRes.runState.code,
                pc: interpreterRes.runState.pc,
                returnBytes: interpreterRes.runState.returnBytes
            },
            returnValue: result.returnValue ? result.returnValue : Buffer.alloc(0),
        }
    }

    /**
     * Bound to the global VM and therefore
     * shouldn't be used directly from the evm class
     */
    async runCode(opts: EVMRunCodeOpts): Promise<ExecResult> {
        return this.runInterpreter({code : opts.code});
    }
}

/**
 * Result of executing a call via the {@link EVM}.
 */
export interface ExecResult {
    runState?: RunState
    /**
     * Return value from the contract
     */
    returnValue: Buffer
}
