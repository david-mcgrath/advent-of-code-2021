var url = "https://adventofcode.com/2021/day/24/input";
var testData = ``

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

class ALU {
	constructor(inputs) {
		this.w = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		
		this.InputCounter = 0;
		this.Inputs = inputs;
		
		this.Instructions = {
			inp: (v, n) => {
				if (this.InputCounter >= this.Inputs.length) {
					this.InputCounter = 0;
				}
				this[v] = this.Inputs[this.InputCounter];
				this.InputCounter++;
			},
			add: (v, n) => this[v] += n,
			mul: (v, n) => this[v] *= n,
			div: (v, n) => this[v] = Math.trunc(this[v] / n),
			mod: (v, n) => this[v] = this[v] % n,
			eql: (v, n) => this[v] === n ? 1 : 0
		}
	}
	
	init() {
		this.w = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
	
	exec(instruction, variable, number) {
		number = number === "w" || number === "x" || number === "y" || number === "z"
			? this[number]
			: +number;
		
		this.Instructions[instruction](variable, number);
	}
	
	state() {
		return this.x + "," + this.y + "," + this.z;
	}
	initFromState(state) {
		let stateValues = state.split(",").map(x => +x);
		this.w = 0;
		this.x = stateValues[0];
		this.y = stateValues[1];
		this.z = stateValues[2];
	}
	
	setInputs(inputs) {
		this.Inputs = inputs;
		this.InputCounter = 0;
	}
}

class Digit {
	constructor() {
		this.PossibleInitialStates = ["0,0,0"];
		this.DigitToState = {};
		this.SeenStates = {};
	}
}

await getInput(false)
	.then(input => {
		// input = input
			// .split("inp w") // w is always used as the input, use that to split it into more manageable chunks instead of brute forcing
			// .filter(x => x.length > 1)
			// .map(x => x
				// .split("\n")
				// .filter(x => x.length > 1)
				// .map(y => y
					// .split(" ")));
		
		// debugger;
		
		// // Get number of possible states of the ALU after each digit
		// // w is always used for the input, so we don't need to care about it
		// // Looking at the commands, x and y are also irrelevant
		// // These are the max z can be per digit and still reach zero, if it goes beyond them then we can discard those results
			// // Probably overestimating them, but try this for now
		// // This is wrong unfortunately
		// let maxZPerDigit = //[6103515625,6103515625,6103515625,6103515625,244140625,244140625,9765625,390625,390625,390625,390625,15625,625,25]
							// [9670611437,9670611437,9670611437,358170794,358170794,13265585,491318,491318,491318,491318,18197,674,25,0];

			
		
		// let alu = new ALU([9]);
		
		
		// let numberOfDigits = 14;
		// let digits = [];
		// for (let i = 0; i < numberOfDigits; i++) {
			// let curr = new Digit();
			// digits[i] = curr;
			
			// let possibleInitialStates = i > 0
				// ? Object.keys(Object.values(digits[i - 1].DigitToState).flatMap(x => Object.values(x)).reduce((a, b) => { a[b] = true; return a; }, {}))
				// : ["0,0,0"];
			// curr.PossibleInitialStates = possibleInitialStates;
			
			// for (let j = 0; j < possibleInitialStates.length; j++) {
				// let initialState = possibleInitialStates[j];
				// curr.DigitToState[initialState] = {};
				// curr.SeenStates[initialState] = {};
				
				// for (let k = 9; k >= 1; k--) {
					
					// alu.initFromState(initialState);
					// // I've now stripped out the input commands, so do it manually
					// //alu.setInputs([k]);
					// alu.w = k;
					
					// for (let n = 0; n < input[i].length; n++) {
						// alu.exec(input[i][n][0], input[i][n][1], input[i][n][2]);
					// }
					
					// let state = alu.state();
					
					// if (alu.z <= maxZPerDigit[i]) {
						// if (!curr.SeenStates[initialState][state]) {
							// curr.DigitToState[initialState][k] = state;
							// curr.SeenStates[initialState][state] = true;
						// }
					// }
					// else {
						// let test = "test";
					// }
				// }
			// }
		// }
		
		// NONE OF THIS IS REASONABLE, far too slow
		// Need to figure out what it's actually doing
		
		// 14 sections, only three operations vary between them
		// w is always used for input, x and y are set before being used
		// So z is the only state between steps
		// Some steps divide by 26, others divide by 1 (ie identity)
		// There's a conditional, based on if z % 26 +/- some number is not equal to w (varies by step)
		// If the conditional is true, then at the end z is multiplied by 26 and w + some number is added to it
		// If the conditional is false, then nothing happens other than the divisor
		
		// So three numbers are different. Let's call them divisor, modoffset, and adder (for lack of anything better, at least for now)
		
		// Digit 14: divisor = 1,  modoffset =  10, adder = 2
		// Digit 13: divisor = 1,  modoffset =  14, adder = 13
		// Digit 12: divisor = 1,  modoffset =  14, adder = 13
		// Digit 11: divisor = 26, modoffset = -13, adder = 9
		// Digit 10: divisor = 1,  modoffset =  10, adder = 15
		// Digit  9: divisor = 26, modoffset = -13, adder = 3
		// Digit  8: divisor = 26, modoffset =  -7, adder = 6
		// Digit  7: divisor = 1,  modoffset =  11, adder = 5
		// Digit  6: divisor = 1,  modoffset =  10, adder = 16
		// Digit  5: divisor = 1,  modoffset =  13, adder = 1
		// Digit  4: divisor = 26, modoffset =  -4, adder = 6
		// Digit  3: divisor = 26, modoffset =  -9, adder = 3
		// Digit  2: divisor = 26, modoffset = -13, adder = 7
		// Digit  1: divisor = 26, modoffset =  -9, adder = 9
		
		// For now let's only focus on the divisor, the others can come in later (modcheck includes modoffset, just treat adder as 0)
		// So two types, 7 of each
		
		// Digit 14 etc.: z = modcheck ? z : 26 * z + w
		// Digit 11 etc.: z = modcheck ? floor(z / 26) * 26 + w : floor(z / 26)
		
		// Digit 11 etc. looks very similar to digit 14, if we treat it as two steps then its:
		// Step 1: z = floor(z / 26)
		// Step 2: z = modcheck ? 26 * z + w (e.g. same as Digit 14 etc.)
		
		// None of the addeds are above 16, so with the max digit they're 25
		// If I treat it as a base 26 number the addition only acts on the last digit, and the rest are either shifted one digit either higher or lower
		
		// Is this a stack?
		
		// Digit 14 etc. either pushes or does nothing
		// Digit 11 etc. pops, then either pushes or does nothing
		
		// The mod offsets look a bit weird
		// All the non-negative ones are greater than 9, so no matter what w is it can't be equal to it
		// So a bunch of the conditionals aren't real
		
		// All the ones with divisor 1 are like this
		
		// So the steps are:
		
		// 14: push
		// 13: push
		// 12: push
		// 11: pop, optional push
		// 10: push
		//  9: pop, optional push
		//  8: pop, optional push
		//  7: push
		//  6: push
		//  5: push
		//  4: pop, optional push
		//  3: pop, optional push
		//  2: pop, optional push
		//  1: pop, optional push
		
		// There are equal numbers of these two types, so none of the optional pushes can be taken for it to work
		
		// So the commands are:
		
		// 14: push [w14 + 2]
		// 13: push [w13 + 13]
		// 12: push [w12 + 13]
		// 11: pop   w12 + 13 - 13 = w11
		// 10: push [w10 + 15]
		//  9: pop   w10 + 15 - 13 = w9
		//  8: pop   w13 + 13 - 7 = w8
		//  7: push [w7 + 5]
		//  6: push [w6 + 16]
		//  5: push [w5 + 1]
		//  4: pop   w5 + 1 - 4 = w4
		//  3: pop   w6 + 16 - 9 = w3
		//  2: pop   w7 + 5 - 13 = w2
		//  1: pop   w14 + 2 - 9 = w1
		
		// So the constraints are:
		
		// w14 - 7 = w1
		// w13 + 6 = w8
		// w12 = w11
		// w10 + 2 = w9
		// w7 - 8 = w2
		// w6 + 7 = w3
		// w5 - 3 = w4
		
		// These restrict the options, the valid ranges for the pushed values are:
		
		// w14: [8-9]
		// w13: [1-3]
		// w12: [1-9]
		// w10: [1-7]
		//  w7: [9]
		//  w6: [1-2]
		//  w5: [4-9]
		
		let w14_opts = [8,9];
		let w13_opts = [1,2,3];
		let w12_opts = [1,2,3,4,5,6,7,8,9];
		let w10_opts = [1,2,3,4,5,6,7];
		let w7_opts = [9];
		let w6_opts = [1,2];
		let w5_opts = [4,5,6,7,8,9];
		
		let w14 = w14_opts[w14_opts.length - 1];
		let w13 = w13_opts[w13_opts.length - 1];
		let w12 = w12_opts[w12_opts.length - 1];
		let w10 = w10_opts[w10_opts.length - 1];
		let w7 = w7_opts[w7_opts.length - 1];
		let w6 = w6_opts[w6_opts.length - 1];
		let w5 = w5_opts[w5_opts.length - 1];
		
		let w11 = w12;
		let w9 = w10 + 2;
		let w8 = w13 + 6;
		let w4 = w5 - 3;
		let w3 = w6 + 7;
		let w2 = w7 - 8;
		let w1 = w14 - 7;
		
		return [w14,w13,w12,w11,w10,w9,w8,w7,w6,w5,w4,w3,w2,w1].reduce((a, b) => a * 10 + b, 0);
	});