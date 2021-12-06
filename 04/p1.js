var url = "https://adventofcode.com/2021/day/4/input";
var testData = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`;

function getInput(isTest) {
    return isTest
        ? new Promise((resolve, reject) => resolve(testData))
        : fetch(url).then(res => res.text());
}

await getInput(false)
    .then(input => {
        input = input
            .split("\n\n");
        
        var numbers = input[0]
            .split(",")
            .map(x => +x);

        var boards = input
            .slice(1)
            .map(x => x
                .split("\n")
                .filter(x => x)
                .map(y => y
                    .split(" ")
                    .filter(z => z)
                    .map(z => +z)))
            .map(x => {
                return {
                    board: x,
                    rows: [0,0,0,0,0],
                    columns: [0,0,0,0,0]
                };
            });

        var finished = false;
        var currentNumber = 0;

        var finishedBoards = [];

        for (var i = 0; !finished && i < numbers.length; i++) {
            currentNumber = numbers[i];
            
            for (var j = 0; j < boards.length; j++) {
                for (var k = 0; k < 5; k++) {
                    for (var l = 0; l < 5; l++) {
                        if (boards[j].board[k][l] === currentNumber) {
                            boards[j].board[k][l] = null;
                            boards[j].rows[k]++;
                            boards[j].columns[l]++;

                            if (boards[j].rows[k] === 5 || boards[j].columns[l] === 5) {
                                finishedBoards.push(boards[j]);
                                finished = true;
                            }
                        }
                    }
                }
            }
        }
        
        return finishedBoards
            .map(x => x.board
                .reduce((acc, y) => acc.concat(y))
                .filter(y => y !== null)
                .map(y => y * currentNumber)
                .reduce((acc, y) => acc + y))
            .reduce((acc, x) => acc < x ? x : acc);
    });