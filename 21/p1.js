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
		
		while (score_1 < 1000 && score_2 < 1000) {
			let roll_1 = ((++die_count - 1) % 100) + 1;
			let roll_2 = ((++die_count - 1) % 100) + 1;
			let roll_3 = ((++die_count - 1) % 100) + 1;
			
			pos_1 = ((pos_1 + roll_1 + roll_2 + roll_3 - 1) % 10) + 1;
			
			score_1 += pos_1;
			
			if (score_1 < 1000) {
				roll_1 = ((++die_count - 1) % 100) + 1;
				roll_2 = ((++die_count - 1) % 100) + 1;
				roll_3 = ((++die_count - 1) % 100) + 1;
				
				pos_2 = ((pos_2 + roll_1 + roll_2 + roll_3 - 1) % 10) + 1;
				
				score_2 += pos_2;
			}
		}
		
		return (score_1 < 1000 ? score_1 : score_2) * die_count;
	});