import Character from '../Character';

test('Test illegible creation of Character class', () => {
  expect(() => new Character(1)).toThrow(Error);
});