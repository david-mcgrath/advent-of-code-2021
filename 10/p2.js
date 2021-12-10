var url = "https://adventofcode.com/2021/day/10/input";
var testData = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>({([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;

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
			.map(x => x.split(""));
			
		var openChars = "([{<";
		var closeChars = ")]}>";
		
		var isOpenChar = {};
		var charMap = {};
		
		for (var i = 0; i < openChars.length; i++) {
			isOpenChar[openChars[i]] = true;
			charMap[closeChars[i]] = openChars[i];
		}

		var validAutoComplete = [];

		var illegal = [];
		for (var i = 0; i < input.length; i++) {
			var stack = [];
			var failed = false;
			for (var j = 0; j < input[i].length && !failed; j++) {
				if (isOpenChar[input[i][j]]) {
					stack.push(input[i][j]);
				}
				else if (stack.pop() !== charMap[input[i][j]]) {
					failed = true;
				}
			}
			
			if (!failed) {
				validAutoComplete.push(stack.reverse());
			}
		}

		// ): 1
		// ]: 2
		// }: 3
		// >: 4

		// 288957
		var scoreMap = {
			'(': 1,
			'[': 2,
			'{': 3,
			'<': 4
		};
		var scores = validAutoComplete
			.map(x => x
				.map(y => scoreMap[y])
				.reduce((acc, x) => 5 * acc + x, 0));

		scores.sort((a, b) => a - b);

		return scores[scores.length >> 1];
	});
