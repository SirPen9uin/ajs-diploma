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

    expect(result).toBe(`\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`);
  });

  test('testing getting attack range', () => {
    const character = new Bowman(1);
    const result = character.attackRange;

    expect(result).toBe(2);
  })

  test('testing getting move range', () => {
    const character = new Bowman(1);
    const result = character.moveRange;

    expect(result).toBe(2);
  })

  test('Test creation with incorrect level', () => {
    const result = new Bowman(3);
  
    expect(result).toEqual({
      attack: 57,
      defence: 57,
      health: 100,
      level: 3,
      type: 'bowman',
    })
  });  
});

