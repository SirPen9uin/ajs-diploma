import Magician from '../characters/Magician';
import Character from '../Character';

describe('class Magician', () => {
	test('Testing instance of', () => {
	  const result = new Magician(1);
	  expect(result).toBeInstanceOf(Character);
	  expect(result).toBeInstanceOf(Magician);
	});
  
	test('Testing creation', () => {
	  const result = new Magician(1);
  
	  expect(result).toEqual({
		attack: 10, defence: 40, health: 50, level: 1, type: 'magician',
	  });
	});
  
	test('Test getting brief information', () => {
	  const character = new Magician(1);
  
	  const result = character.briefInformation;
  
	  expect(result).toBe(`🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`);
	});

	test('testing getting attack range', () => {
		const character = new Magician(1);
		const result = character.attackRange;
	
		expect(result).toBe(4);
	  })
	
	  test('testing getting driving range', () => {
		const character = new Magician(1);
		const result = character.drivingRange;
	
		expect(result).toBe(1);
	  })
  });
