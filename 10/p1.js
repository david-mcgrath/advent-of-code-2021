var url = "https://adventofcode.com/2021/day/10/input";
var testData = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
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
		
		var illegal = [];
		for (var i = 0; i < input.length; i++) {
			var stack = [];
			var failed = false;
			for (var j = 0; j < input[i].length && !failed; j++) {
				if (isOpenChar[input[i][j]]) {
					stack.push(input[i][j]);
				}
				else if (stack.pop() !== charMap[input[i][j]]) {
					illegal.push(input[i][j]);
					failed = true;
				}
			}
		}

		// ): 3
		// ]: 57
		// }: 1197
		// >: 25137

		// 26397
		var result = illegal
				.reduce((acc, x) => {
					if (!acc[x]) acc[x] = 0;
					acc[x]++;
					return acc;
				}, {});
		
		return (result[')'] || 0) * 3 +
			(result[']'] || 0) * 57 +
			(result['}'] || 0) * 1197 +
			(result['>'] || 0) * 25137;
	});