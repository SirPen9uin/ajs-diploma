/**
 * Класс для команды (набор персонажей), представляющих компьютер и игрока
 *
 * @property characters - массив персонажей
 *
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  /**
   * Конструктор класса Team
   *
   * @param characters - массив персонажей
   */
  constructor(characters = []) { this.characters = characters; }

  /**
   * Добавление персонажа
   *
   * @param character - персонаж
   */
  addCharacter(character) { this.characters.push(character); }
}
