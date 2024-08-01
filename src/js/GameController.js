import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';
import {
  Bowman, Daemon, Magician, Swordsman, Undead, Vampire,
} from './characters/characters';
import { generateTeam } from './generators';
import { randomInt } from './utils';
import cursors from './cursors';
import Computer from './Computer';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.computer = new Computer(this.gamePlay.boardSize);

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

    this.gamePlay.addNewGameListener(() => this.init());
  }

  /**
   * Ответные действия компьютера
   */
  computerResponse() {
    if (!this.gameState.isPlayer) {
      const timeout = 500;

      const computerAttack = this.computer.calculatingAttack(
        this.positionedEnemyTeam,
        this.positionedPlayerTeam,
      );

      if (computerAttack) {
        this.gamePlay.selectCell(computerAttack.enemyHero.position);
        this.selectedCharacter = computerAttack.enemyHero;

        setTimeout(() => {
          this.gamePlay.selectCell(computerAttack.playerHero.position, 'red');

          setTimeout(() => {
            this.heroAttack(computerAttack.playerHero.position);
          }, timeout);
        }, timeout);

        return;
      }

      const computerMovement = this.computer.calculatingMovement(
        this.positionedEnemyTeam,
        this.positionedPlayerTeam,
      );

      this.gamePlay.selectCell(computerMovement.enemyHero.position);
      this.selectedCharacter = computerMovement.enemyHero;

      setTimeout(() => {
        this.gamePlay.selectCell(computerMovement.planMoveCell, 'green');

        setTimeout(() => {
          this.heroMovement(computerMovement.planMoveCell);
        }, timeout);
      }, timeout);
    }
  }

  gameOver() {
    this.gameState.isOver = true;
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.setCursor(cursors.auto);

    const isWin = this.positionedEnemyTeam.length === 0;

    setTimeout(() => {
      GamePlay.showMessage(isWin ? 'Победа!' : 'Поражение...');
    }, 100);
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

  /**
   * Атака героя
   *
   * @param index номер клетки
   */
  heroAttack(index) {
    const targetCharacterIndex = this.positionedCharacters.findIndex(
      (hero) => hero.position === index,
    );
    const targetCharacter = this.positionedCharacters[targetCharacterIndex];

    const damage = Computer.damageCalculation(this.selectedCharacter, targetCharacter);

    this.gamePlay.showDamage(index, damage).then(() => {
      targetCharacter.character.health -= damage;

      if (targetCharacter.character.health <= 0) {
        if (this.gameState.isPlayer) {
          this.positionedEnemyTeam = this.positionedEnemyTeam.filter(
            (hero) => hero !== targetCharacter,
          );
          this.positionedCharacters = [...this.positionedPlayerTeam, ...this.positionedEnemyTeam];

          if (this.positionedEnemyTeam.length === 0) {
            this.gamePlay.deselectCell(index);
            this.gamePlay.deselectCell(this.selectedCharacter.position);
            this.gamePlay.setCursor(cursors.auto);

            this.selectedCharacter = undefined;

            this.levelUp();
            return;
          }
        } else {
          this.positionedPlayerTeam = this.positionedPlayerTeam.filter(
            (hero) => hero !== targetCharacter,
          );
          this.positionedCharacters = [...this.positionedPlayerTeam, ...this.positionedEnemyTeam];

          if (this.positionedPlayerTeam.length === 0) {

            this.gamePlay.deselectCell(index);
            this.gamePlay.deselectCell(this.selectedCharacter.position);
            this.gamePlay.setCursor(cursors.auto);

            this.selectedCharacter = undefined;

            this.gameOver();
            return;
          }
        }
      }

      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.gamePlay.deselectCell(index);
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.gamePlay.setCursor(cursors.auto);

      this.selectedCharacter = undefined;
      this.gameState.isPlayer = !this.gameState.isPlayer;

      this.computerResponse();
    });
  }

  /**
   * Перемещение героя
   *
   * @param index номер клетки
   */
  heroMovement(index) {
    const oldCharacterPosition = this.selectedCharacter.position;

    this.selectedCharacter.position = index;

    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.deselectCell(index);
    this.gamePlay.deselectCell(oldCharacterPosition);
    this.gamePlay.setCursor(cursors.auto);

    this.selectedCharacter = undefined;
    this.gameState.isPlayer = !this.gameState.isPlayer;

    this.computerResponse();
  }

  /**
   * Инициализация
   */
  init() {
    this.gameState = { 
      isOver: false,
      isPlayer: true, 
      level: 1, 
      theme: themes.prairie };

    // TODO: add event listeners to gamePlay events (добавить
    //       прослушиватели событий в события gamePlay)
    this.gamePlay.drawUi(this.gameState.theme);

    // Определяем количество персонажей
    const characterCount = 1;// randomInt(this.gamePlay.boardSize * 2) + 1;
    // Создаем начальные возможные позиции игрока и противника
    const initPositions = this.generateInitialPositions();

    // Создаем команды игрока и противника
    this.playerTeam = generateTeam(
      this.playerCharacterClasses,
      this.gameState.level,
      characterCount,
    );
    const enemyTeam = generateTeam(
      this.enemyCharacterClasses,
      this.gameState.level,
      characterCount,
    );

    // Расставляем персонажей команд игрока и противника
    this.positionedPlayerTeam = this.constructor.positioningTeam(
      this.playerTeam,
      initPositions.player,
    );
    this.positionedEnemyTeam = this.constructor.positioningTeam(enemyTeam, initPositions.enemy);
    this.positionedCharacters = [...this.positionedPlayerTeam, ...this.positionedEnemyTeam];

    this.gamePlay.redrawPositions(this.positionedCharacters);

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
   * Повышение уровня
   */
  levelUp() {
    this.gameState.isPlayer = true;
    this.gameState.level += 1;

    switch (this.gameState.level) {
    case 1: {
      this.gameState.theme = themes.prairie;
      break;
    }
    case 2: {
      this.gameState.theme = themes.desert;
      break;
    }
    case 3: {
      this.gameState.theme = themes.arctic;
      break;
    }
    case 4: {
      this.gameState.theme = themes.mountain;
      break;
    }
    case 5: {
      this.gameOver();
      break;
    }
    default: {
      throw new Error('Неизвестный уровень');
    }
    }

    this.gamePlay.drawUi(this.gameState.theme);

    const characterCount = 1;
    const initPositions = this.generateInitialPositions();

    this.playerTeam.characters = [];
    const enemyTeam = generateTeam(
      this.enemyCharacterClasses,
      this.gameState.level,
      characterCount,
    );

    this.positionedPlayerTeam.forEach((hero) => {
      hero.character.levelUp();
      this.playerTeam.characters.push(hero.character);
    });

    this.positionedPlayerTeam = this.constructor.positioningTeam(
      this.playerTeam,
      initPositions.player,
    );
    this.positionedEnemyTeam = this.constructor.positioningTeam(enemyTeam, initPositions.enemy);
    this.positionedCharacters = [...this.positionedPlayerTeam, ...this.positionedEnemyTeam];

    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  /**
   * Реакция на нажатие
   *
   * @param index номер клетки
   */
  onCellClick(index) {
    if(this.gameState.isOver) {
      return;
    }

    if (this.gameState.isPlayer) {
      const clickedCharacterElement = this.gamePlay.cells[index].querySelector('.character');
      const clickedCharacter = this.positionedCharacters.find(
        (element) => element.position === index,
      );

      if (this.gamePlay.cells[index].classList.contains('selected-green')) {
        this.heroMovement(index);
        return;
      }

      if (this.gamePlay.cells[index].classList.contains('selected-red')) {
        this.heroAttack(index);
        return;
      }

      if (clickedCharacterElement && this.isPlayerCharacter(clickedCharacter)) {
        if (this.selectedCharacter) {
          this.gamePlay.deselectCell(this.selectedCharacter.position);
        }

        this.gamePlay.selectCell(index);
        this.selectedCharacter = clickedCharacter;
        return;
      }
    }

    GamePlay.showError('Вы не выбрали персонажа или делаете недоступный Вам ход');
  }

  /**
   * Реакция на наведение мыши
   *
   * @param index номер клетки
   */
  onCellEnter(index) {
    if(this.gameState.isOver){
      return;
    }
    const enteredCharacterElement = this.gamePlay.cells[index].querySelector('.character');
    const enteredCharacter = this.positionedCharacters.find(
      (element) => element.position === index,
    );

    // Проверяем, есть ли персонаж в наведенной клетке
    if (enteredCharacterElement) {
      this.gamePlay.showCellTooltip(enteredCharacter.character.briefInformation, index);
    }

    if (this.gameState.isPlayer) {
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