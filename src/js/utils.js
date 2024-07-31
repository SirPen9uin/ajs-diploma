/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  const topRow = index < boardSize;
  const bottomRow = index >= boardSize * (boardSize - 1);
  const leftColumn = index % boardSize === 0;
  const rightColumn = index % boardSize === boardSize - 1;

  switch (true) {
  case topRow && leftColumn:
    return 'top-left';

  case topRow && rightColumn:
    return 'top-right';

  case bottomRow && leftColumn:
    return 'bottom-left';

  case bottomRow && rightColumn:
    return 'bottom-right';

  case topRow && !(leftColumn || rightColumn):
    return 'top';

  case bottomRow && !(leftColumn || rightColumn):
    return 'bottom';

  case !(topRow || bottomRow) && rightColumn:
    return 'right';

  case !(topRow || bottomRow) && leftColumn:
    return 'left';

  default:
    return 'center'; 
  }
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function randomInt(max) {
  return Math.floor(Math.random() * max);
}