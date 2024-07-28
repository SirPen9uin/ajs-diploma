import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Vampire extends Character {
	constructor(level) {
		super(level, characterTypes.vampire);
		this.attack = 25;
		this.defence = 25;
	}
}