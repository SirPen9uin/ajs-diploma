/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;

    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target && new.target.name === 'Character') {
      throw new Error('Объект класса Character не может быть создан');
    }
  }

  get briefInformation() {
    return `\u{1F396}${this.level} \u{2694}${this.attack} \u{1F6E1}${this.defence} \u{2764}${this.health}`;
  }

  levelUp() {
    const { health } = this;

    this.attack = Math.floor(Math.max(this.attack, this.attack * ((80 + health) / 100)));
    this.defence = Math.floor(Math.max(this.defence, this.defence * ((80 + health) / 100)));
    this.health = Math.floor(Math.min(health + 80, 100));

    this.level = Math.min(this.level + 1, 4);
  }
}
