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
  const indexes = {
    'bottom-left': boardSize * (boardSize - 1),
    'bottom-right': (boardSize * boardSize) - 1,
    'top-left': 0,
    'top-right': boardSize - 1,
  };

  switch (true) {
  case index === indexes['top-left']:
    return 'top-left';

  case index === indexes['top-right']:
    return 'top-right';

  case index > indexes['top-left'] && index < indexes['top-right']:
    return 'top';

  case index === indexes['bottom-left']:
    return 'bottom-left';

  case index === indexes['bottom-right']:
    return 'bottom-right';

  case index > indexes['bottom-left'] && index < indexes['bottom-right']:
    return 'bottom';

  case index % boardSize === indexes['top-right']:
    return 'right';

  case index % boardSize === indexes['top-left']:
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

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}