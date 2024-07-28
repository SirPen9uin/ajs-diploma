
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import PositionedCharacter from './PositionedCharacter';
import Swordsman from './characters/Swordsman';
import themes from './themes';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import { generateTeam } from './generators';
import { getRandomInt } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events (добавить
    //       прослушиватели событий в события gamePlay)
    this.gamePlay.drawUi(themes.prairie);

    const characterCount = getRandomInt(this.gamePlay.boardSize * 2) + 1;
    const characterMaxLevel = getRandomInt(4) + 1;

    const ourTeam = generateTeam([Bowman, Magician, Swordsman], characterMaxLevel, characterCount);
    const rivalTeam = generateTeam([Daemon, Undead, Vampire], characterMaxLevel, characterCount);

    const occupiedPositions = [];
    const positions = [];

    ourTeam.characters.forEach((character) => {
      let position;

      do {
        position = getRandomInt(this.gamePlay.boardSize) * this.gamePlay.boardSize
          + getRandomInt(2);
      } while (occupiedPositions.includes(position));

      occupiedPositions.push(position);
      positions.push(new PositionedCharacter(character, position));
    });

    rivalTeam.characters.forEach((character) => {
      let position;

      do {
        position = getRandomInt(this.gamePlay.boardSize) * this.gamePlay.boardSize
          + getRandomInt(2) + 6;
      } while (occupiedPositions.includes(position));

      occupiedPositions.push(position);
      positions.push(new PositionedCharacter(character, position));
    });

    this.gamePlay.redrawPositions(positions);

    // TODO: load saved stated from stateService (загрузка сохранена, указанная в StateService)
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
