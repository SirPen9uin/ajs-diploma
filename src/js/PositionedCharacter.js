import Character from './Character';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
  }

  /**
   * Определяет, может ли персонаж атаковать
   *
   * @param position - проверяемая позиция
   * @param boardSize - размер поля
   * @returns {boolean}
   */
  canAttack(position, boardSize) {
    const columnDifference = Math.abs((this.position % boardSize) - (position % boardSize));
    const rowDifference = Math.abs(
      Math.floor(this.position / boardSize) - Math.floor(position / boardSize),
    );

    return columnDifference <= this.character.attackRange
      && rowDifference <= this.character.attackRange;
  }

  /**
   * Определяет, может ли персонаж переместиться
   *
   * @param position - проверяемая позиция
   * @param boardSize - размер поля
   * @returns {boolean}
   */
  canMove(position, boardSize) {
    const columnDifference = Math.abs((this.position % boardSize) - (position % boardSize));
    const rowDifference = Math.abs(
      Math.floor(this.position / boardSize) - Math.floor(position / boardSize),
    );

    return columnDifference <= this.character.moveRange
      && rowDifference <= this.character.moveRange
      && (columnDifference === 0 || rowDifference === 0 || columnDifference === rowDifference);
  }

  /**
   * Определяет принадлежность персонажа классу
   *
   * @param Class - один класс или массив классов
   * @returns {boolean}
   */
  characterInstanceOf(Class) {
    if (Array.isArray(Class)) {
      return Boolean(Class.filter((c) => this.character instanceof c).length);
    }

    return this.character instanceof Class;
  }
}