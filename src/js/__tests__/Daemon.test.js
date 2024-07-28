import Daemon from '../characters/Daemon';
import Character from '../Character';

test('Testing Bowman creation', () => {
  const result = new Daemon(1);

  expect(result).toBeInstanceOf(Character);
  expect(result).toBeInstanceOf(Daemon);
  expect(result).toEqual({
    attack: 10, defence: 10, health: 50, level: 1, type: 'daemon',
  });
});