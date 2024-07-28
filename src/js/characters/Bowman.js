import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Bowman extends Character {
	constructor(level) {
		super(level, characterTypes.bowman);
		this.attack = 25;
		this.defence = 25;
	}
}