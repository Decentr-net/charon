import { DecimalPipe } from '@angular/common';

import { CHAR_NO_BREAK_SPACE, DEFAULT_DECIMAL_SEPARATOR, NumberFormatPipe } from './number-format.pipe';

describe('number-format pipe', () => {
  const decimalPipe = new DecimalPipe('en-US');
  const numberFormat = new NumberFormatPipe(decimalPipe);

  const defaultDecimalSeparator = DEFAULT_DECIMAL_SEPARATOR;
  const customDecimalSeparator = ';';
  const thousandSeparator = CHAR_NO_BREAK_SPACE;

  it('should return 0', function () {
    expect(numberFormat.transform(
      0,
      null,
      true,
      null,
      thousandSeparator,
    )).toBe('0');
  });

  it(`should return 0${customDecimalSeparator}00`, function () {
    expect(numberFormat.transform(
      0,
      '1.2',
      false,
      customDecimalSeparator,
    )).toBe(`0${customDecimalSeparator}00`);
  });

  it('should return -1', function () {
    expect(numberFormat.transform(
      -1,
      null,
      false,
      null,
    )).toBe('-1');
  });

  it(`should return -1${defaultDecimalSeparator}0`, function () {
    expect(numberFormat.transform(
      -1,
      '1.1',
      true,
      null,
      thousandSeparator,
    )).toBe(`-1${defaultDecimalSeparator}0`);
  });

  it('should return 1', function () {
    expect(numberFormat.transform(
      1,
      null,
      true,
      null,
      thousandSeparator,
    )).toBe('1');
  });

  it(`should return 1${customDecimalSeparator}0`, function () {
    expect(numberFormat.transform(
      1,
      '1.1-1',
      false,
      customDecimalSeparator,
    )).toBe(`1${customDecimalSeparator}0`);
  });

  it(`should return 7${defaultDecimalSeparator}3`, function () {
    expect(numberFormat.transform(
      7.25,
      '1.1-1',
      false,
      null,
    )).toBe(`7${defaultDecimalSeparator}3`);
  });

  it(`should return 7${customDecimalSeparator}25`, function () {
    expect(numberFormat.transform(
      7.25,
      null,
      true,
      customDecimalSeparator,
      '*',
    )).toBe(`7${customDecimalSeparator}25`);
  });

  it('should return 1*000*000', function () {
    expect(numberFormat.transform(
      1000000,
      null,
      true,
      customDecimalSeparator,
      '*',
    )).toBe('1*000*000');
  });

  it(`should return 2000000${customDecimalSeparator}0`, function () {
    expect(numberFormat.transform(
      2000000,
      '1.1-1',
      null,
      customDecimalSeparator,
    )).toBe(`2000000${customDecimalSeparator}0`);
  });

  it(`should return -1234567${defaultDecimalSeparator}9`, function () {
    expect(numberFormat.transform(
      -1234567.89,
      '1.1-1',
    )).toBe(`-1234567${defaultDecimalSeparator}9`);
  });

  it(`should return -1${thousandSeparator}234${thousandSeparator}567${customDecimalSeparator}9`, function () {
    expect(numberFormat.transform(
      -1234567.89,
      '1.0-1',
      true,
      customDecimalSeparator,
      thousandSeparator,
    )).toBe(`-1${thousandSeparator}234${thousandSeparator}567${customDecimalSeparator}9`);
  });

  it(`should return 1234${defaultDecimalSeparator}567`, function () {
    expect(numberFormat.transform(
      1234.567,
    )).toBe(`1234${defaultDecimalSeparator}567`);
  });

  it(`should return -1234${defaultDecimalSeparator}567`, function () {
    expect(numberFormat.transform(
      -1234.567,
    )).toBe(`-1234${defaultDecimalSeparator}567`);
  });

  it(`should return 1234${customDecimalSeparator}567`, function () {
    expect(numberFormat.transform(
      1234.567,
      null,
      null,
      customDecimalSeparator,
    )).toBe(`1234${customDecimalSeparator}567`);
  });

  it(`should return -1234${customDecimalSeparator}567`, function () {
    expect(numberFormat.transform(
      -1234.567,
      null,
      null,
      customDecimalSeparator,
    )).toBe(`-1234${customDecimalSeparator}567`);
  });

  it(`should return 1${customDecimalSeparator}234`, function () {
    expect(numberFormat.transform(
      1.234,
      null,
      null,
      customDecimalSeparator,
      thousandSeparator,
    )).toBe(`1${customDecimalSeparator}234`);
  });

  it(`should return 123${thousandSeparator}456${defaultDecimalSeparator}789`, function () {
    expect(numberFormat.transform(
      123456.7890,
      '1.3-3',
      true,
      defaultDecimalSeparator,
      thousandSeparator,
    )).toBe(`123${thousandSeparator}456${defaultDecimalSeparator}789`);
  });

  it(`should return 123${thousandSeparator}456${customDecimalSeparator}789`, function () {
    expect(numberFormat.transform(
      123456.7890,
      '1.3-3',
      true,
      customDecimalSeparator,
      thousandSeparator,
    )).toBe(`123${thousandSeparator}456${customDecimalSeparator}789`);
  });

  it(`should return -123 456${defaultDecimalSeparator}789`, function () {
    expect(numberFormat.transform(
      -123456.7890,
      '1.3-3',
      true,
      defaultDecimalSeparator,
      thousandSeparator,
    )).toBe(`-123${thousandSeparator}456${defaultDecimalSeparator}789`);
  });

  it(`should return -123${thousandSeparator}456${customDecimalSeparator}789`, function () {
    expect(numberFormat.transform(
      -123456.7890,
      '1.3-3',
      true,
      customDecimalSeparator,
      thousandSeparator,
    )).toBe(`-123${thousandSeparator}456${customDecimalSeparator}789`);
  });
});
