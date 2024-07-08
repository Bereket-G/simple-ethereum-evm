
/**
 * Get full opcode name from its name and code.
 *
 * @param code Integer code of opcode.
 * @param name Short name of the opcode.
 * @returns Full opcode name
 */
export function getFullname(code: number, name: string): string {
    switch (name) {
        case 'LOG':
            name += code - 0xa0
            break
        case 'PUSH':
            name += code - 0x5f
            break
        case 'DUP':
            name += code - 0x7f
            break
        case 'SWAP':
            name += code - 0x8f
            break
    }
    return name
}


export function mod(a: bigint, b: bigint) {
    let r = a % b
    if (r < BigInt(0)) {
        r = b + r
    }
    return r
}

export const bytesToBigInt = (bytes: Uint8Array): bigint => {
    const hex = bytesToHex(bytes)
    return BigInt(hex)
}

export function bigintToUint8Array(value: bigint): Uint8Array {
    const hex = value.toString(16);
    const len = Math.ceil(hex.length / 2);
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        u8[len - i - 1] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return u8;
}

export function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export const TWO_POW256 = BigInt(
    '0x10000000000000000000000000000000000000000000000000000000000000000'
)


// Helper function to convert opcodes to Buffer
export const codeToBuffer = (codeArray: string[]) => {
    return Buffer.from(codeArray.join(''), 'hex');
};