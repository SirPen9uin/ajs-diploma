import GameState from '../GameState';
import GameStateService from '../GameStateService';

describe('class GameStateService', () => {
  describe('[GameStateService]', () => {
    let stateService;
    let storage;

    beforeEach(() => {
      storage = { getItem: jest.fn(), setItem: jest.fn() };
      stateService = new GameStateService(storage);
    });

    describe('.load()', () => {
      test('success', () => {
        storage.getItem.mockReturnValue(null);

        expect(stateService.load()).toBeNull();
      });
      test('throw', () => {
        storage.getItem.mockReturnValue('invalid state');

        expect(() => stateService.load()).toThrow('Invalid state');
      });
    });
    test('.save(state)', () => {
      const gameState = new GameState();

      stateService.save(gameState);

      expect(storage.setItem).toHaveBeenCalledWith('state', JSON.stringify(gameState));
    });
  });
});
