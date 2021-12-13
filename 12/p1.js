var url = "https://adventofcode.com/2021/day/12/input";
var testData = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

class Cave {
	constructor(name) {
		this.name = name;
		this.isStart = name === "start";
		this.isEnd = name === "end";
		this.isSmall = name.toLowerCase() === name
		this.links = [];
	}
	addLink(cave) {
		this.links.push(cave);
		cave.links.push(this);
	}
}

class Path {
	constructor(node, path) {
		this.currentNode = node;
		this.path = path || [node];
		this.seenSmallCaves = this.path.reduce((acc, x) => {
			if (x.isSmall) {
				acc[x.name] = true;
			}
			return acc;
		}, {})
		this.isComplete = node.isEnd;
	}
	explore() {
		return this.currentNode.links
			.map(x => this.move(x))
			.filter(x => x);
	}
	move(node) {
		return !this.seenSmallCaves[node.name] ? new Path(node, this.path.concat(node)) : null;
	}
	get pathString() {
		return this.path
			.map(x => x.name)
			.reduce((a,b) => a + "," + b);
	}
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n")
			.filter(x => x)
            .map(x => x
                .split("-"));
		
		var caves = {
			"start": new Cave("start"),
			"end": new Cave("end")
		};
		
		input
			.forEach(x => {
				if (!caves[x[0]]) {
					caves[x[0]] = new Cave(x[0]);
				}
				if (!caves[x[1]]) {
					caves[x[1]] = new Cave(x[1]);
				}
				
				caves[x[0]].addLink(caves[x[1]]);
			});
		
		var incompletePaths = [new Path(caves["start"])];
		var paths = [];
		
		while (incompletePaths.length > 0) {
			var curr = incompletePaths.pop();
			var moves = curr.explore();
			incompletePaths = incompletePaths.concat(moves.filter(x => !x.isComplete));
			paths = paths.concat(moves.filter(x => x.isComplete));
		}
		
		//console.log(paths.map(x => x.pathString).reduce((a,b) => a+"\n"+b));
		
		return paths.length;
	});