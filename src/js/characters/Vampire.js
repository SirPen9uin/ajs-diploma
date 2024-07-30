import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Vampire extends Character {
	constructor(level) {
		super(level, characterTypes.vampire);
		this.attack = 25;
		this.defence = 25;

		Object.defineProperties(this, {
			attackRange: { value: 2, writable: false, configurable: false },
			drivingRange: { value: 2, writable: false, configurable: false },
		})
	}
}