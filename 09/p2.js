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
		
        var map = [];

        // Mark all non-nine locations with unique ids
        for (var i = 0; i < input.length; i++) {
            map[i] = [];
            for (var j = 0; j < input[0].length; j++) {
                var id = j * input.length + i;
                map[i][j] = input[i][j] === 9 ? null : id;
            }
        }

        // Iteratively take the lowest id of all neighbours, until a steady state is reached
        var changed = true;
        while (changed) {
            changed = false;
            for (var i = 0; i < map.length; i++) {
                for (var j = 0; j < map[0].length; j++) {
                    var curr = map[i][j];

                    var lowestNeighbour = [[i - 1, j], [i, j - 1], [i + 1, j], [i, j + 1]]
                        .filter(x => x[0] >= 0 && x[0] < map.length && x[1] >= 0 && x[1] < map[x[0]].length)
                        .map(x => map[x[0]][x[1]])
                        .filter(x => x !== null)
                        .reduce((a, b) => a < b ? a : b, curr);

                    if (lowestNeighbour < curr) {
                        changed = true;
                        map[i][j] = lowestNeighbour;
                    }
                }
            }
        }
		
        // Basin sizes multiplied together
        // Test data result should be 1134

        var basinSizes = map
			.flat()
			.reduce((acc, x) => {
				if (x !== null) {
					if (!acc[x]) acc[x] = 0;
					acc[x]++;
				}
				return acc;
			}, {});

        var sortedBasinSizes = Object.keys(basinSizes)
			.map(x => basinSizes[x])
			.sort((a, b) => b - a);

		return sortedBasinSizes[0] * sortedBasinSizes[1] * sortedBasinSizes[2];
    });
