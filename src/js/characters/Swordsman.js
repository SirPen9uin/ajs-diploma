import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Swordsman extends Character {
  constructor(level) {
    super(1, characterTypes.swordsman);
    this.attack = 40;
    this.defence = 10;

    for (let index = 1; index < level; index += 1) {
      this.levelUp();
    }

    Object.defineProperties(this, {
      attackRange: { value: 1, writable: false, configurable: false },
      moveRange: { value: 4, writable: false, configurable: false },
    });
  }
}
