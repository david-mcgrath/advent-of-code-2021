var url = "https://adventofcode.com/2021/day/13/input";
var testData = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

function applyFold(dots, foldAxis, foldLineNum) {
	if (foldAxis === "y") {
		return dots
			.map(x => [x[0], x[1] > foldLineNum ? 2 * foldLineNum - x[1] : x[1]]);
	}
	else {
		return dots
			.map(x => [x[0] > foldLineNum ? 2 * foldLineNum - x[0] : x[0], x[1]]);
	}
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n\n")
			.filter(x => x)
			.map(x => x
				.split("\n")
				.filter(x => x));
		
		var dots = input[0]
			.map(x => x
				.split(",")
				.map(y => +y));

		var folds = input[1]
			.map(x => x
				.split(" ")[2]
				.split("="))
			.map(x => [x[0], +x[1]]);

		for (var i = 0; i < folds.length; i++) {
			dots = applyFold(dots, folds[i][0], folds[i][1]);
		}

		// var minX = Math.min(...dots.map(x => x[0]));
		// var minY = Math.min(...dots.map(x => x[1]));
		var maxX = Math.max(...dots.map(x => x[0]));
		var maxY = Math.max(...dots.map(x => x[1]));
		
		var output = [];
		for (var i = 0; i <= maxY; i++) {
			output[i] = [];
			for (var j = 0; j <= maxX; j++) {
				output[i][j] = ".";
			}
		}
		
		for (var i = 0; i < dots.length; i++) {
			output[dots[i][1]][dots[i][0]] = "#";
		}
		
		console.log(output
			.map(x => x
				.reduce((a, b) => a + b))
			.reduce((a, b) => a + "\n" + b));
	});