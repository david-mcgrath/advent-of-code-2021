var url = "https://adventofcode.com/2021/day/12/input";
var testData = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

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
				if (!acc[x.name]) {
					acc[x.name] = 0;
				}
				acc[x.name]++;
			}
			return acc;
		}, {});
		this.smallCaveVisitedTwice = Object.keys(this.seenSmallCaves)
			.filter(x => this.seenSmallCaves[x] > 1)
			.length > 0;
		this.isComplete = node.isEnd;
	}
	explore() {
		return this.currentNode.links
			.filter(x => !x.isStart)
			.map(x => this.move(x))
			.filter(x => x);
	}
	move(node) {
		return !node.isSmall || !this.seenSmallCaves[node.name] || !this.smallCaveVisitedTwice ? new Path(node, this.path.concat(node)) : null;
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
		//var paths = [];
		var totalPaths = 0;
		
		while (incompletePaths.length > 0) {
			var curr = incompletePaths.pop();
			var moves = curr.explore();
			incompletePaths = incompletePaths.concat(moves.filter(x => !x.isComplete));
			//paths = paths.concat(moves.filter(x => x.isComplete));
			totalPaths += moves.filter(x => x.isComplete).length;
		}
		
		//console.log(paths.map(x => x.pathString).reduce((a,b) => a+"\n"+b));
		
		//return paths.length;
		return totalPaths;
	});