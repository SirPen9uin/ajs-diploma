import Character from './Character';

/**
 * Персонаж, привязанный к координате на поле
 *
 * @property character - персонаж
 * @property position - координата на поле
 */
export default class PositionedCharacter {
  /**
   * Конструктор класса PositionedCharacter
   *
   * @param character - персонаж
   * @param position - координата на поле
   */
  constructor(character, position) {
    if (!(character instanceof Character)) { throw new Error('character must be instance of Character or its children'); }

    if (typeof position !== 'number') { throw new Error('position must be a number'); }

    this.character = character;
    this.position = position;
  }

  /**
   * Разбивает координату на поле на отдельные показатели согласно размеру поля
   *
   * @param position - координата на поле
   * @param boardSize - размер поля
   * @returns {{x: number, y: number}} - полученные показатели координаты
   */
  static breakdownIntoCoordinates(position, boardSize) {
    return { x: position % boardSize, y: Math.floor(position / boardSize) };
  }

  /**
   * Определяет, может ли персонаж атаковать
   *
   * @param targetPosition - целевая координата на поле
   * @param boardSize - размер поля
   * @returns boolean
   */
  canAttack(targetPosition, boardSize) {
    if (targetPosition === this.position) { return false; }

    const thisCoordinates = this.constructor.breakdownIntoCoordinates(this.position, boardSize);
    const targetCoordinates = this.constructor.breakdownIntoCoordinates(targetPosition, boardSize);

    const xDifference = Math.abs(thisCoordinates.x - targetCoordinates.x);
    const yDifference = Math.abs(thisCoordinates.y - targetCoordinates.y);

    return xDifference <= this.character.attackRange && yDifference <= this.character.attackRange;
  }

  /**
   * Определяет, может ли персонаж переместиться
   *
   * @param targetPosition - целевая координата на поле
   * @param boardSize - размер поля
   * @returns boolean
   */
  canMove(targetPosition, boardSize) {
    if (targetPosition === this.position) { return false; }

    const thisCoordinates = this.constructor.breakdownIntoCoordinates(this.position, boardSize);
    const targetCoordinates = this.constructor.breakdownIntoCoordinates(targetPosition, boardSize);

    const xDifference = Math.abs(thisCoordinates.x - targetCoordinates.x);
    const yDifference = Math.abs(thisCoordinates.y - targetCoordinates.y);

    return xDifference <= this.character.moveRange && yDifference <= this.character.moveRange
      && (xDifference === 0 || yDifference === 0 || xDifference === yDifference);
  }

  /**
   * Определяет принадлежность персонажа классу
   *
   * @param Class - один класс или массив классов
   * @returns boolean
   */
  characterInstanceOf(Class) {
    if (Array.isArray(Class)) {
      return Boolean(Class.filter((c) => this.character instanceof c).length);
    }

    return this.character instanceof Class;
  }

  /**
   * Расчет урона
   *
   * @param target - атакованный персонаж
   * @returns number - урон
   */
  damageCalculation(target) {
    const attackerAttack = this.character.attack;
    const targetDefence = target.character.defence;

    const damageDifferance = attackerAttack - targetDefence;

    const damage = Math.max(damageDifferance, attackerAttack * 0.1);

    return Math.floor(damage);
  }

  /**
   * Расчет дистанции
   *
   * @param targetPosition - целевая координата на поле
   * @param boardSize - размер поля
   * @returns number - дистанция
   */
  distanceCalculation(targetPosition, boardSize) {
    const thisCoordinates = this.constructor.breakdownIntoCoordinates(this.position, boardSize);
    const targetCoordinates = this.constructor.breakdownIntoCoordinates(targetPosition, boardSize);

    const xDifference = Math.abs(thisCoordinates.x - targetCoordinates.x);
    const yDifference = Math.abs(thisCoordinates.y - targetCoordinates.y);

    return xDifference + yDifference;
  }

  /**
   * Генерирует доступные для перемещения клетки
   *
   * @param positionedCharacters - массив персонажей, привязанных к координатам на поле
   * @param boardSize - размер поля
   * @returns Array<number> - массив координат на поле
   */
  generateMoveableCells(positionedCharacters, boardSize) {
    const availableCells = [];
    const initialLimit = 0;
    const finalLimit = boardSize - 1;
    const occupiedCells = positionedCharacters.map((hero) => hero.position);
    const { x, y } = this.constructor.breakdownIntoCoordinates(this.position, boardSize);

    for (let index = 1; index <= this.character.moveRange; index += 1) {
      const xLeft = x - index;
      const xRight = x + index;
      const yBottom = y + index;
      const yTop = y - index;

      const coordinates = [
        { x, y: yBottom },
        { x, y: yTop },
        { x: xLeft, y },
        { x: xLeft, y: yBottom },
        { x: xLeft, y: yTop },
        { x: xRight, y },
        { x: xRight, y: yBottom },
        { x: xRight, y: yTop },
      ];

      coordinates.forEach((coordinate) => {
        const cell = coordinate.y * boardSize + coordinate.x;

        if (
          coordinate.x >= initialLimit
          && coordinate.x <= finalLimit
          && coordinate.y >= initialLimit
          && coordinate.y <= finalLimit
          && !occupiedCells.includes(cell)
        ) {
          availableCells.push(cell);
        }
      });
    }

    return availableCells;
  }
}
