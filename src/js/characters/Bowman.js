import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Bowman extends Character {
  constructor(level) {
    super(1, characterTypes.bowman);
    this.attack = 25;
    this.defence = 25;

    for (let index = 1; index < level; index += 1) {
      this.levelUp();
    }

    Object.defineProperties(this, {
      attackRange: { value: 2, writable: false, configurable: false },
      moveRange: { value: 2, writable: false, configurable: false },
    });
  }
}
