var url = "https://adventofcode.com/2021/day/24/input";
var testData = ``

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		let w14_opts = [8,9];
		let w13_opts = [1,2,3];
		let w12_opts = [1,2,3,4,5,6,7,8,9];
		let w10_opts = [1,2,3,4,5,6,7];
		let w7_opts = [9];
		let w6_opts = [1,2];
		let w5_opts = [4,5,6,7,8,9];
		
		let w14 = w14_opts[0];
		let w13 = w13_opts[0];
		let w12 = w12_opts[0];
		let w10 = w10_opts[0];
		let w7 = w7_opts[0];
		let w6 = w6_opts[0];
		let w5 = w5_opts[0];
		
		let w11 = w12;
		let w9 = w10 + 2;
		let w8 = w13 + 6;
		let w4 = w5 - 3;
		let w3 = w6 + 7;
		let w2 = w7 - 8;
		let w1 = w14 - 7;
		
		return [w14,w13,w12,w11,w10,w9,w8,w7,w6,w5,w4,w3,w2,w1].reduce((a, b) => a * 10 + b, 0);
	});