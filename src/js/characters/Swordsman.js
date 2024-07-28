import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Swordsman extends Character {
	constructor(level) {
		super(level, characterTypes.swordsman);
		this.attack = 40;
		this.defence = 10;
	}
}