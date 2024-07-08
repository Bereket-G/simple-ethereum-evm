export enum ERROR {
  STACK_UNDERFLOW = 'stack underflow',
  STACK_OVERFLOW = 'stack overflow',
  OUT_OF_RANGE = 'value out of range',
  INTERNAL_ERROR = 'internal error',
}

export class EvmError {
  error: ERROR
  errorType: string

  constructor(error: ERROR) {
    this.error = error
    this.errorType = 'EvmError'
  }
}
