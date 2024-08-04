import Character from '../Character';
import GameState from '../GameState';
import PositionedCharacter from '../PositionedCharacter';

describe('class GameState', () => {
  describe('new GameState()', () => {
    test('success', () => {
      const gameState = new GameState();

      expect(gameState).toHaveProperty('isOver', false);
      expect(gameState).toHaveProperty('isPlayer', true);
      expect(gameState).toHaveProperty('level', 1);
      expect(gameState).toHaveProperty('positionedEnemyTeam', []);
      expect(gameState).toHaveProperty('positionedPlayerTeam', []);
    });
  });
  describe('GameState.from(object)', () => {
    test('success', () => {
      const data = {
        isOver: false,
        isPlayer: true,
        level: 2,
        positionedEnemyTeam: [
          {
            character: {
              level: 2, attack: 13, defence: 13, health: 100, type: 'daemon',
            },
            position: 38,
          },
          {
            character: {
              level: 1, attack: 40, defence: 10, health: 50, type: 'undead',
            },
            position: 55,
          },
          {
            character: {
              level: 1, attack: 40, defence: 10, health: 50, type: 'undead',
            },
            position: 15,
          },
        ],
        positionedPlayerTeam: [
          {
            character: {
              level: 2, attack: 52, defence: 13, health: 100, type: 'swordsman',
            },
            position: 32,
          },
          {
            character: {
              level: 2, attack: 50, defence: 12, health: 100, type: 'swordsman',
            },
            position: 56,
          },
          {
            character: {
              level: 2, attack: 32, defence: 32, health: 100, type: 'bowman',
            },
            position: 17,
          },
        ],
      };
      const gameState = GameState.from(data);

      expect(gameState).toEqual(data);

      gameState.positionedEnemyTeam.forEach((positionedCharacter) => {
        expect(positionedCharacter).toBeInstanceOf(PositionedCharacter);
        expect(positionedCharacter.character).toBeInstanceOf(Character);
      });

      gameState.positionedPlayerTeam.forEach((positionedCharacter) => {
        expect(positionedCharacter).toBeInstanceOf(PositionedCharacter);
        expect(positionedCharacter.character).toBeInstanceOf(Character);
      });
    });
    test('throw', () => {
      const data = {
        isOver: false,
        isPlayer: true,
        level: 1,
        positionedEnemyTeam: [
          {
            character: {
              level: 1, attack: 0, defence: 0, health: 50, type: 'character',
            },
            position: 38,
          },
        ],
        positionedPlayerTeam: [
          {
            character: {
              level: 1, attack: 0, defence: 0, health: 50, type: 'character',
            },
            position: 38,
          },
        ],
      };

      expect(() => GameState.from(data)).toThrow(Error);
    });
  });
  describe('[GameState]', () => {
    test.each([
      { level: 0, expected: undefined },
      { level: 1, expected: 'prairie' },
      { level: 2, expected: 'desert' },
      { level: 3, expected: 'arctic' },
      { level: 4, expected: 'mountain' },
      { level: 5, expected: undefined },
    ])('.theme($level)', ({ level, expected }) => {
      const gameState = new GameState();
      gameState.level = level;

      if (expected !== undefined) {
        expect(gameState.theme).toBe(expected);
      } else {
        expect(() => gameState.theme).toThrow(Error);
      }
    });
  });
});
