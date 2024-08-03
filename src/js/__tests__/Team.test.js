import {
    Bowman, Magician, Swordsman,
} from '../characters/characters';

import Team from '../Team';

describe('class Team', () => {
    describe('new Team(characters)', () => {
      test('success', () => {
        const characters = [new Bowman(1), new Magician(1), new Swordsman(1)];
  
        expect(new Team(characters)).toEqual({ characters });
      });
    });
    describe('[Team]', () => {
      test('addCharacter(character)', () => {
        const character = new Bowman(1);
        const team = new Team();
        team.addCharacter(character);
  
        expect(team).toEqual({ characters: [character] });
      });
    });
  });