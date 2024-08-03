import Bowman from '../characters/Bowman';
import Character from '../Character';

describe('class Bowman', () => {
  test('new Bowman(1)', () => expect(new Bowman(1)).toEqual({
    attack: 25, defence: 25, health: 50, level: 1, type: 'bowman',
  }));
  test('new Bowman(3)', () => expect(new Bowman(3)).toEqual({
    attack: 57, defence: 57, health: 100, level: 3, type: 'bowman',
  }));
  describe('[Bowman]', () => {
    let character;

    beforeAll(() => { character = new Bowman(1); });
    afterAll(() => { character = undefined; });

    test('instance of Character and Bowman', () => {
      expect(character).toBeInstanceOf(Character);
      expect(character).toBeInstanceOf(Bowman);
    });
    test('.attackRange', () => expect(character.attackRange).toBe(2));
    test('.briefInformation', () => {
      expect(character.briefInformation).toBe(`\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`);
    });
    test('.moveRange', () => expect(character.moveRange).toBe(2));
  });
});