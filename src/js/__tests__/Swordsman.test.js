import Swordsman from '../characters/Swordsman';
import Character from '../Character';

test('Test creation', () => {
	const result = new Swordsman(1);

	expect(result).toBeInstanceOf(Character);
  	expect(result).toBeInstanceOf(Swordsman);
	expect(result).toEqual({
		attack: 40, defence: 10, health: 50, level: 1, type: 'swordsman',
	});
});
