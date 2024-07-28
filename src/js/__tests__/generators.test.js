import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import { characterGenerator, generateTeam } from '../generators';
import '../testMethods/toBeInstanceOfArray';

const allowedTypes = [Bowman, Daemon, Magician, Swordsman, Undead, Vampire];

describe('characterGenerator', () => {
  test('should generate characters indefinitely from allowedTypes', () => {
    const generator = characterGenerator(allowedTypes, 4);

    for (let i = 0; i < 100; i += 1) { // проверяем первые 100 персонажей
      const result = generator.next();

      expect(result.done).toBeFalsy();
      expect(result.value).toBeInstanceOfArray(allowedTypes);
    }
  });
});

describe('generateTeam', () => {
  test.each([
    [2, 5],
    [3, 8],
    [4, 2],
  ])('should create characters in the right number and range of levels (maxLevel: %i, characterCount: %i)', (maxLevel, characterCount) => {
    const team = generateTeam(allowedTypes, maxLevel, characterCount);

    expect(team.characters).toHaveLength(characterCount);

    team.characters.forEach((character) => {
      expect(character.level).toBeLessThanOrEqual(maxLevel);
    });
  });
});