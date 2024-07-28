import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Daemon extends Character {
	constructor(level) {
		super(level, characterTypes.daemon);
		this.attack = 10;
		this.defence = 10;
	}
}