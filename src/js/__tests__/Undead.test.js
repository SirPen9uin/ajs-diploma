import Undead from '../characters/Undead';
import Character from '../Character';

describe('class Undead', () => {
  test('new Undead(1)', () => expect(new Undead(1)).toEqual({
    attack: 40, defence: 10, health: 50, level: 1, type: 'undead',
  }));
  test('new Undead(3)', () => expect(new Undead(3)).toEqual({
    attack: 93, defence: 23, health: 100, level: 3, type: 'undead',
  }));
  describe('[Undead]', () => {
    let character;

    beforeAll(() => { character = new Undead(1); });
    afterAll(() => { character = undefined; });

    test('instance of Character and Undead', () => {
      expect(character).toBeInstanceOf(Character);
      expect(character).toBeInstanceOf(Undead);
    });
    test('.attackRange', () => expect(character.attackRange).toBe(1));
    test('.briefInformation', () => {
      expect(character.briefInformation).toBe(`\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`);
    });
    test('.moveRange', () => expect(character.moveRange).toBe(4));
  });
});
