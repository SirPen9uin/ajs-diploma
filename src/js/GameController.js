import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter';
import {
  Bowman, Daemon, Magician, Swordsman, Undead, Vampire,
} from './characters/characters';
import { generateTeam } from './generators';
import { randomInt } from './utils';
import cursors from './cursors';
import Computer from './Computer';
import GameState from './GameState';
import Team from './Team';

/**
 * Класс, отвечающий за логику приложения
 *
 * @property gamePlay - объект, отвечающий за взаимодействие с HTML-страницей
 * @property gameState - объект, который хранит текущее состояние игры
 * @property computer - объект, отвечающий за действия компьютера
 * @property stateService - объект, который взаимодействует с текущим состоянием
 * @property playerTeam - команда игрока
 * @property positionedCharacters - массив персонажей, привязанных к координатам на поле
 * @property-read playerCharacterClasses - массив классов игрока
 * @property-read enemyCharacterClasses - массив классов противника
 */
export default class GameController {
  /**
   * Конструктор класса GameController
   *
   * @param gamePlay - объект, отвечающий за взаимодействие с HTML-страницей
   * @param stateService - объект, который взаимодействует с текущим состоянием
   */
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.computer = new Computer(this.gamePlay.boardSize);

    // `writable: false`     - запретить присвоение
    // `configurable: false` - запретить удаление
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

    this.gamePlay.addLoadGameListener(() => this.loadingGame());
    this.gamePlay.addNewGameListener(() => this.init());
    this.gamePlay.addSaveGameListener(() => this.savingGame());
  }

  /**
   * Ответные действия компьютера
   */
  computerResponse() {
    if (!this.gameState.isPlayer) {
      const timeout = 500;

      const computerAttack = this.computer.calculatingAttack(
        this.gameState.positionedEnemyTeam,
        this.gameState.positionedPlayerTeam,
      );

      if (computerAttack) {
        this.gamePlay.selectCell(computerAttack.enemyHero.position);
        this.selectedCharacter = computerAttack.enemyHero;

        setTimeout(() => {
          this.gamePlay.selectCell(computerAttack.playerHero.position, 'red');

          setTimeout(() => { this.heroAttack(computerAttack.playerHero.position); }, timeout);
        }, timeout);

        return;
      }

      const computerMovement = this.computer.calculatingMovement(
        this.gameState.positionedEnemyTeam,
        this.gameState.positionedPlayerTeam,
      );

      this.gamePlay.selectCell(computerMovement.enemyHero.position);
      this.selectedCharacter = computerMovement.enemyHero;

      setTimeout(() => {
        this.gamePlay.selectCell(computerMovement.planMoveCell, 'green');

        setTimeout(() => { this.heroMovement(computerMovement.planMoveCell); }, timeout);
      }, timeout);
    }
  }

  /**
   * Завершение игры
   */
  gameOver() {
    this.gameState.isOver = true;
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.setCursor(cursors.auto);

    const isWin = this.gameState.positionedEnemyTeam.length === 0;

    setTimeout(() => { GamePlay.showMessage(isWin ? 'Вы выиграли!' : 'Вы проиграли!'); }, 100);
  }

  /**
   * Генерирует начальные возможные координаты на поле для игрока и противника
   *
   * @returns {{enemy: Array<number>, player: Array<number>}} - объект, содержавший два массива
   * возможных координат на поле
   */
  generateInitialPositions() {
    const positions = { player: [], enemy: [] };

    for (let index = 0; index < this.gamePlay.boardSize; index += 1) {
      const row = index * this.gamePlay.boardSize;

      positions.player.push(row);
      positions.player.push(row + 1);

      positions.enemy.push(row + this.gamePlay.boardSize - 2);
      positions.enemy.push(row + this.gamePlay.boardSize - 1);
    }

    return positions;
  }

  /**
   * Атака героя
   *
   * @param index - координата на поле
   */
  heroAttack(index) {
    const targetCharacterIndex = this.positionedCharacters.findIndex(
      (hero) => hero.position === index,
    );
    const targetCharacter = this.positionedCharacters[targetCharacterIndex];

    const damage = this.selectedCharacter.damageCalculation(targetCharacter);

    this.gamePlay.showDamage(index, damage).then(() => {
      targetCharacter.character.health -= damage;

      if (targetCharacter.character.health <= 0) {
        if (this.gameState.isPlayer) {
          this.gameState.positionedEnemyTeam = this.gameState.positionedEnemyTeam.filter(
            (hero) => hero !== targetCharacter,
          );

          this.positionedCharacters = [
            ...this.gameState.positionedPlayerTeam,
            ...this.gameState.positionedEnemyTeam,
          ];

          if (this.gameState.positionedEnemyTeam.length === 0) {
            this.gamePlay.deselectCell(index);
            this.gamePlay.deselectCell(this.selectedCharacter.position);
            this.gamePlay.setCursor(cursors.auto);

            this.selectedCharacter = undefined;

            this.levelUp();

            return;
          }
        } else {
          this.gameState.positionedPlayerTeam = this.gameState.positionedPlayerTeam.filter(
            (hero) => hero !== targetCharacter,
          );

          this.positionedCharacters = [
            ...this.gameState.positionedPlayerTeam,
            ...this.gameState.positionedEnemyTeam,
          ];

          if (this.gameState.positionedPlayerTeam.length === 0) {
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
   * @param index - координата на поле
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
   * Инициализация игры
   */
  init() {
    this.gameState = new GameState();

    const characterCount = 2;
    const {
      enemy: enemyInitPositions,
      player: playerInitPositions,
    } = this.generateInitialPositions();

    this.playerTeam = generateTeam(
      this.playerCharacterClasses,
      this.gameState.level,
      characterCount,
    );
    this.gameState.positionedPlayerTeam = this.constructor.positioningTeam(
      this.playerTeam,
      playerInitPositions,
    );

    this.enemyTeam = generateTeam(this.enemyCharacterClasses, this.gameState.level, characterCount);
    this.gameState.positionedEnemyTeam = this.constructor.positioningTeam(
      this.enemyTeam,
      enemyInitPositions,
    );

    this.positionedCharacters = [
      ...this.gameState.positionedPlayerTeam,
      ...this.gameState.positionedEnemyTeam,
    ];

    this.gamePlay.drawUi(this.gameState.theme);
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.setCursor(cursors.auto);
  }

  /**
   * Проверяет, является ли персонаж противником
   *
   * @param positionedCharacter - персонаж, привязанный к координате на поле
   * @returns boolean
   */
  isEnemyCharacter(positionedCharacter) {
    return positionedCharacter
      && positionedCharacter.characterInstanceOf(this.enemyCharacterClasses);
  }

  /**
   * Проверяет, является ли персонаж игроком
   *
   * @param positionedCharacter - персонаж, привязанный к координате на поле
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

    if (this.gameState.level === 4) {
      this.gameOver();

      return;
    }

    this.gameState.level += 1;

    this.gamePlay.drawUi(this.gameState.theme);

    const characterCount = this.gameState.positionedPlayerTeam.length + 1;
    const {
      enemy: enemyInitPositions,
      player: playerInitPositions,
    } = this.generateInitialPositions();

    this.playerTeam = generateTeam(this.playerCharacterClasses, this.gameState.level, 1);

    this.gameState.positionedPlayerTeam.forEach((hero) => {
      hero.character.levelUp();
      this.playerTeam.addCharacter(hero.character);
    });

    this.gameState.positionedPlayerTeam = this.constructor.positioningTeam(
      this.playerTeam,
      playerInitPositions,
    );

    this.enemyTeam = generateTeam(this.enemyCharacterClasses, this.gameState.level, characterCount);
    this.gameState.positionedEnemyTeam = this.constructor.positioningTeam(
      this.enemyTeam,
      enemyInitPositions,
    );

    this.positionedCharacters = [
      ...this.gameState.positionedPlayerTeam,
      ...this.gameState.positionedEnemyTeam,
    ];

    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  /**
   * Загрузка игры из сохранения
   *
   * @returns boolean
   */
  loadingGame() {
    const data = this.stateService.load();

    if (!data) {
      GamePlay.showMessage('Нет сохраненных игр');

      return false;
    }

    this.gameState = GameState.from(data);

    this.enemyTeam = new Team(this.gameState.positionedEnemyTeam.map(
      (positionedCharacter) => positionedCharacter.character,
    ));
    this.playerTeam = new Team(this.gameState.positionedPlayerTeam.map(
      (positionedCharacter) => positionedCharacter.character,
    ));

    this.positionedCharacters = [
      ...this.gameState.positionedPlayerTeam,
      ...this.gameState.positionedEnemyTeam,
    ];

    this.gamePlay.drawUi(this.gameState.theme);
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.setCursor(cursors.auto);

    return true;
  }

  /**
   * Реакция на нажатие
   *
   * @param index - координата на поле
   */
  onCellClick(index) {
    if (this.gameState.isOver) { return; }

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
        if (this.selectedCharacter) { this.gamePlay.deselectCell(this.selectedCharacter.position); }

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
   * @param index - координата на поле
   */
  onCellEnter(index) {
    if (this.gameState.isOver) { return; }

    const enteredCharacterElement = this.gamePlay.cells[index].querySelector('.character');
    const enteredCharacter = this.positionedCharacters.find(
      (element) => element.position === index,
    );

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
        default: { this.gamePlay.setCursor(cursors.auto); }
      }
    }
  }

  /**
   * Реакция на сведение мыши
   *
   * @param index - координата на поле
   */
  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);

    if (!this.gamePlay.cells[index].classList.contains('selected-yellow')) { this.gamePlay.deselectCell(index); }
  }

  /**
   * Расставляет персонажей команды на доступные позиции
   *
   * @param team - команда
   * @param positions - массив координат на поле
   * @returns Array<PositionedCharacter> - массив персонажей, привязанных к координатам на поле
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

  /**
   * Сохранение игры
   */
  savingGame() {
    this.stateService.save(this.gameState);

    GamePlay.showMessage('Игра сохранена');
  }
}
