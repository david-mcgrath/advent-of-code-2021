var url = "https://adventofcode.com/2021/day/9/input";
var testData = `2199943210
3987894921
9856789892
8767896789
9899965678`;

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
			.map(x => x.split("").map(x => +x));
		
        var lowPoints = [];

        for (var i = 0; i < input.length; i++) {
            for (var j = 0; j < input[0].length; j++) {
                var curr = input[i][j];

                var lowestNeighbour = [[i - 1, j], [i, j - 1], [i + 1, j], [i, j + 1]]
                    .filter(x => x[0] >= 0 && x[0] < input.length && x[1] >= 0 && x[1] < input[x[0]].length)
                    .map(x => input[x[0]][x[1]])
                    .reduce((a, b) => a < b ? a : b);

                if (curr < lowestNeighbour) {
                    lowPoints.push(curr);
                }
            }
        }
			
		return lowPoints
			.map(x => x + 1)
			.reduce((a, b) => a + b);
    });
