import { calcTileType } from '../utils';

test.each([
	[0, 8, 'top-left'],
	[1, 8, 'top'],
	[4, 5, 'top-right'],
	[7, 7, 'left'],
	[12, 4, 'bottom-left'],
	[17, 6, 'right'],
	[40, 9, 'center'], 
	[63, 8, 'bottom-right'],
	[75, 9, 'bottom'],
])('Test the calcTileType func with attributes %i and %i', (index, boardSize, expected) => {
	const result = calcTileType(index, boardSize);

	expect(result).toBe(expected);
});