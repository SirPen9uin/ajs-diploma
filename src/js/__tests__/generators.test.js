import {
  Bowman, Daemon, Magician, Swordsman, Undead, Vampire
} from '../characters/characters';
import { characterGenerator, generateTeam } from '../generators';
import '../testMethods/toBeInstanceOfArray';

const allowedTypes = [Bowman, Daemon, Magician, Swordsman, Undead, Vampire];

describe('module generators', () => {
  describe('characterGenerator(allowedTypes, 4)', () => {
    test('100 ~ Infinity', () => {
      const characterCount = 100;
      const characters = [];
      const generator = characterGenerator(allowedTypes, 4);

      for (let i = 0; i < characterCount; i += 1) {
        const character = generator.next();

        expect(character.done).toBeFalsy();
        expect(character.value).toBeInstanceOfArray(allowedTypes);

        characters.push(character);
      }

      expect(characters).toHaveLength(characterCount);
    });
  });
  test.each([
    { maxLevel: 2, characterCount: 5 },
    { maxLevel: 3, characterCount: 8 },
    { maxLevel: 4, characterCount: 2 },
  ])('generateTeam(allowedTypes, $maxLevel, $characterCount)', ({ maxLevel, characterCount }) => {
    const team = generateTeam(allowedTypes, maxLevel, characterCount);

    expect(team.characters).toHaveLength(characterCount);

    team.characters.forEach((character) => expect(character.level).toBeLessThanOrEqual(maxLevel));
  });
});