var url = "https://adventofcode.com/2021/day/5/input";
var testData = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`;

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
                .split(" -> ")
                .map(y => y
                    .split(",")
                    .map(z => +z)))
            // Filter out non horizontal / vertical lines
            .filter(x => x[0][0] === x[1][0] || x[0][1] === x[1][1]);

        var i_max = input
            .map(x => x[0][1] > x[1][1] ? x[0][1] : x[1][1])
            .reduce((a, b) => a > b ? a : b) + 1;
        var j_max = input
            .map(x => x[0][0] > x[1][0] ? x[0][0] : x[1][0])
            .reduce((a, b) => a > b ? a : b) + 1;

        var map = [];
        for (var i = 0; i < i_max; i++) {
            map[i] = [];
            for (var j = 0; j < j_max; j++) {
                map[i][j] = 0;
            }
        }

        for (var lineIndex = 0; lineIndex < input.length; lineIndex++) {
            var line = input[lineIndex];

            var i_len = Math.abs(line[1][1] - line[0][1]);
            var j_len = Math.abs(line[1][0] - line[0][0]);

            var len = i_len < j_len ? j_len : i_len;

            var delta = [(line[1][0] - line[0][0]) / len, (line[1][1] - line[0][1]) / len];

            for (var i = 0; i <= len; i++) {
                map[Math.round(line[0][1] + i * delta[1])][Math.round(line[0][0] + i * delta[0])]++;
            }
        }

        return map
            .reduce((acc, x) => acc.concat(x))
            .filter(x => x > 1)
            .length;
    });