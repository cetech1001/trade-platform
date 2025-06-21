import Decimal from 'decimal.js';

export class DecimalHelper {
  static add(a: number | string, b: number | string): number {
    return new Decimal(a).plus(b).toNumber();
  }

  static subtract(a: number | string, b: number | string): number {
    return new Decimal(a).minus(b).toNumber();
  }

  static multiply(a: number | string, b: number | string): number {
    return new Decimal(a).times(b).toNumber();
  }

  static divide(a: number | string, b: number | string): number {
    return new Decimal(a).dividedBy(b).toNumber();
  }

  static toFixed(value: number | string, decimals: number): string {
    return new Decimal(value).toFixed(decimals);
  }

  static normalize(value: any): number {
    if (value === null || value === undefined) {
      throw new Error('Value cannot be null or undefined');
    }
    const decimal = new Decimal(value);
    if (decimal.isNaN() || !decimal.isFinite()) {
      throw new Error(`Invalid numeric value: ${value}`);
    }
    return decimal.toNumber();
  }

  static isGreaterThan(a: number | string, b: number | string): boolean {
    return new Decimal(a).greaterThan(b);
  }

  static isLessThan(a: number | string, b: number | string): boolean {
    return new Decimal(a).lessThan(b);
  }

  static isEqual(a: number | string, b: number | string): boolean {
    return new Decimal(a).equals(b);
  }
}
