import PositionedCharacter from './PositionedCharacter';
import themes from './themes';
import {
  Bowman, Daemon, Magician, Swordsman, Undead, Vampire,
} from './characters/characters';

/**
 * Класс, который хранит текущее состояние игры (может сам себя воссоздавать из другого объекта)
 *
 * @property isOver - закончена ли игра
 * @property isPlayer - идет ли сейчас ход игрока
 * @property level - уровень игры
 * @property positionedEnemyTeam - массив персонажей противника, привязанных к координатам на поле
 * @property positionedPlayerTeam - массив персонажей игрока, привязанных к координатам на поле
 */
export default class GameState {
  /**
   * Конструктор класса GameState
   */
  constructor() {
    this.isOver = false;
    this.isPlayer = true;
    this.level = 1;
    this.positionedEnemyTeam = [];
    this.positionedPlayerTeam = [];
  }

  /**
   * Создает из объекта класс GameState
   *
   * @param object
   * @returns GameState
   */
  static from(object) {
    const characterTypes = {
      bowman: Bowman,
      daemon: Daemon,
      magician: Magician,
      swordsman: Swordsman,
      undead: Undead,
      vampire: Vampire,
    };

    const createCharacter = (characterData) => {
      const CharacterClass = characterTypes[characterData.type];

      if (!CharacterClass) {
        throw new Error('Неизвестный тип персонажа');
      }

      const character = new CharacterClass(characterData.level);

      character.attack = characterData.attack;
      character.defence = characterData.defence;
      character.health = characterData.health;

      return character;
    };

    const gameState = new GameState();

    gameState.isOver = object.isOver;
    gameState.isPlayer = object.isPlayer;
    gameState.level = object.level;
    gameState.positionedEnemyTeam = object.positionedEnemyTeam.map((positionedCharacter) => {
      const character = createCharacter(positionedCharacter.character);

      return new PositionedCharacter(character, positionedCharacter.position);
    });
    gameState.positionedPlayerTeam = object.positionedPlayerTeam.map((positionedCharacter) => {
      const character = createCharacter(positionedCharacter.character);

      return new PositionedCharacter(character, positionedCharacter.position);
    });

    return gameState;
  }

  /**
   * Тема игры
   *
   * @returns string
   */
  get theme() {
    switch (this.level) {
      case 1: {
        return themes.prairie;
      }
      case 2: {
        return themes.desert;
      }
      case 3: {
        return themes.arctic;
      }
      case 4: {
        return themes.mountain;
      }
      default: {
        throw new Error('Unknown level');
      }
    }
  }
}