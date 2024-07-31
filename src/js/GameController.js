import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';
import {
  Bowman, Daemon, Magician, Swordsman, Undead, Vampire,
} from './characters/characters';
import { generateTeam } from './generators';
import { randomInt } from './utils';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.positionedCharacters = [];

    /**
     * `writable: false`     - запретить присвоение
     * `configurable: false` - запретить удаление
     */
    Object.defineProperties(this, {
      playerCharacterClasses: {
        value: [Bowman, Magician, Swordsman], writable: false, configurable: false,
      },
      enemyCharacterClasses: {
        value: [Daemon, Undead, Vampire], writable: false, configurable: false,
      },
    });

    this.addEventListeners();
  }

  /**
   * Добавляет слушателей событий
   */
  addEventListeners() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  /**
   * Расчет урона
   *
   * @param attacker атакующий персонаж
   * @param target атакованный персонаж
   * @returns number
   */
  static damageCalculation(attacker, target) {
    const attackerAttack = attacker.character.attack;
    const targetDefence = target.character.defence;

    const damageDifferance = attackerAttack - targetDefence;

    const damage = Math.max(damageDifferance, attackerAttack * 0.1);

    return Math.floor(damage);
  }

  /**
   * Генерирует начальные возможные позиции игрока и противника
   *
   * @returns {{enemy: Array, player: Array}}
   */
  generateInitialPositions() {
    const positions = { player: [], enemy: [] };

    for (let index = 0; index < this.gamePlay.boardSize; index += 1) {
      const startRowIndex = index * this.gamePlay.boardSize;

      positions.player.push(startRowIndex);
      positions.player.push(startRowIndex + 1);

      positions.enemy.push(startRowIndex + this.gamePlay.boardSize - 2);
      positions.enemy.push(startRowIndex + this.gamePlay.boardSize - 1);
    }

    return positions;
  }

  init() {
    // TODO: add event listeners to gamePlay events (добавить
    //       прослушиватели событий в события gamePlay)
    this.gamePlay.drawUi(themes.prairie);

    // Определяем количество персонажей
    const characterCount = randomInt(this.gamePlay.boardSize * 2) + 1;
    // Определяем максимальный уровень персонажей
    const characterMaxLevel = randomInt(4) + 1;
    // Создаем начальные возможные позиции игрока и противника
    const initPositions = this.generateInitialPositions();

    // Создаем команды игрока и противника
    const playerTeam = generateTeam(this.playerCharacterClasses, characterMaxLevel, characterCount);
    const enemyTeam = generateTeam(this.enemyCharacterClasses, characterMaxLevel, characterCount);

    // Расставляем персонажей команд игрока и противника
    const positionedPlayerTeam = this.constructor.positioningTeam(playerTeam, initPositions.player);
    const positionedEnemyTeam = this.constructor.positioningTeam(enemyTeam, initPositions.enemy);

    this.positionedCharacters = [...positionedPlayerTeam, ...positionedEnemyTeam];

    this.gamePlay.redrawPositions(this.positionedCharacters);

    this.gameState = { isPlayer: true };

    // TODO: load saved stated from stateService (загрузка сохранена, указанная в StateService)
  }

  /**
   * Проверяет, принадлежит ли персонаж противнику
   *
   * @param positionedCharacter
   * @returns boolean
   */
  isEnemyCharacter(positionedCharacter) {
    return positionedCharacter
      && positionedCharacter.characterInstanceOf(this.enemyCharacterClasses);
  }

  /**
   * Проверяет, принадлежит ли персонаж игроку
   *
   * @param positionedCharacter
   * @returns boolean
   */
  isPlayerCharacter(positionedCharacter) {
    return positionedCharacter
      && positionedCharacter.characterInstanceOf(this.playerCharacterClasses);
  }

  /**
   * Реакция на нажатие
   *
   * @param index номер клетки
   * @returns {Promise<void>}
   */
  async onCellClick(index) {
    const clickedCharacterElement = this.gamePlay.cells[index].querySelector('.character');
    const clickedCharacter = this.positionedCharacters.find(
      (element) => element.position === index,
    );

    if (this.gamePlay.cells[index].classList.contains('selected-green')) {
      this.playerMovement(index);
      return;
    }

    if (this.gamePlay.cells[index].classList.contains('selected-red')) {
      this.playerAttack(index);
      return;
    }

    if (clickedCharacterElement && this.isPlayerCharacter(clickedCharacter)) {
      if (this.selectedCharacter) {
        this.gamePlay.deselectCell(this.selectedCharacter.position);
      }

      this.gamePlay.selectCell(index);
      this.selectedCharacter = clickedCharacter;
    } else {
      GamePlay.showError('Вы не выбрали персонажа или делаете недоступный Вам ход');
    }
  }

  /**
   * Реакция на наведение мыши
   *
   * @param index номер клетки
   */
  onCellEnter(index) {
    const enteredCharacterElement = this.gamePlay.cells[index].querySelector('.character');
    const enteredCharacter = this.positionedCharacters.find(
      (element) => element.position === index,
    );

    // Проверяем, есть ли персонаж в наведенной клетке
    if (enteredCharacterElement) {
      this.gamePlay.showCellTooltip(enteredCharacter.character.briefInformation, index);
    }

    switch (true) {
    case (enteredCharacterElement && this.isPlayerCharacter(enteredCharacter)): {
      this.gamePlay.setCursor(cursors.pointer);
      break;
    }
    case (
      enteredCharacterElement
        && this.isEnemyCharacter(enteredCharacter)
        && Boolean(this.selectedCharacter)
        && this.selectedCharacter.canAttack(index, this.gamePlay.boardSize)
    ): {
      this.gamePlay.selectCell(index, 'red');
      this.gamePlay.setCursor(cursors.crosshair);
      break;
    }
    case (
      !enteredCharacterElement
        && Boolean(this.selectedCharacter)
        && this.selectedCharacter.canMove(index, this.gamePlay.boardSize)
    ): {
      this.gamePlay.selectCell(index, 'green');
      this.gamePlay.setCursor(cursors.pointer);
      break;
    }
    case Boolean(this.selectedCharacter): {
      this.gamePlay.setCursor(cursors.notallowed);
      break;
    }
    default: {
      this.gamePlay.setCursor(cursors.auto);
      break;
    }
    }
  }

  /**
   * Реакция на сведение мыши
   *
   * @param index номер клетки
   */
  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);

    if (!this.gamePlay.cells[index].classList.contains('selected-yellow')) {
      this.gamePlay.deselectCell(index);
    }
  }

  /**
   * Атака игрока
   *
   * @param index номер клетки
   */
  playerAttack(index) {
    const targetCharacter = this.positionedCharacters.find(
      (element) => element.position === index,
    );

    const damage = this.constructor.damageCalculation(this.selectedCharacter, targetCharacter);

    this.gamePlay.showDamage(index, damage).then(() => {
      targetCharacter.character.health -= damage;

      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.gamePlay.deselectCell(index);
      this.gamePlay.deselectCell(this.selectedCharacter.position);

      this.selectedCharacter = undefined;
      this.gameState.isPlayer = false;
    });
  }

  /**
   * Перемещение игрока
   *
   * @param index номер клетки
   */
  playerMovement(index) {
    const oldCharacterPosition = this.selectedCharacter.position;

    this.selectedCharacter.position = index;

    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.deselectCell(index);
    this.gamePlay.deselectCell(oldCharacterPosition);

    this.selectedCharacter = undefined;
    this.gameState.isPlayer = false;
  }

  /**
   * Расставляет персонажей команды на доступные позиции
   *
   * @param team команда
   * @param positions доступные позиции
   * @returns Array<PositionedCharacter>
   */
  static positioningTeam(team, positions) {
    const positionedTeam = [];

    team.characters.forEach((character) => {
      const index = randomInt(positions.length);

      positionedTeam.push(new PositionedCharacter(character, positions[index]));
      positions.splice(index, 1);
    });

    return positionedTeam;
  }
}