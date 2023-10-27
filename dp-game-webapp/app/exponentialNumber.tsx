export class ExponentialNumber {
  private _base: number;
  private _exponent: number;
  private _value: number;

  constructor(initialExponent: number = 0, base: number = 10) {
    this._base = base;
    this._exponent = initialExponent;
    this._value = Math.pow(this._base, this._exponent);
  }

  get base(): number {
    return this._base;
  }

  get exponent(): number {
    return this._exponent;
  }

  get value(): number {
    return this._value;
  }

  set exponent(newExponent: number) {
    this._exponent = newExponent;
    this._value = Math.pow(this._base, this._exponent);
  }

  set value(newValue: number) {
    this._exponent = Math.log(newValue) / Math.log(this._base);
    this._value = Math.pow(this._base, this._exponent);
  }

  toString(): string {
    if (
      this._base === 10 &&
      this._exponent <= -4 &&
      Number.isInteger(this._exponent)
    ) {
      return `0.${"0".repeat(Math.abs(this._exponent))}1`;
    } else {
      return this._value.toLocaleString();
    }
  }
}
