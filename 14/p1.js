var url = "https://adventofcode.com/2021/day/14/input";
var testData = `NNCB

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

class Link {
	constructor(value) {
		this.value = value;
		this.next = null;
	}
	insert(value) {
		var tmp = this.next;
		this.next = new Link(value);
		this.next.next = tmp;
		return this.next;
	}
	get pair() {
		return this.next ? this.value + this.next.value : null;
	}
	get string() {
		return this.next ? this.value + this.next.string : this.value;
	}
}

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n\n");
		
		var polymerTemplate = input[0];
		var rules = input[1]
			.split("\n")
			.filter(x => x)
			.map(x => x
				.split(" -> "))
			.reduce((acc, x) => {
				acc[x[0]] = x[1];
				return acc;
			}, {});
		
		// Just a simple implementation, inserting the character each time
		var root = new Link(polymerTemplate[0]);
		var curr = root;
		for (var i = 1; i < polymerTemplate.length; i++) {
			curr = curr.insert(polymerTemplate[i]);
		}
		
		for (var i = 0; i < 10; i++) {
			curr = root;
			while (curr !== null) {
				var next = curr.next;
				var pair = curr.pair;
				if (rules[pair]) {
					curr.insert(rules[pair]);
				}
				curr = next;
			}
		}
		
		var result = {};
		for (curr = root; curr !== null; curr = curr.next) {
			if (!result[curr.value]) {
				result[curr.value] = 0;
			}
			
			result[curr.value]++;
		}
		
		return Math.max(...Object.values(result)) - Math.min(...Object.values(result));
	});