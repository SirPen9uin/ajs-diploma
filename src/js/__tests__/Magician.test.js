import Magician from '../characters/Magician';
import Character from '../Character';

describe('class Magician', () => {
	test('new Magician(1)', () => expect(new Magician(1)).toEqual({
	  attack: 10, defence: 40, health: 50, level: 1, type: 'magician',
	}));
	test('new Magician(3)', () => expect(new Magician(3)).toEqual({
	  attack: 23, defence: 93, health: 100, level: 3, type: 'magician',
	}));
	describe('[Magician]', () => {
	  let character;
  
	  beforeAll(() => { character = new Magician(1); });
	  afterAll(() => { character = undefined; });
  
	  test('instance of Character and Magician', () => {
		expect(character).toBeInstanceOf(Character);
		expect(character).toBeInstanceOf(Magician);
	  });
	  test('.attackRange', () => expect(character.attackRange).toBe(4));
	  test('.briefInformation', () => {
		expect(character.briefInformation).toBe(`\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`);
	  });
	  test('.moveRange', () => expect(character.moveRange).toBe(1));
	});
  });