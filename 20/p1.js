var url = "https://adventofcode.com/2021/day/20/input";
var testData = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###
.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.
.#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....
.#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..
...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....
..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

function render(activeCells) {
	let min_i = activeCells[0].i;
	let min_j = activeCells[0].j;
	let max_i = min_i;
	let max_j = min_j;
	
	for (let nCell = 0; nCell < activeCells.length; nCell++) {
		let cell = activeCells[nCell];
		if (cell.i < min_i) min_i = cell.i;
		if (cell.i > max_i) max_i = cell.i;
		if (cell.j < min_j) min_j = cell.j;
		if (cell.j > max_j) max_j = cell.j;
	}
	
	let output = [];
	for (let i = min_i; i <= max_i; i++) {
		output[i - min_i] = [];
		for (let j = min_j; j <= max_j; j++) {
			output[i - min_i][j - min_j] = ".";
		}
	}
	
	for (let nCell = 0; nCell < activeCells.length; nCell++) {
		let cell = activeCells[nCell];
		output[cell.i - min_i][cell.j - min_j] = "#";
	}
	
	console.log(output.map(x => x.reduce((a, b) => a + b)).reduce((a, b) => a + "\n" + b));
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n\n");
		
		let numIterations = 2;
		
		let algorithm = input[0]
			.split("\n")
			.reduce((a, b) => a + b);
		let image = input[1];
		
		// NOTE: The value at 0 is "#" and 511 is ".", so cells outside of the range will oscillate between the two
		// Check if this is the case prior to doing anything with oscillating cells, the test data doesn't have it but the real data does
		
		let activeCells = image
			.split("\n")
			.flatMap((x, i) => x
				.split("")
				.map((y, j) => { return { i: i, j: j, c: y }; }))
			.filter(x => x.c === "#")
			.map(x => { return { i: x.i, j: x.j }; });
		
		let oscillatingCellValue = 0;
		
		let activeCellMap = activeCells
			.reduce((a, b) => { a[b.i + "," + b.j] = { value: 1 }; return a; }, {});
		
		let neighbourOffsets = [[-1,-1], [-1, 0], [-1, 1],
								[ 0,-1], [ 0, 0], [ 0, 1],
								[ 1,-1], [ 1, 0], [ 1, 1]];
		
		//render(activeCells);
		
		for (var iter = 0; iter < numIterations; iter++) {
			// Working copy of the image
			let tmpActiveCells = [];
			
			// Need to check all active cells and all cells that are bordering them
			let cellsToCheck = Object.values(activeCells
				.flatMap(x => neighbourOffsets
					.map(y => { return { i: x.i + y[0], j: x.j + y[1] }; }))
				.reduce((a, b) => { a[b.i + "," + b.j] = b; return a; }, {}));
			
			for (var nCell = 0; nCell < cellsToCheck.length; nCell++) {
				let cell = cellsToCheck[nCell];
				let i = cell.i;
				let j = cell.j;
				
				let neighbours = neighbourOffsets.map(x => [i + x[0], j + x[1]]);
				
				let value = neighbours
					.reduce((a, b) => (a << 1) + (activeCellMap[b[0] + "," + b[1]] ? activeCellMap[b[0] + "," + b[1]].value ? 1 : 0 : oscillatingCellValue), 0);
				
				tmpActiveCells.push({ i: i, j: j, value: algorithm[value] === "#" ? 1 : 0});
			}
			
			// Simultaneous update
			activeCells = tmpActiveCells;
			activeCellMap = activeCells
				.reduce((a, b) => { a[b.i + "," + b.j] = { value: b.value }; return a; }, {});
				
			// Handle cells outside of the active range
			oscillatingCellValue = algorithm[oscillatingCellValue ? 511 : 0] === "#" ? 1 : 0;
				
			//render(activeCells);
		}
		
		return activeCells.filter(x => x.value).length;
	});