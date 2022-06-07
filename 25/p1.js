var url = "https://adventofcode.com/2021/day/25/input";
var testData = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

class Cell {
	constructor() {
		this.Right = null;
		this.Down = null;
		this.SeaCucumber = null;
	}
}

class SeaCucumber {
	constructor(direction, cell) {
		this.Direction = direction;
		this.Cell = cell;
		this.Cell.SeaCucumber = this;
	}
	CanMove() {
		return this.Direction === ">"
			? !this.Cell.Right.SeaCucumber
			: !this.Cell.Down.SeaCucumber;
	}
	Move() {
		this.Cell.SeaCucumber = null;
		this.Cell = this.Direction === ">"
			? this.Cell.Right
			: this.Cell.Down;
		this.Cell.SeaCucumber = this;
	}
}

function render(cells, n) {
	console.log(n === 0 ? "Initial state:" : "After " + n + " step" + (n > 1 ? "s" : "") + ":");
	console.log(cells.map(x => x.map(y => y.SeaCucumber ? y.SeaCucumber.Direction : ".").reduce((a, b) => a + b)).reduce((a, b) => a + "\n" + b));
}

await getInput(true)
	.then(input => {
		input = input
			.split("\n")
			.filter(x => x.length > 0)
			.map(x => x
				.split(""));
		
		// Construct the map
		let cells = [];
		let seaCucumbers = [];
		for (let i = 0; i < input.length; i++) {
			cells[i] = [];
			for (let j = 0; j < input[i].length; j++) {
				cells[i][j] = new Cell();
				if (input[i][j] !== ".") {
					seaCucumbers.push(new SeaCucumber(input[i][j], cells[i][j]));
				}
			}
		}
		
		// Add links between cells
		for (let i = 0; i < cells.length; i++) {
			for (let j = 0; j < cells[i].length; j++) {
				cells[i][j].Right = cells[i][(j + 1) % cells[i].length];
				cells[i][j].Down = cells[(i + 1) % cells.length][j];
			}
		}
		
		let rightSeaCucumbers = seaCucumbers.filter(x => x.Direction === ">");
		let downSeaCucumbers = seaCucumbers.filter(x => x.Direction !== ">");
		
		let n = 0;
		while (true) {
			n++;
			
			let rightSeaCucumbersToMove = rightSeaCucumbers.filter(x => x.CanMove());
			for (let i = 0; i < rightSeaCucumbersToMove.length; i++) {
				rightSeaCucumbersToMove[i].Move();
			}
			
			let downSeaCucumbersToMove = downSeaCucumbers.filter(x => x.CanMove());
			for (let i = 0; i < downSeaCucumbersToMove.length; i++) {
				downSeaCucumbersToMove[i].Move();
			}
			
			if (rightSeaCucumbersToMove.length + downSeaCucumbersToMove.length === 0) {
				break;
			}
		}
		
		return n;
	});