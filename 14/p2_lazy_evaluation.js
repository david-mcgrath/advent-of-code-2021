/**
 * I decided I wanted to see how slow the part 1 solution would be if there were no memory constraints.
 * This uses lazy evaluation to count the number of each character without requiring them to be held in memory.
 * It is, unsurprisingly, extremely slow.
 */

let url = "https://adventofcode.com/2021/day/14/input";
let testData = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

class PerformanceMonitor {
	constructor() {
		this.t0 = performance.now();
		this.t1 = null;
	}
	stop() {
		this.t1 = performance.now();
	}
	reset() {
		this.t0 = performance.now();
		this.t1 = null;
	}
	elapsedTime() {
		return (this.t1 || performance.now()) - this.t0;
	}
	readableTime() {
		let ms = Math.floor(this.elapsedTime());
		let s = Math.floor(ms / 1000);
		let m = Math.floor(s / 60);
		let h = Math.floor(m / 60);
		let d = Math.floor(h / 24);
		
		return d > 1
			? `${d} day(s) ${h - d * 24} hour(s)`
			: h > 1
				? `${h} hour(s) ${m - h * 60} minute(s)`
				: m > 1
					? `${m} minute(s) ${s - m * 60} second(s)`
					: s > 1
						? `${s} second(s) ${ms - s * 1000} millisecond(s)`
						: `${ms} millisecond(s)`
	}
}

class ProgressBar {
	constructor(total, precision) {
		this.total = total;
		this.precision = precision || 100;
		this.current = 0;
		this.prefixLines = [];
		this.suffixLines = [];
		console.clear();
	}
	update(current) {
		this.current = current;
		console.clear();
		
		for (let line of this.prefixLines) {
			console.log(line);
		}
		
		let percentage = 100 * this.current / this.total;
		let progress = this.precision * this.current / this.total;
		
		let progressBar = "";
		for (let i = 0; i < this.precision; i++) {
			progressBar += progress >= i + 1 ? "█" : progress >= i + 0.5 ? "▀" : " ";
		}
		
		console.log(`|${progressBar}|(${percentage.toFixed(2)})%`);
		
		for (let line of this.suffixLines) {
			console.log(line);
		}
	}
	writePrefix(line) {
		this.prefixLines.push(line);
		this.update(this.current);
	}
	writeSuffix(line) {
		this.suffixLines.push(line);
		this.update(this.current);
	}
}

class PolymerTemplate {
	constructor(template, rules) {
		this.template = template.split("");
		this.rules = rules;
	}
	*generate(depth) {
		if (this.template.length > 0) {		
			for (let i = 0; i < this.template.length - 1; i++) {
				yield this.template[i];
				
				let pair = this.template[i] + this.template[i + 1];
				
				yield* this.generateFromPair(pair, depth);
			}
			
			yield this.template[this.template.length - 1];
		}
	}
	*generateFromPair(pair, depth) {
		if (depth > 0) {
			let newCharacter = this.rules[pair];
			
			if (newCharacter) {
				let pair1 = pair[0] + newCharacter;
				let pair2 = newCharacter + pair[1];
				
				yield* this.generateFromPair(pair1, depth - 1);
				yield newCharacter;
				yield* this.generateFromPair(pair2, depth - 1);
			}
		}
	}
}

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(true)
	.then(async input => {
		let depth = 40;
		let progressUpdateFrequency = Math.max(8192, Math.min(Math.pow(2, depth - 4), 262144));
		
		input = input
			.split("\n\n");
		
		let template = input[0];
		let rules = input[1]
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(" -> "))
			.reduce((acc, x) => {
				acc[x[0]] = x[1];
				return acc;
			}, {});
		
		let polymerTemplate = new PolymerTemplate(template, rules);
		
		let estimatedTotal = template.length + (template.length - 1) * (Math.pow(2, depth) - 1);
		
		let result = {};
		let current = 0;
		
		let progress = new ProgressBar(estimatedTotal);
		progress.writePrefix("Polymer Generation progress:");
		await sleep(0);
		
		let pm = new PerformanceMonitor();
		
		let curr = 0;
		let iterator = polymerTemplate.generate(depth);
		
		
		for (let character of polymerTemplate.generate(depth)) {
			result[character] = (result[character] || 0) + 1;
			curr++;
			
			if (curr % progressUpdateFrequency === 0) {
				progress.update(curr);
				await sleep(0);
			}
		}
		
		pm.stop();
		
		progress.update(estimatedTotal);
		progress.writeSuffix(`Completed. Total time elapsed: ${pm.readableTime()}`);
		progress.writeSuffix(`Total polymer length: ${Object.values(result).reduce((a, b) => a + b)}`);
		
		return Math.max(...Object.values(result)) - Math.min(...Object.values(result));
	});