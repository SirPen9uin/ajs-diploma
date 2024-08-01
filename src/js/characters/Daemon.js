import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Daemon extends Character {
	constructor(level) {
		super(1, characterTypes.daemon);
		this.attack = 10;
		this.defence = 10;

		for(let index = 1; index < level; index += 1) {
			this.levelUp();
		}

		Object.defineProperties(this, {
			attackRange: { value: 4, writable: false, configurable: false },
			moveRange: { value: 1, writable: false, configurable: false },
		})
	}
}