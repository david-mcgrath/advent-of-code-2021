var url = "https://adventofcode.com/2021/day/7/input";
var testData = `16,1,2,0,4,2,7,1,2,14`;

function getInput(isTest) {
    return isTest
        ? new Promise((resolve, reject) => resolve(testData))
        : fetch(url).then(res => res.text());
}

await getInput(false)
    .then(input => {
        input = input
            .split(",")
            .map(x => +x);

		// First, pre-process to get limits & initialise result
		var max = input.reduce((acc, x) => acc < x ? x : acc);
		var result = [];
        for (var i = 0; i < max; i++) {
            result[i] = 0;
        }
		
		// Iterate through all values, populate array with number of moves to reach that position
		// Sum these together, take the minimum
		for (var i = 0; i < input.length; i++) {
			var value = input[i];
			for (var j = 0; j < max; j++) {
				var dist = Math.abs(value - j);
				
				// Simple partial sum
				var fuel = dist * (dist + 1) / 2;
				
				result[j] += fuel;
			}
		}
		
		return result.reduce((acc, x) => acc < x ? acc : x);
    });