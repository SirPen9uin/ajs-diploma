import Vampire from '../characters/Vampire';
import Character from '../Character';

describe('class Vampire', () => {
	test('Testing instance of', () => {
	  const result = new Vampire(1);
	  expect(result).toBeInstanceOf(Character);
	  expect(result).toBeInstanceOf(Vampire);
	});
  
	test('Testing creation', () => {
	  const result = new Vampire(1);
  
	  expect(result).toEqual({
		attack: 25, defence: 25, health: 50, level: 1, type: 'vampire',
	  });
	});
  
	test('Test getting brief information', () => {
	  const character = new Vampire(1);
  
	  const result = character.briefInformation;
  
	  expect(result).toBe(`\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`);
	});

	test('testing getting attack range', () => {
		const character = new Vampire(1);
		const result = character.attackRange;
	
		expect(result).toBe(2);
	  })
	
	  test('testing getting move range', () => {
		const character = new Vampire(1);
		const result = character.moveRange;
	
		expect(result).toBe(2);
	  })
  });