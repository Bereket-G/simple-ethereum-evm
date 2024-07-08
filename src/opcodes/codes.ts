import { getFullname } from './util'
import { handlers } from './functions'

export class Opcode {
    readonly code: number
    readonly name: string
    readonly fullName: string
    readonly fee?: number
    readonly isAsync: boolean
    readonly dynamicGas: boolean

    constructor({
                    code,
                    name,
                    fullName,
                    fee,
                    isAsync,
                    dynamicGas,
                }: {
        code: number
        name: string
        fullName: string
        fee: number
        isAsync: boolean
        dynamicGas: boolean
    }) {
        this.code = code
        this.name = name
        this.fullName = fullName
        this.fee = fee
        this.isAsync = isAsync
        this.dynamicGas = dynamicGas

        // Opcode isn't subject to change, thus all further modifications are prevented.
        Object.freeze(this)
    }
}

export type OpcodeList = Map<number, Opcode>
type OpcodeEntry = { [key: number]: { name: string; isAsync: boolean; dynamicGas: boolean } }
type OpcodeEntryFee = OpcodeEntry & { [key: number]: { fee: number } }

// Base opcode list. The opcode list is extended in future hardforks
const opcodes: OpcodeEntry = {
    // 0x0 range - arithmetic ops
    // name, async
    0x00: { name: 'STOP', isAsync: false, dynamicGas: false },
    0x01: { name: 'ADD', isAsync: false, dynamicGas: false },
    0x02: { name: 'MUL', isAsync: false, dynamicGas: false },
    0x03: { name: 'SUB', isAsync: false, dynamicGas: false },
    0x04: { name: 'DIV', isAsync: false, dynamicGas: false },

    0x60: { name: 'PUSH', isAsync: false, dynamicGas: false },

}

/**
 * Convert basic opcode info dictionary into complete OpcodeList instance.
 *
 * @param opcodes {Object} Receive basic opcodes info dictionary.
 * @returns {OpcodeList} Complete Opcode list
 */
function createOpcodes(opcodes: OpcodeEntryFee): OpcodeList {
    const result: OpcodeList = new Map()
    for (const [key, value] of Object.entries(opcodes)) {
        const code = parseInt(key, 10)
        if (isNaN(value.fee)) value.fee = 0
        result.set(
            code,
            new Opcode({
                code,
                fullName: getFullname(code, value.name),
                ...value,
            })
        )
    }
    return result
}


/**
 * Get suitable opcodes for the required hardfork.
 * @returns {OpcodeList} Opcodes dictionary object.
 */
export function getOpcodes(): any {
    let opcodeBuilder: any = { ...opcodes }
    const handlersCopy = new Map(handlers)

    return {
        handlers: handlersCopy,
        opcodes: createOpcodes(opcodeBuilder),
    }
}
