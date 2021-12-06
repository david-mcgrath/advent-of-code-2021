var url = "https://adventofcode.com/2021/day/2/input";
var testData = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

function getInput(isTest) {
    return isTest
        ? new Promise((resolve, reject) => resolve(testData))
        : fetch(url).then(res => res.text());
}

await getInput(false)
    .then(input => input
        .split("\n")
        .map(x => x.split(" "))
        .reduce((pos, x) => {
            var res = [pos[0], pos[1], pos[2]];
            switch (x[0]) {
                case "forward":
                    res[0] += +x[1];
					res[1] += +x[1] * pos[2];
                    break;
                case "down":
                    res[2] += +x[1];
                    break;
                case "up":
                    res[2] -= +x[1];
                    break;
            }
            return res;
        }, [0,0,0]))
	.then(res => res[0] * res[1]);