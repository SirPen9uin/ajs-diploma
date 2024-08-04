import { calcHealthLevel, calcTileType } from './utils';

/**
 * Класс, отвечающий за взаимодействие с HTML-страницей
 */
export default class GamePlay {
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
  addCellClickListener(callback) { this.cellClickListeners.push(callback); }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) { this.cellEnterListeners.push(callback); }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) { this.cellLeaveListeners.push(callback); }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) { this.loadGameListeners.push(callback); }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) { this.newGameListeners.push(callback); }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) { this.saveGameListeners.push(callback); }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) { throw new Error('container is not HTMLElement'); }

    this.container = container;
  }

  checkBinding() { if (this.container === null) { throw new Error('GamePlay not bind to DOM'); } }

  deselectCell(index) {
    const cell = this.cells[index];

    cell.classList.remove(...Array.from(cell.classList).filter((o) => o.startsWith('selected')));
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

    this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);

    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');

      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.addEventListener('click', (event) => this.onCellClick(event));

      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  hideCellTooltip(index) { this.cells[index].title = ''; }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);

    this.cellClickListeners.forEach((o) => o.call(null, index));
  }

  onCellEnter(event) {
    event.preventDefault();

    const index = this.cells.indexOf(event.currentTarget);

    this.cellEnterListeners.forEach((o) => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();

    const index = this.cells.indexOf(event.currentTarget);

    this.cellLeaveListeners.forEach((o) => o.call(null, index));
  }

  onLoadGameClick(event) {
    event.preventDefault();

    this.loadGameListeners.forEach((o) => o.call(null));
  }

  onNewGameClick(event) {
    event.preventDefault();

    this.newGameListeners.forEach((o) => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();

    this.saveGameListeners.forEach((o) => o.call(null));
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

    positions.forEach((position) => {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
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

  setCursor(cursor) { this.boardEl.style.cursor = cursor; }

  showCellTooltip(message, index) { this.cells[index].title = message; }

  showDamage(index, damage) {
    return new Promise((resolve) => {
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

  static showError(message) { alert(message); } // eslint-disable-line no-alert

  static showMessage(message) { alert(message); } // eslint-disable-line no-alert
}
