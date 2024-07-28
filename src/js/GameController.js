import drawUi from './GamePlay'
import themes from './themes'
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import Daemon from './characters/Daemon';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
import { getRandomInt } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);

    const characterCount = getRandomInt(this.gamePlay.boardSize * 2) + 1;
    const characterMaxLevel = getRandomInt(4) + 1;

    const heroTeam = generateTeam([Bowman, Magician, Swordsman], characterMaxLevel, characterCount);
    const evilTeam = generateTeam([Vampire, Undead, Daemon], characterMaxLevel, characterCount);

    const occupiedPositions = [];
    const positions = [];

    heroTeam.characters.forEach((character) => {
      let position;

      do {
        position = getRandomInt(this.gamePlay.boardSize) * this.gamePlay.boardSize + getRandomInt(2);
      } while (occupiedPositions.includes(position));

      occupiedPositions.push(position);
      positions.push(new PositionedCharacter(character, position));
    });

    evilTeam.characters.forEach((character) => {
      let position;

      do {
        position = getRandomInt(this.gamePlay.boardSize) * this.gamePlay.boardSize + getRandomInt(2) + 6;
      } while (occupiedPositions.includes(position));

      occupiedPositions.push(position);
      positions.push(new PositionedCharacter(character, position));
    });

    this.gamePlay.redrawPositions(positions);
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
