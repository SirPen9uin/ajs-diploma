import Magician from '../characters/Magician';
import Character from '../Character';

test('Test creation', () => {
	const result = new Magician(1);

	expect(result).toBeInstanceOf(Character);
  	expect(result).toBeInstanceOf(Magician);
	expect(result).toEqual({
		attack: 10, defence: 40, health: 50, level: 1, type: 'magician',
	});
});
