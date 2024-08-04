import { calcHealthLevel, calcTileType, randomInt } from '../utils';

describe('module utils', () => {
  test.each([
    { health: 100, expected: 'high' },
    { health: 50, expected: 'high' },
    { health: 49, expected: 'normal' },
    { health: 15, expected: 'normal' },
    { health: 14, expected: 'critical' },
    { health: 0, expected: 'critical' },
  ])('calcHealthLevel($health)', ({ health, expected }) => expect(calcHealthLevel(health)).toBe(expected));
  test.each([
    { index: 0, boardSize: 8, expected: 'top-left' },
    { index: 1, boardSize: 8, expected: 'top' },
    { index: 4, boardSize: 5, expected: 'top-right' },
    { index: 7, boardSize: 7, expected: 'left' },
    { index: 12, boardSize: 4, expected: 'bottom-left' },
    { index: 17, boardSize: 6, expected: 'right' },
    { index: 40, boardSize: 9, expected: 'center' },
    { index: 63, boardSize: 8, expected: 'bottom-right' },
    { index: 75, boardSize: 9, expected: 'bottom' },
  ])('calcTileType($index, $boardSize)', ({ index, boardSize, expected }) => {
    expect(calcTileType(index, boardSize)).toBe(expected);
  });
  test('randomInt(3)', () => {
    const range = 3;
    const number = randomInt(range);

    expect(number).toBeGreaterThanOrEqual(0);
    expect(number).toBeLessThan(range);
  });
});
