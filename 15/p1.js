var url = "https://adventofcode.com/2021/day/15/input";
var testData = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n")
			.filter(x => x)
			.map(x => x.split("").map(y => +y));
		
		var risk = [];
		for (var i = 0; i < input.length; i++) {
			risk[i] = [];
			for (var j = 0; j < input.length; j++) {
				risk[i][j] = Infinity;
			}
		}
		risk[0][0] = 0;
		
		var dirs = [[-1,0],[0,-1],[1,0],[0,1]];

		// I really don't want to try to implement this more efficiently quickly... This should work fine for part 1

		var stable = false;
		while (!stable) {
			stable = true;
			for (var i = 0; i < input.length; i++) {
				for (var j = 0; j < input[i].length; j++) {
					var currRisk = risk[i][j];
					var newRisk = input[i][j] +
						Math.min(...dirs
							.filter(x => i+x[0] >= 0 && i+x[0] < input.length && j+x[1] >= 0 && j+x[1] < input[i].length)
							.map(x => risk[i+x[0]][j+x[1]]));
					if (newRisk < currRisk) {
						risk[i][j] = newRisk;
						stable = false;
					}
				}
			}
		}
		
		// 40
		return risk[input.length - 1][input[input.length - 1].length - 1];
	});