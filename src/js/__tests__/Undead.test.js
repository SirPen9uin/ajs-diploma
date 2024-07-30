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
  
	  expect(result).toBe(`🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`);
	});

	test('testing getting attack range', () => {
		const character = new Undead(1);
		const result = character.attackRange;
	
		expect(result).toBe(1);
	  })
	
	  test('testing getting driving range', () => {
		const character = new Undead(1);
		const result = character.drivingRange;
	
		expect(result).toBe(4);
	  })
  });
