import Character from '../Character';
import characterTypes from '../characterTypes';

export default class Magician extends Character {
  constructor(level) {
    super(1, characterTypes.magician);
    this.attack = 10;
    this.defence = 40;

    for (let index = 1; index < level; index += 1) {
      this.levelUp();
    }

    Object.defineProperties(this, {
      attackRange: { value: 4, writable: false, configurable: false },
      moveRange: { value: 1, writable: false, configurable: false },
    });
  }
}
