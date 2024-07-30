import Bowman from '../characters/Bowman';
import Character from '../Character';

describe('class Bowman', () => {
  test('Testing instance of', () => {
    const result = new Bowman(1);
    expect(result).toBeInstanceOf(Character);
    expect(result).toBeInstanceOf(Bowman);
  });

  test('Testing creation character', () => {
    const result = new Bowman(1);

    expect(result).toEqual({
      attack: 25, defence: 25, health: 50, level: 1, type: 'bowman',
    });
  });

  test('Test getting brief information', () => {
    const character = new Bowman(1);

    const result = character.briefInformation;

    expect(result).toBe(`🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`);
  });

  test('testing getting attack range', () => {
    const character = new Bowman(1);
    const result = character.attackRange;

    expect(result).toBe(2);
  })

  test('testing getting driving range', () => {
    const character = new Bowman(1);
    const result = character.drivingRange;

    expect(result).toBe(2);
  })
});
    