import Undead from '../characters/Undead';
import Character from '../Character';

describe('class Undead', () => {
	test('Testing instance of', () => {
	  const result = new Undead(1);
	  expect(result).toBeInstanceOf(Character);
	  expect(result).toBeInstanceOf(Undead);
	});
  
	test('Testing creation', () => {
	  const result = new Undead(1);
  
	  expect(result).toEqual({
		attack: 40, defence: 10, health: 50, level: 1, type: 'undead',
	  });
	});
  
	test('Test getting brief information', () => {
	  const character = new Undead(1);
  
	  const result = character.briefInformation;
  
	  expect(result).toBe(`\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`);
	});

	test('testing getting attack range', () => {
		const character = new Undead(1);
		const result = character.attackRange;
	
		expect(result).toBe(1);
	  })
	
	test('testing getting move range', () => {
		const character = new Undead(1);
		const result = character.moveRange;
	
		expect(result).toBe(4);
	  })

	  test('Test creation with incorrect level', () => {
		const result = new Undead(3);
	  
		expect(result).toEqual({
		  attack: 93,
		  defence: 23,
		  health: 100,
		  level: 3,
		  type: 'undead',
		})
	  });  
  });
