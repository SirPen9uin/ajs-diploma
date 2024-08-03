import Character from '../Character';
import PositionedCharacter from '../PositionedCharacter';
import {
    Bowman, Daemon, Magician, Swordsman, Undead, Vampire
} from '../characters/characters';

describe('class PositionedCharacter', () => {
    describe('new PositionedCharacter(character, position)', () => {
      let character;
      let position;
  
      beforeAll(() => {
        character = new Bowman(1);
        position = 0;
      });
      afterAll(() => {
        character = undefined;
        position = undefined;
      });
  
      test('success', () => expect(new PositionedCharacter(character, position)).toEqual({ character, position }));
      describe('throw', () => {
        test('character must be instance of Character or its children', () => {
          const throwCharacter = {
            attack: 25, defence: 25, health: 50, level: 1, type: 'bowman',
          };
  
          expect(() => new PositionedCharacter(throwCharacter, position)).toThrow('character must be instance of Character or its children');
        });
        test('position must be a number', () => {
          const throwPosition = '0';
  
          expect(() => new PositionedCharacter(character, throwPosition)).toThrow('position must be a number');
        });
      });
    });
    test.each([
      { position: 0, boardSize: 8, expected: { x: 0, y: 0 } },
      { position: 1, boardSize: 8, expected: { x: 1, y: 0 } },
      { position: 4, boardSize: 5, expected: { x: 4, y: 0 } },
      { position: 7, boardSize: 7, expected: { x: 0, y: 1 } },
      { position: 12, boardSize: 4, expected: { x: 0, y: 3 } },
      { position: 17, boardSize: 6, expected: { x: 5, y: 2 } },
      { position: 40, boardSize: 9, expected: { x: 4, y: 4 } },
      { position: 63, boardSize: 8, expected: { x: 7, y: 7 } },
      { position: 75, boardSize: 9, expected: { x: 3, y: 8 } },
    ])('PositionedCharacter.breakdownIntoCoordinates($position, $boardSize)', ({ position, boardSize, expected }) => {
      expect(PositionedCharacter.breakdownIntoCoordinates(position, boardSize)).toEqual(expected);
    });
    describe('{"character": [Bowman], "position": 27}', () => {
      let positionedCharacter;
  
      beforeAll(() => { positionedCharacter = new PositionedCharacter(new Bowman(1), 27); });
      afterAll(() => { positionedCharacter = undefined; });
  
      test.each([
        { position: 0, expected: false },
        { position: 1, expected: false },
        { position: 2, expected: false },
        { position: 3, expected: false },
        { position: 4, expected: false },
        { position: 5, expected: false },
        { position: 6, expected: false },
        { position: 8, expected: false },
        { position: 9, expected: true },
        { position: 10, expected: true },
        { position: 11, expected: true },
        { position: 12, expected: true },
        { position: 13, expected: true },
        { position: 14, expected: false },
        { position: 16, expected: false },
        { position: 17, expected: true },
        { position: 18, expected: true },
        { position: 19, expected: true },
        { position: 20, expected: true },
        { position: 21, expected: true },
        { position: 22, expected: false },
        { position: 24, expected: false },
        { position: 25, expected: true },
        { position: 26, expected: true },
        { position: 27, expected: false },
        { position: 28, expected: true },
        { position: 29, expected: true },
        { position: 30, expected: false },
        { position: 32, expected: false },
        { position: 33, expected: true },
        { position: 34, expected: true },
        { position: 35, expected: true },
        { position: 36, expected: true },
        { position: 37, expected: true },
        { position: 38, expected: false },
        { position: 40, expected: false },
        { position: 41, expected: true },
        { position: 42, expected: true },
        { position: 43, expected: true },
        { position: 44, expected: true },
        { position: 45, expected: true },
        { position: 46, expected: false },
        { position: 48, expected: false },
        { position: 49, expected: false },
        { position: 50, expected: false },
        { position: 51, expected: false },
        { position: 52, expected: false },
        { position: 53, expected: false },
        { position: 54, expected: false },
      ])('.canAttack($position, 8)', ({ position, expected }) => {
        expect(positionedCharacter.canAttack(position, 8)).toBe(expected);
      });
      test.each([
        { position: 0, expected: false },
        { position: 1, expected: false },
        { position: 2, expected: false },
        { position: 3, expected: false },
        { position: 4, expected: false },
        { position: 5, expected: false },
        { position: 6, expected: false },
        { position: 8, expected: false },
        { position: 9, expected: true },
        { position: 10, expected: false },
        { position: 11, expected: true },
        { position: 12, expected: false },
        { position: 13, expected: true },
        { position: 14, expected: false },
        { position: 16, expected: false },
        { position: 17, expected: false },
        { position: 18, expected: true },
        { position: 19, expected: true },
        { position: 20, expected: true },
        { position: 21, expected: false },
        { position: 22, expected: false },
        { position: 24, expected: false },
        { position: 25, expected: true },
        { position: 26, expected: true },
        { position: 27, expected: false },
        { position: 28, expected: true },
        { position: 29, expected: true },
        { position: 30, expected: false },
        { position: 32, expected: false },
        { position: 33, expected: false },
        { position: 34, expected: true },
        { position: 35, expected: true },
        { position: 36, expected: true },
        { position: 37, expected: false },
        { position: 38, expected: false },
        { position: 40, expected: false },
        { position: 41, expected: true },
        { position: 42, expected: false },
        { position: 43, expected: true },
        { position: 44, expected: false },
        { position: 45, expected: true },
        { position: 46, expected: false },
        { position: 48, expected: false },
        { position: 49, expected: false },
        { position: 50, expected: false },
        { position: 51, expected: false },
        { position: 52, expected: false },
        { position: 53, expected: false },
        { position: 54, expected: false },
      ])('.canMove($position, 8)', ({ position, expected }) => {
        expect(positionedCharacter.canMove(position, 8)).toBe(expected);
      });
      test.each([
        { Class: Bowman, expected: true },
        { Class: Character, expected: true },
        { Class: Vampire, expected: false },
        { Class: [Bowman, Magician, Swordsman], expected: true },
        { Class: [Daemon, Undead, Vampire], expected: false },
      ])('.characterInstanceOf($Class}', ({ Class, expected }) => {
        expect(positionedCharacter.characterInstanceOf(Class)).toBe(expected);
      });
      test.each([
        { target: new PositionedCharacter(new Daemon(1), 18), expected: 15 },
        { target: new PositionedCharacter(new Undead(1), 19), expected: 15 },
        { target: new PositionedCharacter(new Vampire(1), 20), expected: 2 },
      ])('.damageCalculation($target)', ({ target, expected }) => {
        expect(positionedCharacter.damageCalculation(target)).toBe(expected);
      });
      test.each([
        { position: 0, expected: 6 },
        { position: 9, expected: 4 },
        { position: 18, expected: 2 },
        { position: 27, expected: 0 },
        { position: 36, expected: 2 },
        { position: 45, expected: 4 },
        { position: 54, expected: 6 },
        { position: 63, expected: 8 },
      ])('.distanceCalculation($position, 8)', ({ position, expected }) => {
        expect(positionedCharacter.distanceCalculation(position, 8)).toBe(expected);
      });
      test.each([
        { characters: [], expected: [9, 11, 13, 18, 19, 20, 25, 26, 28, 29, 34, 35, 36, 41, 43, 45] },
        {
          characters: [
            new PositionedCharacter(new Daemon(1), 18),
            new PositionedCharacter(new Undead(1), 19),
            new PositionedCharacter(new Vampire(1), 20),
          ],
          expected: [9, 11, 13, 25, 26, 28, 29, 34, 35, 36, 41, 43, 45],
        },
      ])('.generateMoveableCells($characters, 8)', ({ characters, expected }) => {
        const cells = positionedCharacter.generateMoveableCells(characters, 8);
  
        expect(cells).toEqual(expect.arrayContaining(expected));
        expect(cells).toHaveLength(expected.length);
      });
    });
  });