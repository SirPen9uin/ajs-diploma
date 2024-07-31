import Swordsman from '../characters/Swordsman';
import Character from '../Character';

describe('class Swordsman', () => {
	test('Testing instance of', () => {
	  const result = new Swordsman(1);
	  expect(result).toBeInstanceOf(Character);
	  expect(result).toBeInstanceOf(Swordsman);
	});
  
	test('Testing creation', () => {
	  const result = new Swordsman(1);
  
	  expect(result).toEqual({
		attack: 40, defence: 10, health: 50, level: 1, type: 'swordsman',
	  });
	});
  
	test('Test getting brief information', () => {
	  const character = new Swordsman(1);
  
	  const result = character.briefInformation;
  
	  expect(result).toBe(`\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`);
	});

	test('testing getting attack range', () => {
		const character = new Swordsman(1);
		const result = character.attackRange;
	
		expect(result).toBe(1);
	  })
	
	  test('testing getting move range', () => {
		const character = new Swordsman(1);
		const result = character.moveRange;
	
		expect(result).toBe(4);
	  })
  });