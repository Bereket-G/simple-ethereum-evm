export const MAX_INTEGER_BIGINT = BigInt(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935'
)

import { ERROR, EvmError } from './exceptions'

/**
 * Implementation of the stack used in evm.
 */
export class Stack {
    _store: bigint[]
    _maxHeight: number

    constructor(maxHeight?: number) {
        this._store = []
        this._maxHeight = maxHeight ?? 1024
    }

    get length() {
        return this._store.length
    }

    push(value: bigint) {
        if (typeof value !== 'bigint') {
            throw new EvmError(ERROR.INTERNAL_ERROR)
        }

        if (value > MAX_INTEGER_BIGINT) {
            throw new EvmError(ERROR.OUT_OF_RANGE)
        }

        if (this._store.length >= this._maxHeight) {
            throw new EvmError(ERROR.STACK_OVERFLOW)
        }

        this._store.push(value)
    }

    pop(): bigint {
        if (this._store.length < 1) {
            throw new EvmError(ERROR.STACK_UNDERFLOW)
        }

        // Length is checked above, so pop shouldn't return undefined
        return this._store.pop()!
    }

    /**
     * Pop multiple items from stack. Top of stack is first item
     * in returned array.
     * @param num - Number of items to pop
     */
    popN(num: number = 1): bigint[] {
        if (this._store.length < num) {
            throw new EvmError(ERROR.STACK_UNDERFLOW)
        }

        if (num === 0) {
            return []
        }

        return this._store.splice(-1 * num).reverse()
    }
}
