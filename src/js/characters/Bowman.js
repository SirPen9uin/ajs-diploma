import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Bowman extends Character {
	constructor(level) {
		super(level, characterTypes.bowman);
		this.attack = 25;
		this.defence = 25;

		Object.defineProperties(this, {
			attackRange: { value: 2, writable: false, configurable: false },
			moveRange: { value: 2, writable: false, configurable: false },
		});
	}
}