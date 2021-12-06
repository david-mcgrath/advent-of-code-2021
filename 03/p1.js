var url = "https://adventofcode.com/2021/day/3/input";
var testData = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

function getInput(isTest) {
    return isTest
        ? new Promise((resolve, reject) => resolve(testData))
        : fetch(url).then(res => res.text());
}

await getInput(false)
    .then(input => input
        .split("\n")
        .filter(x => x.length > 0)
        .map(x => x
            .split("")
            .map(y => y === "1" ? 1 : -1))
        .reduce((a, b) => a
            .map((x, i) => x + b[i]))
        .map(x => x > 0 ? [1, 0] : [0, 1])
        .reduce((acc, x) => [acc[0] * 2 + x[0], acc[1] * 2 + x[1]])
        .reduce((acc, x) => acc * x));