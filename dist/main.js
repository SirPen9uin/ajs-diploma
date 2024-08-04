/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/Character.js":
/*!*****************************!*\
  !*** ./src/js/Character.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Character)
/* harmony export */ });
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
class Character {
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
    const {
      health
    } = this;
    this.attack = Math.floor(Math.max(this.attack, this.attack * ((80 + health) / 100)));
    this.defence = Math.floor(Math.max(this.defence, this.defence * ((80 + health) / 100)));
    this.health = Math.floor(Math.min(health + 80, 100));
    this.level = Math.min(this.level + 1, 4);
  }
}

/***/ }),

/***/ "./src/js/Computer.js":
/*!****************************!*\
  !*** ./src/js/Computer.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Computer)
/* harmony export */ });
class Computer {
  constructor(boardSize) {
    this.boardSize = boardSize;
  }

  /**
   * Расчет атки
   *
   * @param positionedEnemyTeam команда противника
   * @param positionedPlayerTeam команда игрока
   * @returns {{enemyHero: PositionedCharacter, playerHero: PositionedCharacter} | false}
   */
  calculatingAttack(positionedEnemyTeam, positionedPlayerTeam) {
    const killOptions = [];
    let maxDamage = -Infinity;
    let minDistance = Infinity;
    let targetEnemyHero = null;
    let targetPlayerHero = null;
    positionedEnemyTeam.forEach(enemyHero => {
      positionedPlayerTeam.forEach(playerHero => {
        if (enemyHero.canAttack(playerHero.position, this.boardSize)) {
          const damage = enemyHero.damageCalculation(playerHero);
          if (playerHero.character.health - damage <= 0) {
            killOptions.push([enemyHero, playerHero]);
          }
          const distance = enemyHero.distanceCalculation(playerHero.position, this.boardSize);
          if (damage > maxDamage || damage === maxDamage && distance < minDistance) {
            maxDamage = damage;
            minDistance = distance;
            targetEnemyHero = enemyHero;
            targetPlayerHero = playerHero;
          }
        }
      });
    });
    if (killOptions.length) {
      minDistance = Infinity;
      targetEnemyHero = null;
      targetPlayerHero = null;
      killOptions.forEach(([enemyHero, playerHero]) => {
        const distance = enemyHero.distanceCalculation(playerHero.position, this.boardSize);
        if (distance < minDistance) {
          minDistance = distance;
          targetEnemyHero = enemyHero;
          targetPlayerHero = playerHero;
        }
      });
    }
    if (targetEnemyHero && targetPlayerHero) {
      return {
        enemyHero: targetEnemyHero,
        playerHero: targetPlayerHero
      };
    }
    return false;
  }

  /**
   * Расчет перемещения
   *
   * @returns {{enemyHero: PositionedCharacter, planMoveCell: number}}
   */
  calculatingMovement(positionedEnemyTeam, positionedPlayerTeam) {
    const positionedCharacters = [...positionedEnemyTeam, ...positionedPlayerTeam];
    let minDistanceBeforeMoving = Infinity;
    let minDistanceAfterMoving = Infinity;
    let targetEnemyHero = null;
    let targetPlanMoveCell = null;
    positionedEnemyTeam.forEach(enemyHero => {
      const moveableCells = enemyHero.generateMoveableCells(positionedCharacters, this.boardSize);
      positionedPlayerTeam.forEach(playerHero => {
        const distanceBeforeMoving = enemyHero.distanceCalculation(playerHero.position, this.boardSize);
        let distanceAfterMoving = Infinity;
        let planMoveCell = null;
        moveableCells.forEach(cell => {
          const distance = playerHero.distanceCalculation(cell, this.boardSize);
          if (distance < distanceAfterMoving) {
            distanceAfterMoving = distance;
            planMoveCell = cell;
          }
        });
        if (distanceBeforeMoving < minDistanceBeforeMoving || distanceBeforeMoving === minDistanceBeforeMoving && distanceAfterMoving < minDistanceAfterMoving) {
          minDistanceBeforeMoving = distanceBeforeMoving;
          minDistanceAfterMoving = distanceAfterMoving;
          targetEnemyHero = enemyHero;
          targetPlanMoveCell = planMoveCell;
        }
      });
    });
    return {
      enemyHero: targetEnemyHero,
      planMoveCell: targetPlanMoveCell
    };
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
}

/***/ }),

/***/ "./src/js/GameController.js":
/*!**********************************!*\
  !*** ./src/js/GameController.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameController)
/* harmony export */ });
/* harmony import */ var _GamePlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GamePlay */ "./src/js/GamePlay.js");
/* harmony import */ var _PositionedCharacter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PositionedCharacter */ "./src/js/PositionedCharacter.js");
/* harmony import */ var _characters_characters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./characters/characters */ "./src/js/characters/characters.js");
/* harmony import */ var _generators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./generators */ "./src/js/generators.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var _cursors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cursors */ "./src/js/cursors.js");
/* harmony import */ var _Computer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Computer */ "./src/js/Computer.js");
/* harmony import */ var _GameState__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./GameState */ "./src/js/GameState.js");
/* harmony import */ var _Team__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Team */ "./src/js/Team.js");










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
class GameController {
  /**
   * Конструктор класса GameController
   *
   * @param gamePlay - объект, отвечающий за взаимодействие с HTML-страницей
   * @param stateService - объект, который взаимодействует с текущим состоянием
   */
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.computer = new _Computer__WEBPACK_IMPORTED_MODULE_6__["default"](this.gamePlay.boardSize);

    // `writable: false`     - запретить присвоение
    // `configurable: false` - запретить удаление
    Object.defineProperties(this, {
      playerCharacterClasses: {
        value: [_characters_characters__WEBPACK_IMPORTED_MODULE_2__.Bowman, _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Magician, _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Swordsman],
        writable: false,
        configurable: false
      },
      enemyCharacterClasses: {
        value: [_characters_characters__WEBPACK_IMPORTED_MODULE_2__.Daemon, _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Undead, _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Vampire],
        writable: false,
        configurable: false
      }
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
      const computerAttack = this.computer.calculatingAttack(this.gameState.positionedEnemyTeam, this.gameState.positionedPlayerTeam);
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
      const computerMovement = this.computer.calculatingMovement(this.gameState.positionedEnemyTeam, this.gameState.positionedPlayerTeam);
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

  /**
   * Завершение игры
   */
  gameOver() {
    this.gameState.isOver = true;
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].auto);
    const isWin = this.gameState.positionedEnemyTeam.length === 0;
    setTimeout(() => {
      _GamePlay__WEBPACK_IMPORTED_MODULE_0__["default"].showMessage(isWin ? 'Вы выиграли!' : 'Вы проиграли!');
    }, 100);
  }

  /**
   * Генерирует начальные возможные координаты на поле для игрока и противника
   *
   * @returns {{enemy: Array<number>, player: Array<number>}} - объект, содержавший два массива
   * возможных координат на поле
   */
  generateInitialPositions() {
    const positions = {
      player: [],
      enemy: []
    };
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
    const targetCharacterIndex = this.positionedCharacters.findIndex(hero => hero.position === index);
    const targetCharacter = this.positionedCharacters[targetCharacterIndex];
    const damage = this.selectedCharacter.damageCalculation(targetCharacter);
    this.gamePlay.showDamage(index, damage).then(() => {
      targetCharacter.character.health -= damage;
      if (targetCharacter.character.health <= 0) {
        if (this.gameState.isPlayer) {
          this.gameState.positionedEnemyTeam = this.gameState.positionedEnemyTeam.filter(hero => hero !== targetCharacter);
          this.positionedCharacters = [...this.gameState.positionedPlayerTeam, ...this.gameState.positionedEnemyTeam];
          if (this.gameState.positionedEnemyTeam.length === 0) {
            this.gamePlay.deselectCell(index);
            this.gamePlay.deselectCell(this.selectedCharacter.position);
            this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].auto);
            this.selectedCharacter = undefined;
            this.levelUp();
            return;
          }
        } else {
          this.gameState.positionedPlayerTeam = this.gameState.positionedPlayerTeam.filter(hero => hero !== targetCharacter);
          this.positionedCharacters = [...this.gameState.positionedPlayerTeam, ...this.gameState.positionedEnemyTeam];
          if (this.gameState.positionedPlayerTeam.length === 0) {
            this.gamePlay.deselectCell(index);
            this.gamePlay.deselectCell(this.selectedCharacter.position);
            this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].auto);
            this.selectedCharacter = undefined;
            this.gameOver();
            return;
          }
        }
      }
      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.gamePlay.deselectCell(index);
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].auto);
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
    this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].auto);
    this.selectedCharacter = undefined;
    this.gameState.isPlayer = !this.gameState.isPlayer;
    this.computerResponse();
  }

  /**
   * Инициализация игры
   */
  init() {
    this.gameState = new _GameState__WEBPACK_IMPORTED_MODULE_7__["default"]();
    const characterCount = 2;
    const {
      enemy: enemyInitPositions,
      player: playerInitPositions
    } = this.generateInitialPositions();
    this.playerTeam = (0,_generators__WEBPACK_IMPORTED_MODULE_3__.generateTeam)(this.playerCharacterClasses, this.gameState.level, characterCount);
    this.gameState.positionedPlayerTeam = this.constructor.positioningTeam(this.playerTeam, playerInitPositions);
    this.enemyTeam = (0,_generators__WEBPACK_IMPORTED_MODULE_3__.generateTeam)(this.enemyCharacterClasses, this.gameState.level, characterCount);
    this.gameState.positionedEnemyTeam = this.constructor.positioningTeam(this.enemyTeam, enemyInitPositions);
    this.positionedCharacters = [...this.gameState.positionedPlayerTeam, ...this.gameState.positionedEnemyTeam];
    this.gamePlay.drawUi(this.gameState.theme);
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].auto);
  }

  /**
   * Проверяет, является ли персонаж противником
   *
   * @param positionedCharacter - персонаж, привязанный к координате на поле
   * @returns boolean
   */
  isEnemyCharacter(positionedCharacter) {
    return positionedCharacter && positionedCharacter.characterInstanceOf(this.enemyCharacterClasses);
  }

  /**
   * Проверяет, является ли персонаж игроком
   *
   * @param positionedCharacter - персонаж, привязанный к координате на поле
   * @returns boolean
   */
  isPlayerCharacter(positionedCharacter) {
    return positionedCharacter && positionedCharacter.characterInstanceOf(this.playerCharacterClasses);
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
      player: playerInitPositions
    } = this.generateInitialPositions();
    this.playerTeam = (0,_generators__WEBPACK_IMPORTED_MODULE_3__.generateTeam)(this.playerCharacterClasses, this.gameState.level, 1);
    this.gameState.positionedPlayerTeam.forEach(hero => {
      hero.character.levelUp();
      this.playerTeam.addCharacter(hero.character);
    });
    this.gameState.positionedPlayerTeam = this.constructor.positioningTeam(this.playerTeam, playerInitPositions);
    this.enemyTeam = (0,_generators__WEBPACK_IMPORTED_MODULE_3__.generateTeam)(this.enemyCharacterClasses, this.gameState.level, characterCount);
    this.gameState.positionedEnemyTeam = this.constructor.positioningTeam(this.enemyTeam, enemyInitPositions);
    this.positionedCharacters = [...this.gameState.positionedPlayerTeam, ...this.gameState.positionedEnemyTeam];
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
      _GamePlay__WEBPACK_IMPORTED_MODULE_0__["default"].showMessage('Нет сохраненных игр');
      return false;
    }
    this.gameState = _GameState__WEBPACK_IMPORTED_MODULE_7__["default"].from(data);
    this.enemyTeam = new _Team__WEBPACK_IMPORTED_MODULE_8__["default"](this.gameState.positionedEnemyTeam.map(positionedCharacter => positionedCharacter.character));
    this.playerTeam = new _Team__WEBPACK_IMPORTED_MODULE_8__["default"](this.gameState.positionedPlayerTeam.map(positionedCharacter => positionedCharacter.character));
    this.positionedCharacters = [...this.gameState.positionedPlayerTeam, ...this.gameState.positionedEnemyTeam];
    this.gamePlay.drawUi(this.gameState.theme);
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].auto);
    return true;
  }

  /**
   * Реакция на нажатие
   *
   * @param index - координата на поле
   */
  onCellClick(index) {
    if (this.gameState.isOver) {
      return;
    }
    if (this.gameState.isPlayer) {
      const clickedCharacterElement = this.gamePlay.cells[index].querySelector('.character');
      const clickedCharacter = this.positionedCharacters.find(element => element.position === index);
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
    _GamePlay__WEBPACK_IMPORTED_MODULE_0__["default"].showError('Вы не выбрали персонажа или делаете недоступный Вам ход');
  }

  /**
   * Реакция на наведение мыши
   *
   * @param index - координата на поле
   */
  onCellEnter(index) {
    if (this.gameState.isOver) {
      return;
    }
    const enteredCharacterElement = this.gamePlay.cells[index].querySelector('.character');
    const enteredCharacter = this.positionedCharacters.find(element => element.position === index);
    if (enteredCharacterElement) {
      this.gamePlay.showCellTooltip(enteredCharacter.character.briefInformation, index);
    }
    if (this.gameState.isPlayer) {
      switch (true) {
        case enteredCharacterElement && this.isPlayerCharacter(enteredCharacter):
          {
            this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].pointer);
            break;
          }
        case enteredCharacterElement && this.isEnemyCharacter(enteredCharacter) && Boolean(this.selectedCharacter) && this.selectedCharacter.canAttack(index, this.gamePlay.boardSize):
          {
            this.gamePlay.selectCell(index, 'red');
            this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].crosshair);
            break;
          }
        case !enteredCharacterElement && Boolean(this.selectedCharacter) && this.selectedCharacter.canMove(index, this.gamePlay.boardSize):
          {
            this.gamePlay.selectCell(index, 'green');
            this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].pointer);
            break;
          }
        case Boolean(this.selectedCharacter):
          {
            this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].notallowed);
            break;
          }
        default:
          {
            this.gamePlay.setCursor(_cursors__WEBPACK_IMPORTED_MODULE_5__["default"].auto);
          }
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
    if (!this.gamePlay.cells[index].classList.contains('selected-yellow')) {
      this.gamePlay.deselectCell(index);
    }
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
    team.characters.forEach(character => {
      const index = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.randomInt)(positions.length);
      positionedTeam.push(new _PositionedCharacter__WEBPACK_IMPORTED_MODULE_1__["default"](character, positions[index]));
      positions.splice(index, 1);
    });
    return positionedTeam;
  }

  /**
   * Сохранение игры
   */
  savingGame() {
    this.stateService.save(this.gameState);
    _GamePlay__WEBPACK_IMPORTED_MODULE_0__["default"].showMessage('Игра сохранена');
  }
}

/***/ }),

/***/ "./src/js/GamePlay.js":
/*!****************************!*\
  !*** ./src/js/GamePlay.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GamePlay)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");


/**
 * Класс, отвечающий за взаимодействие с HTML-страницей
 */
class GamePlay {
  /**
   * Конструктор класса GamePlay
   */
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }
  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }
  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList).filter(o => o.startsWith('selected')));
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();
    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;
    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');
    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));
    this.boardEl = this.container.querySelector('[data-id=board]');
    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${(0,_utils__WEBPACK_IMPORTED_MODULE_0__.calcTileType)(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }
    this.cells = Array.from(this.boardEl.children);
  }
  hideCellTooltip(index) {
    this.cells[index].title = '';
  }
  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }
  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach(o => o.call(null, index));
  }
  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }
  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }
  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }
  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (let cellIndex = 0; cellIndex < this.cells.length; cellIndex += 1) {
      this.cells[cellIndex].innerHTML = '';
    }
    positions.forEach(position => {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);
      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');
      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${(0,_utils__WEBPACK_IMPORTED_MODULE_0__.calcHealthLevel)(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);
      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    });
  }
  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }
  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }
  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }
  showDamage(index, damage) {
    return new Promise(resolve => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);
      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }
  static showError(message) {
    alert(message);
  } // eslint-disable-line no-alert

  static showMessage(message) {
    alert(message);
  } // eslint-disable-line no-alert
}

/***/ }),

/***/ "./src/js/GameState.js":
/*!*****************************!*\
  !*** ./src/js/GameState.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameState)
/* harmony export */ });
/* harmony import */ var _PositionedCharacter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PositionedCharacter */ "./src/js/PositionedCharacter.js");
/* harmony import */ var _themes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./themes */ "./src/js/themes.js");
/* harmony import */ var _characters_characters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./characters/characters */ "./src/js/characters/characters.js");




/**
 * Класс, который хранит текущее состояние игры (может сам себя воссоздавать из другого объекта)
 *
 * @property isOver - закончена ли игра
 * @property isPlayer - идет ли сейчас ход игрока
 * @property level - уровень игры
 * @property positionedEnemyTeam - массив персонажей противника, привязанных к координатам на поле
 * @property positionedPlayerTeam - массив персонажей игрока, привязанных к координатам на поле
 */
class GameState {
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
      bowman: _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Bowman,
      daemon: _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Daemon,
      magician: _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Magician,
      swordsman: _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Swordsman,
      undead: _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Undead,
      vampire: _characters_characters__WEBPACK_IMPORTED_MODULE_2__.Vampire
    };
    const createCharacter = characterData => {
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
    gameState.positionedEnemyTeam = object.positionedEnemyTeam.map(positionedCharacter => {
      const character = createCharacter(positionedCharacter.character);
      return new _PositionedCharacter__WEBPACK_IMPORTED_MODULE_0__["default"](character, positionedCharacter.position);
    });
    gameState.positionedPlayerTeam = object.positionedPlayerTeam.map(positionedCharacter => {
      const character = createCharacter(positionedCharacter.character);
      return new _PositionedCharacter__WEBPACK_IMPORTED_MODULE_0__["default"](character, positionedCharacter.position);
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
      case 1:
        {
          return _themes__WEBPACK_IMPORTED_MODULE_1__["default"].prairie;
        }
      case 2:
        {
          return _themes__WEBPACK_IMPORTED_MODULE_1__["default"].desert;
        }
      case 3:
        {
          return _themes__WEBPACK_IMPORTED_MODULE_1__["default"].arctic;
        }
      case 4:
        {
          return _themes__WEBPACK_IMPORTED_MODULE_1__["default"].mountain;
        }
      default:
        {
          throw new Error('Unknown level');
        }
    }
  }
}

/***/ }),

/***/ "./src/js/GameStateService.js":
/*!************************************!*\
  !*** ./src/js/GameStateService.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameStateService)
/* harmony export */ });
class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }
  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }
  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}

/***/ }),

/***/ "./src/js/PositionedCharacter.js":
/*!***************************************!*\
  !*** ./src/js/PositionedCharacter.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PositionedCharacter)
/* harmony export */ });
/* harmony import */ var _Character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Character */ "./src/js/Character.js");


/**
 * Персонаж, привязанный к координате на поле
 *
 * @property character - персонаж
 * @property position - координата на поле
 */
class PositionedCharacter {
  /**
   * Конструктор класса PositionedCharacter
   *
   * @param character - персонаж
   * @param position - координата на поле
   */
  constructor(character, position) {
    if (!(character instanceof _Character__WEBPACK_IMPORTED_MODULE_0__["default"])) {
      throw new Error('character must be instance of Character or its children');
    }
    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }
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
    return {
      x: position % boardSize,
      y: Math.floor(position / boardSize)
    };
  }

  /**
   * Определяет, может ли персонаж атаковать
   *
   * @param targetPosition - целевая координата на поле
   * @param boardSize - размер поля
   * @returns boolean
   */
  canAttack(targetPosition, boardSize) {
    if (targetPosition === this.position) {
      return false;
    }
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
    if (targetPosition === this.position) {
      return false;
    }
    const thisCoordinates = this.constructor.breakdownIntoCoordinates(this.position, boardSize);
    const targetCoordinates = this.constructor.breakdownIntoCoordinates(targetPosition, boardSize);
    const xDifference = Math.abs(thisCoordinates.x - targetCoordinates.x);
    const yDifference = Math.abs(thisCoordinates.y - targetCoordinates.y);
    return xDifference <= this.character.moveRange && yDifference <= this.character.moveRange && (xDifference === 0 || yDifference === 0 || xDifference === yDifference);
  }

  /**
   * Определяет принадлежность персонажа классу
   *
   * @param Class - один класс или массив классов
   * @returns boolean
   */
  characterInstanceOf(Class) {
    if (Array.isArray(Class)) {
      return Boolean(Class.filter(c => this.character instanceof c).length);
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
    const occupiedCells = positionedCharacters.map(hero => hero.position);
    const {
      x,
      y
    } = this.constructor.breakdownIntoCoordinates(this.position, boardSize);
    for (let index = 1; index <= this.character.moveRange; index += 1) {
      const xLeft = x - index;
      const xRight = x + index;
      const yBottom = y + index;
      const yTop = y - index;
      const coordinates = [{
        x,
        y: yBottom
      }, {
        x,
        y: yTop
      }, {
        x: xLeft,
        y
      }, {
        x: xLeft,
        y: yBottom
      }, {
        x: xLeft,
        y: yTop
      }, {
        x: xRight,
        y
      }, {
        x: xRight,
        y: yBottom
      }, {
        x: xRight,
        y: yTop
      }];
      coordinates.forEach(coordinate => {
        const cell = coordinate.y * boardSize + coordinate.x;
        if (coordinate.x >= initialLimit && coordinate.x <= finalLimit && coordinate.y >= initialLimit && coordinate.y <= finalLimit && !occupiedCells.includes(cell)) {
          availableCells.push(cell);
        }
      });
    }
    return availableCells;
  }
}

/***/ }),

/***/ "./src/js/Team.js":
/*!************************!*\
  !*** ./src/js/Team.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Team)
/* harmony export */ });
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
class Team {
  /**
   * Конструктор класса Team
   *
   * @param characters - массив персонажей
   */
  constructor(characters = []) {
    this.characters = characters;
  }

  /**
   * Добавление персонажа
   *
   * @param character - персонаж
   */
  addCharacter(character) {
    this.characters.push(character);
  }
}

/***/ }),

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GamePlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GamePlay */ "./src/js/GamePlay.js");
/* harmony import */ var _GameController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameController */ "./src/js/GameController.js");
/* harmony import */ var _GameStateService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameStateService */ "./src/js/GameStateService.js");
/**
 * Entry point of app: don't change this
 */



const gamePlay = new _GamePlay__WEBPACK_IMPORTED_MODULE_0__["default"]();
gamePlay.bindToDOM(document.querySelector('#game-container'));
const stateService = new _GameStateService__WEBPACK_IMPORTED_MODULE_2__["default"](localStorage);
const gameCtrl = new _GameController__WEBPACK_IMPORTED_MODULE_1__["default"](gamePlay, stateService);
gameCtrl.init();

// don't write your code here

/***/ }),

/***/ "./src/js/characterTypes.js":
/*!**********************************!*\
  !*** ./src/js/characterTypes.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const characterTypes = {
  bowman: 'bowman',
  swordsman: 'swordsman',
  magician: 'magician',
  vampire: 'vampire',
  undead: 'undead',
  daemon: 'daemon'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (characterTypes);

/***/ }),

/***/ "./src/js/characters/Bowman.js":
/*!*************************************!*\
  !*** ./src/js/characters/Bowman.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Bowman)
/* harmony export */ });
/* harmony import */ var _Character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Character */ "./src/js/Character.js");
/* harmony import */ var _characterTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../characterTypes */ "./src/js/characterTypes.js");


class Bowman extends _Character__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(level) {
    super(1, _characterTypes__WEBPACK_IMPORTED_MODULE_1__["default"].bowman);
    this.attack = 25;
    this.defence = 25;
    for (let index = 1; index < level; index += 1) {
      this.levelUp();
    }
    Object.defineProperties(this, {
      attackRange: {
        value: 2,
        writable: false,
        configurable: false
      },
      moveRange: {
        value: 2,
        writable: false,
        configurable: false
      }
    });
  }
}

/***/ }),

/***/ "./src/js/characters/Daemon.js":
/*!*************************************!*\
  !*** ./src/js/characters/Daemon.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Daemon)
/* harmony export */ });
/* harmony import */ var _Character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Character */ "./src/js/Character.js");
/* harmony import */ var _characterTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../characterTypes */ "./src/js/characterTypes.js");


class Daemon extends _Character__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(level) {
    super(1, _characterTypes__WEBPACK_IMPORTED_MODULE_1__["default"].daemon);
    this.attack = 10;
    this.defence = 10;
    for (let index = 1; index < level; index += 1) {
      this.levelUp();
    }
    Object.defineProperties(this, {
      attackRange: {
        value: 4,
        writable: false,
        configurable: false
      },
      moveRange: {
        value: 1,
        writable: false,
        configurable: false
      }
    });
  }
}

/***/ }),

/***/ "./src/js/characters/Magician.js":
/*!***************************************!*\
  !*** ./src/js/characters/Magician.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Magician)
/* harmony export */ });
/* harmony import */ var _Character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Character */ "./src/js/Character.js");
/* harmony import */ var _characterTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../characterTypes */ "./src/js/characterTypes.js");


class Magician extends _Character__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(level) {
    super(1, _characterTypes__WEBPACK_IMPORTED_MODULE_1__["default"].magician);
    this.attack = 10;
    this.defence = 40;
    for (let index = 1; index < level; index += 1) {
      this.levelUp();
    }
    Object.defineProperties(this, {
      attackRange: {
        value: 4,
        writable: false,
        configurable: false
      },
      moveRange: {
        value: 1,
        writable: false,
        configurable: false
      }
    });
  }
}

/***/ }),

/***/ "./src/js/characters/Swordsman.js":
/*!****************************************!*\
  !*** ./src/js/characters/Swordsman.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Swordsman)
/* harmony export */ });
/* harmony import */ var _Character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Character */ "./src/js/Character.js");
/* harmony import */ var _characterTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../characterTypes */ "./src/js/characterTypes.js");


class Swordsman extends _Character__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(level) {
    super(1, _characterTypes__WEBPACK_IMPORTED_MODULE_1__["default"].swordsman);
    this.attack = 40;
    this.defence = 10;
    for (let index = 1; index < level; index += 1) {
      this.levelUp();
    }
    Object.defineProperties(this, {
      attackRange: {
        value: 1,
        writable: false,
        configurable: false
      },
      moveRange: {
        value: 4,
        writable: false,
        configurable: false
      }
    });
  }
}

/***/ }),

/***/ "./src/js/characters/Undead.js":
/*!*************************************!*\
  !*** ./src/js/characters/Undead.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Undead)
/* harmony export */ });
/* harmony import */ var _Character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Character */ "./src/js/Character.js");
/* harmony import */ var _characterTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../characterTypes */ "./src/js/characterTypes.js");


class Undead extends _Character__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(level) {
    super(1, _characterTypes__WEBPACK_IMPORTED_MODULE_1__["default"].undead);
    this.attack = 40;
    this.defence = 10;
    for (let index = 1; index < level; index += 1) {
      this.levelUp();
    }
    Object.defineProperties(this, {
      attackRange: {
        value: 1,
        writable: false,
        configurable: false
      },
      moveRange: {
        value: 4,
        writable: false,
        configurable: false
      }
    });
  }
}

/***/ }),

/***/ "./src/js/characters/Vampire.js":
/*!**************************************!*\
  !*** ./src/js/characters/Vampire.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Vampire)
/* harmony export */ });
/* harmony import */ var _Character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Character */ "./src/js/Character.js");
/* harmony import */ var _characterTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../characterTypes */ "./src/js/characterTypes.js");


class Vampire extends _Character__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(level) {
    super(1, _characterTypes__WEBPACK_IMPORTED_MODULE_1__["default"].vampire);
    this.attack = 25;
    this.defence = 25;
    for (let index = 1; index < level; index += 1) {
      this.levelUp();
    }
    Object.defineProperties(this, {
      attackRange: {
        value: 2,
        writable: false,
        configurable: false
      },
      moveRange: {
        value: 2,
        writable: false,
        configurable: false
      }
    });
  }
}

/***/ }),

/***/ "./src/js/characters/characters.js":
/*!*****************************************!*\
  !*** ./src/js/characters/characters.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bowman: () => (/* reexport safe */ _Bowman__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   Daemon: () => (/* reexport safe */ _Daemon__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   Magician: () => (/* reexport safe */ _Magician__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   Swordsman: () => (/* reexport safe */ _Swordsman__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   Undead: () => (/* reexport safe */ _Undead__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   Vampire: () => (/* reexport safe */ _Vampire__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _Bowman__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bowman */ "./src/js/characters/Bowman.js");
/* harmony import */ var _Daemon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Daemon */ "./src/js/characters/Daemon.js");
/* harmony import */ var _Magician__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Magician */ "./src/js/characters/Magician.js");
/* harmony import */ var _Swordsman__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Swordsman */ "./src/js/characters/Swordsman.js");
/* harmony import */ var _Undead__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Undead */ "./src/js/characters/Undead.js");
/* harmony import */ var _Vampire__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Vampire */ "./src/js/characters/Vampire.js");








/***/ }),

/***/ "./src/js/cursors.js":
/*!***************************!*\
  !*** ./src/js/cursors.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const cursors = {
  auto: 'auto',
  pointer: 'pointer',
  crosshair: 'crosshair',
  notallowed: 'not-allowed'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cursors);

/***/ }),

/***/ "./src/js/generators.js":
/*!******************************!*\
  !*** ./src/js/generators.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   characterGenerator: () => (/* binding */ characterGenerator),
/* harmony export */   generateTeam: () => (/* binding */ generateTeam)
/* harmony export */ });
/* harmony import */ var _Team__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Team */ "./src/js/Team.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");



/**
 * Формирует экземпляр персонажа из массива allowedTypes со случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове возвращает новый экземпляр класса персонажа
 */
function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  while (true) {
    const characterClassIndex = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.randomInt)(allowedTypes.length);
    const characterLevel = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.randomInt)(maxLevel) + 1;
    yield new allowedTypes[characterClassIndex](characterLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде -
 * characterCount
 */
function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const characters = [];
  const playerGenerator = characterGenerator(allowedTypes, maxLevel);
  for (let index = 0; index < characterCount; index += 1) {
    characters.push(playerGenerator.next().value);
  }
  return new _Team__WEBPACK_IMPORTED_MODULE_0__["default"](characters);
}

/***/ }),

/***/ "./src/js/themes.js":
/*!**************************!*\
  !*** ./src/js/themes.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (themes);

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calcHealthLevel: () => (/* binding */ calcHealthLevel),
/* harmony export */   calcTileType: () => (/* binding */ calcTileType),
/* harmony export */   randomInt: () => (/* binding */ randomInt)
/* harmony export */ });
/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  const topRow = index < boardSize;
  const bottomRow = index >= boardSize * (boardSize - 1);
  const leftColumn = index % boardSize === 0;
  const rightColumn = index % boardSize === boardSize - 1;
  switch (true) {
    case topRow && leftColumn:
      return 'top-left';
    case topRow && rightColumn:
      return 'top-right';
    case bottomRow && leftColumn:
      return 'bottom-left';
    case bottomRow && rightColumn:
      return 'bottom-right';
    case topRow && !(leftColumn || rightColumn):
      return 'top';
    case bottomRow && !(leftColumn || rightColumn):
      return 'bottom';
    case !(topRow || bottomRow) && rightColumn:
      return 'right';
    case !(topRow || bottomRow) && leftColumn:
      return 'left';
    default:
      return 'center';
  }
}
function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }
  if (health < 50) {
    return 'normal';
  }
  return 'high';
}
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

/***/ }),

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/style.css */ "./src/css/style.css");
/* harmony import */ var _js_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/app */ "./src/js/app.js");



// Точка входа webpack
// Не пишите код в данном файле
/******/ })()
;
//# sourceMappingURL=main.js.map