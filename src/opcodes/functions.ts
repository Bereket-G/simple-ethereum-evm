import {bigintToUint8Array, bytesToBigInt, mod, TWO_POW256} from './util'

import type { RunState } from '../interpreter'

export interface SyncOpHandler {
    (runState: RunState): void
}

export type OpHandler = SyncOpHandler;

// the opcode functions
export const handlers: Map<number, OpHandler> = new Map([
    // 0x00: STOP
    [
        0x00,
        function (runState: RunState) {
            runState.returnBytes = bigintToUint8Array(runState.stack.pop());
        },
    ],
    // 0x01: ADD
    [
        0x01,
        function (runState) {
            const [a, b] = runState.stack.popN(2)
            const r = mod(a + b, TWO_POW256)
            runState.stack.push(r)
        },
    ],
    // 0x02: MUL
    [
        0x02,
        function (runState) {
            const [a, b] = runState.stack.popN(2)
            const r = mod(a * b, TWO_POW256)
            runState.stack.push(r)
        },
    ],
    // 0x03: SUB
    [
        0x03,
        function (runState) {
            const [a, b] = runState.stack.popN(2)
            const r = mod(a - b, TWO_POW256)
            runState.stack.push(r)
        },
    ],
    // 0x04: DIV
    [
        0x04,
        function (runState) {
            const [a, b] = runState.stack.popN(2)
            let r
            if (b === BigInt(0)) {
                r = BigInt(0)
            } else {
                r = mod(a / b, TWO_POW256)
            }
            runState.stack.push(r)
        },
    ],
    // 0x60: PUSH
    [
        0x60,
        function (runState) {
            const numToPush = runState.opCode - 0x5f;
            runState.pc += numToPush;
            const loaded = bytesToBigInt(runState.code.subarray(runState.pc, runState.pc + numToPush));
            runState.stack.push(loaded);
        },
    ],
])

// Fill in rest of PUSHn, DUPn, SWAPn, LOGn for handlers
const pushFn = handlers.get(0x60)!
for (let i = 0x61; i <= 0x7f; i++) {
    handlers.set(i, pushFn)
}
const dupFn = handlers.get(0x80)!
for (let i = 0x81; i <= 0x8f; i++) {
    handlers.set(i, dupFn)
}
const swapFn = handlers.get(0x90)!
for (let i = 0x91; i <= 0x9f; i++) {
    handlers.set(i, swapFn)
}
const logFn = handlers.get(0xa0)!
for (let i = 0xa1; i <= 0xa4; i++) {
    handlers.set(i, logFn)
}
