import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Undead extends Character {
	constructor(level) {
		super(level, characterTypes.undead);
		this.attack = 40;
		this.defence = 10;

		Object.defineProperties(this, {
			attackRange: { value: 1, writable: false, configurable: false },
			drivingRange: { value: 4, writable: false, configurable: false },
		})
	}
}