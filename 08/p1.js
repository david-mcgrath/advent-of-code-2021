var url = "https://adventofcode.com/2021/day/8/input";
var testData = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`;

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
            .map(x => x
				.split(" | ")
				.map(y => y
					.split(" ")));
			
		return input
            .map(x => x[1])
            .reduce((a,b) => a.concat(b))
            .filter(x => x.length === 2 || x.length === 3 || x.length === 4 || x.length === 7)
            .length;
    });
