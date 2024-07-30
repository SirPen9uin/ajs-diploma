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

  canCharacterAttack(position, boardSize) {
    const positionColunm = this.position % boardSize;
    const positionRow = Math.floor(position / boardSize);
    const thisPositionColumn = this.position % boardSize;
    const thisPositionRow = Math.floor(this.position / boardSize);

    return Math.abs(positionRow - thisPositionRow) <= this.character.attackRange && Math.abs(positionColunm - thisPositionColumn) <= this.character.attackRange;
  }

  canCharacterDriving(position, boardSize) {
    const positionColunm = this.position % boardSize;
    const positionRow = Math.floor(position / boardSize);
    const thisPositionColumn = this.position % boardSize;
    const thisPositionRow = Math.floor(this.position / boardSize);

  switch (true) {
    
    case positionColumn === thisPositionColumn:
      return Math.abs(positionRow - thisPositionRow) <= this.character.drivingRange;
    
    case positionRow === thisPositionRow:
      return Math.abs(positionColumn - thisPositionColumn) <= this.character.drivingRange; 

    case positionColunm + positionRow === thisPositionColumn + thisPositionRow:
    case positionColunm - positionRow === thisPositionColumn - thisPositionRow:
      return Math.abs(positionRow - thisPositionRow) <= this.character.drivingRange && Math.abs(positionColumn - thisPositionColumn) <= this.character.drivingRange;

    default:
      return false;
    }
  }

  characterInstanceOf(Class) {
    if (Array.isArray(Class)) {
      return Boolean(Class.filter((c) => this.character instanceof c).length);
    }

    return this.character instanceof Class;
  }
}
