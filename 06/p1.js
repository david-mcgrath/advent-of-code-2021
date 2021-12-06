var url = "https://adventofcode.com/2021/day/6/input";
var testData = `3,4,3,1,2`;

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

        var fish = [];
        for (var i = 0; i <= 8; i++) {
            fish[i] = 0;
        }

        for (var i = 0; i < input.length; i++) {
            fish[input[i]]++;
        }

        for (var i = 0; i < 80; i++) {
            var newFish = fish[0];
            for (var j = 1; j <= 8; j++) {
                fish[j - 1] = fish[j];
            }
            fish[8] = newFish;
            fish[6] += newFish;
        }

        return fish.reduce((acc, x) => acc + x);
    });