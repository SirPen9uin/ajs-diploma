export default class GameState {
  static hoveredCellPosition;
  static selectedPositionedCharacter;
  static cellHovered() {
    return GameState.hoveredCellPosition !== undefined;
  }

  static positionedCharacterSelected() {
    return GameState.selectedPositionedCharacter !== undefined;
  }
  
  static from(object) {
    // TODO: create object
    return null;
  }
}