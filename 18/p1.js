var url = "https://adventofcode.com/2021/day/18/input";
var testData = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

function explode(num) {
	let depth = 0;
	let prevRegularNum = null;
	
	let completed = false;
	
	for (let i = 0; i < num.length && !completed; i++) {
		let c = num[i];
		switch (c) {
			case "[":
				depth++;
				if (depth > 4) {
					let leftValue = num[i + 1];
					let rightValue = num[i + 3];
					if (prevRegularNum !== null) {
						num[prevRegularNum] += leftValue;
					}
					for (let j = i + 6; j < num.length; j++) {
						if (!Number.isNaN(+num[j])) {
							num[j] += rightValue;
							break;
						}
					}
					
					num.splice(i, 5, 0);
					
					completed = true;
				}
				break;
			case "]":
				depth--;
				break;
			case ",":
				break;
			default:
				prevRegularNum = i;
				break;
		}
	}
	
	return completed;
}
function split(num) {
	let completed = false;
	
	for (let i = 0; i < num.length && !completed; i++) {
		let c = num[i];
		if (!Number.isNaN(+c) && c >= 10) {
			num.splice(i, 1, "[", Math.floor(c / 2), ",", Math.ceil(c / 2), "]");
			completed = true;
		}
	}
	
	return completed;
}
function reduce(num) {
	let actionTaken = true;
	while (actionTaken) {
		actionTaken = explode(num) || split(num);
	}
}

function magnitude(num) {
	function magnitude_r(num) {
		if (Array.isArray(num)) {
			return 3 * magnitude_r(num[0]) + 2 * magnitude_r(num[1]);
		}
		else {
			return num;
		}
	}
	num = JSON.parse(num.reduce((a, b) => a + b));
	return magnitude_r(num);
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n")
			.filter(x => x)
            .map(x => x
				.split("")
				.map(y => y !== "[" && y !== "]" && y !== "," ? +y : y));
		
		let result = input
			.reduce((a, b) => {
				let res = ["["].concat(a).concat(",").concat(b).concat("]");
				reduce(res);
				return res;
			});
		
		return magnitude(result);
	});