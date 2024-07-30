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
  
	  expect(result).toBe(`🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`);
	});

	test('testing getting attack range', () => {
		const character = new Swordsman(1);
		const result = character.attackRange;
	
		expect(result).toBe(1);
	  })
	
	  test('testing getting driving range', () => {
		const character = new Swordsman(1);
		const result = character.drivingRange;
	
		expect(result).toBe(4);
	  })
  });