import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Magician extends Character {
	constructor(level) {
		super(level, characterTypes.magician);
		this.attack = 10;
		this.defence = 40;
	}
}