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
    .then(input => {
        input = input
            .split("\n")
            .filter(x => x.length > 0)
            .map(x => x
                .split("")
                .map(y => +y));
        
        return [input,input].map((x, i) => {
            var res = x;
            for (var filterIndex = 0; res.length > 1; filterIndex++) {
                var mask = res
                    .map(y => y[filterIndex])
                    .map(y => 2 * y - 1)
                    .reduce((a, b) => a + b);
                
                mask = mask < 0 ? 0 : 1;
                if (i) {
                    mask = 1 - mask;
                }

                res = res.filter(y => y[filterIndex] === mask);
            }
            return res[0];
        })
            .map(x => x
                .reduce((a, b) => 2 * a + b))
            .reduce((a, b) => a * b);
    });