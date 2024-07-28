import Bowman from '../characters/Bowman';
import Character from '../Character';

test('Testing Bowman creation', () => {
  const result = new Bowman(1);

  expect(result).toBeInstanceOf(Character);
  expect(result).toBeInstanceOf(Bowman);
  expect(result).toEqual({
    attack: 25, defence: 25, health: 50, level: 1, type: 'bowman',
  });
});