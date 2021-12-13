var url = "https://adventofcode.com/2021/day/11/input";
var testData = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

var adjacent = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];

function tick(map) {
	var flashes = [];
	
	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			map[i][j]++;
			if (map[i][j] === 10) {
				flashes.push([i,j]);
			}
		}
	}
	
	for (var k = 0; k < flashes.length; k++) {
		var flash = flashes[k];
		for (var l = 0; l < adjacent.length; l++) {
			var i = flash[0] + adjacent[l][0];
			var j = flash[1] + adjacent[l][1];
			
			if (i >= 0 && i < map.length && j >= 0 && j < map[i].length) {
				map[i][j]++;
				if (map[i][j] === 10) {
					flashes.push([i,j]);
				}
			}
		}
	}
	
	for (var k = 0; k < flashes.length; k++) {
		map[flashes[k][0]][flashes[k][1]] = 0;
	}
	
	return flashes.length;
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n")
			.filter(x => x)
            .map(x => x
                .split("")
                .map(y => +y));
		
		var map = input.map(x => x.map(y => y));
		
		var total = 0;
		
		for (var i = 0; i < 100; i++) {
			total += tick(map);
		}
		
		return total;
	});