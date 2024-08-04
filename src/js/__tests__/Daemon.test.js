import Daemon from '../characters/Daemon';
import Character from '../Character';

describe('class Daemon', () => {
  test('new Daemon(1)', () => expect(new Daemon(1)).toEqual({
    attack: 10, defence: 10, health: 50, level: 1, type: 'daemon',
  }));
  test('new Daemon(3)', () => expect(new Daemon(3)).toEqual({
    attack: 23, defence: 23, health: 100, level: 3, type: 'daemon',
  }));
  describe('[Daemon]', () => {
    let character;

    beforeAll(() => { character = new Daemon(1); });
    afterAll(() => { character = undefined; });

    test('instance of Character and Daemon', () => {
      expect(character).toBeInstanceOf(Character);
      expect(character).toBeInstanceOf(Daemon);
    });
    test('.attackRange', () => expect(character.attackRange).toBe(4));
    test('.briefInformation', () => {
      expect(character.briefInformation).toBe(`\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`);
    });
    test('.moveRange', () => expect(character.moveRange).toBe(1));
  });
});
