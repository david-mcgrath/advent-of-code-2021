var url = "https://adventofcode.com/2021/day/21/input";
var testData = `Player 1 starting position: 4
Player 2 starting position: 8`

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
            .map(x => +x.split(": ")[1]);
		
		let die_count = 0;
		
		let score_1 = 0;
		let score_2 = 0;
		
		let pos_1 = input[0];
		let pos_2 = input[1];
		
		// options:
		// 3: 1
		// 4: 3
		// 5: 6
		// 6: 7
		// 7: 6
		// 8: 3
		// 9: 1
		
		let p1_wins = 0;
		let p2_wins = 0;
		
		let universes = [{ player_turn: 1, score_1: 0, score_2: 0, pos_1: input[0], pos_2: input[1], count: 1, die_count: 0 }];
		
		while (universes.length > 0) {
			let curr = universes.pop();
			
			let roll_options = [[3,1],[4,3],[5,6],[6,7],[7,6],[8,3],[9,1]];
			
			let result = roll_options
				.map(x => {
					if (curr.player_turn === 1) {
						return {
							player_turn: 2,
							score_1: curr.score_1 + ((curr.pos_1 + x[0] - 1) % 10) + 1,
							score_2: curr.score_2,
							pos_1: ((curr.pos_1 + x[0] - 1) % 10) + 1,
							pos_2: curr.pos_2,
							count: x[1] * curr.count,
							die_count: curr.die_count + 3
						};
					}
					else {
						return {
							player_turn: 1,
							score_1: curr.score_1,
							score_2: curr.score_2 + ((curr.pos_2 + x[0] - 1) % 10) + 1,
							pos_1: curr.pos_1,
							pos_2: ((curr.pos_2 + x[0] - 1) % 10) + 1,
							count: x[1] * curr.count,
							die_count: curr.die_count + 3
						};
					}
				});
			
			p1_wins += result.filter(x => x.score_1 >= 21).map(x => x.count).reduce((a, b) => a + b, 0);
			p2_wins += result.filter(x => x.score_2 >= 21).map(x => x.count).reduce((a, b) => a + b, 0);
			
			universes = universes.concat(result.filter(x => x.score_1 < 21 && x.score_2 < 21));
		}
		
		return p1_wins > p2_wins ? p1_wins : p2_wins;
	});