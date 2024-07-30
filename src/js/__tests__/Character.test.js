import Character from '../Character';

describe('class Daemon', () => {
  test('testing impossibility of creation', () => {
    const result = new Character(1);

    expect(result).toThrow(Error);
  });
});