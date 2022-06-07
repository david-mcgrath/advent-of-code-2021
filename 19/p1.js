var url = "https://adventofcode.com/2021/day/19/input";
var testData = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(true)
	.then(input => {
		input = input
			.split("\n\n")
			.map((x, id) => {
				let lines = x
					.split("\n")
					.filter(x => x);
				let scanner = parseInt(lines.shift().split(" scanner ")[1]);
				let beacons = lines
					.map(x => x
						.split(",")
						.map(x => +x));
				
				return {
					id: id,
					scanner: scanner,
					beacons: beacons.map(x => {
						return {
							x: x[0],
							y: x[1],
							z: x[2]
						};
					})
				};
			});
			
		// This whole thing is janky, was horribly painful, and burned out my motivation for AoC this year. But it's done.
		// There's definitely a better way to do it.
		
		let facings = [
			(x, y, z) => { return { x: x, y: y, z: z }; },
			(x, y, z) => { return { x: y, y: -x, z: z }; },
			(x, y, z) => { return { x: -x, y: -y, z: z }; },
			(x, y, z) => { return { x: -y, y: x, z: z }; },
			(x, y, z) => { return { x: z, y: y, z: -x }; },
			(x, y, z) => { return { x: -z, y: x, z: x }; }
		];
		
		let rotations = [
			(x, y, z) => { return { x: x, y: y, z: z }; },
			(x, y, z) => { return { x: x, y: z, z: -y }; },
			(x, y, z) => { return { x: x, y: -y, z: -z }; },
			(x, y, z) => { return { x: x, y: -z, z: y }; }
		];
		
		let orientations = facings
			.flatMap(f => rotations
				.map(r => (a) => {
					let tmp = f(a.x, a.y, a.z);
					return r(tmp.x, tmp.y, tmp.z);
				}));
		
		function processScanners(scanners) {
			return scanners
				.map(s => {
					return {
						id: s.id,
						scanner: s.scanner,
						beacons: s.beacons,
						beaconDistanceSquared: s.beacons
						.map(x =>
							s.beacons
								.map(y =>
									(x.x - y.x) * (x.x - y.x) + (x.y - y.y) * (x.y - y.y) + (x.z - y.z) * (x.z - y.z)))
					};
				});
		}
		
		let scanners = processScanners(input);
		
		while (scanners.length > 1) {
			let pairs = scanners
				.map(x => scanners
					.filter(y => x.id < y.id)
					.map(y => [x, y]))
				.reduce((a, b) => a.concat(b))
				.map(pair => {
					let matches = null;
					
					// TODO: This iteration is the main slow bit, need to speed it up but for now it's working.
					// Probably required for p2
					for (var i = 0; i < pair[0].beacons.length && !matches; i++) {
						for (var j = 0; j < pair[1].beacons.length && !matches; j++) {
							// These are preliminary matches, from a single distance.
							// If at least three matches have matching distances to each other, they can be used as a source of truth
							let prelimMatches = pair[0].beaconDistanceSquared[i]
								.map((x, _i) => pair[1].beaconDistanceSquared[j]
									.map((y, _j) => [_i, _j, x, y]))
								.reduce((a, b) => a.concat(b))
								.filter(z => z[0] !== i && z[1] !== j)
								.filter(z => z[2] === z[3])
								.map(z => [z[0], z[1]]);
							
							// Looking for an overlap of at least 12, so can discard any where that won't be possible
							if (prelimMatches.length < 11)
								continue;
							
							// Try to find a quadruple, use [i, j] with distance of 0 as a base
							// Since we've already checked the distances from [i, j] we only need to check between the three new ones
							// Technically this is wrong, because if they're all colinear then it will give two points... but that's fine, come on. It probably won't even get here if it's not a match
							let quads = prelimMatches
								.map(x => prelimMatches
									.map(y => prelimMatches
										.map(z => [x, y, z])))
								.reduce((a, b) => a.concat(b))
								.reduce((a, b) => a.concat(b))
								.filter(quad => quad[0][0] !== quad[1][0] && quad[0][1] !== quad[1][1] &&
												quad[0][0] !== quad[2][0] && quad[0][1] !== quad[2][1] &&
												quad[1][0] !== quad[2][0] && quad[1][1] !== quad[2][1])
								.filter(quad => pair[0].beaconDistanceSquared[quad[0][0]][quad[1][0]] === pair[1].beaconDistanceSquared[quad[0][1]][quad[1][1]] &&
												pair[0].beaconDistanceSquared[quad[0][0]][quad[2][0]] === pair[1].beaconDistanceSquared[quad[0][1]][quad[2][1]] &&
												pair[0].beaconDistanceSquared[quad[1][0]][quad[2][0]] === pair[1].beaconDistanceSquared[quad[1][1]][quad[2][1]]);
							
							// If there are no valid quadruples, then a pair isn't possible
							if (quads.length === 0)
								continue;
							
							let quad = quads[0];
							
							// Filter the prelim matches based on their distance from the other points in the quadruple matching too
							let finalMatches = prelimMatches
								.filter(match => pair[0].beaconDistanceSquared[match[0]][quad[0][0]] === pair[1].beaconDistanceSquared[match[1]][quad[0][1]] &&
												pair[0].beaconDistanceSquared[match[0]][quad[1][0]] === pair[1].beaconDistanceSquared[match[1]][quad[1][1]] &&
												pair[0].beaconDistanceSquared[match[0]][quad[2][0]] === pair[1].beaconDistanceSquared[match[1]][quad[2][1]]);
							
							if (finalMatches.length < 11)
								continue;
							
							matches = [[i, j]].concat(finalMatches);
						}
					}
					
					return matches
						? {
							pair0: pair[0],
							pair1: pair[1],
							pointMap: matches
						}
						: null;
				})
				.filter(x => x);
			
			// Merge pairs of scanners
			let changedScanners = {};
			let mergedScanners = [];
			
			if (pairs.length === 0) {
				// This should only happen if there's an error
				// throw "No pairs found.";
			}
			
			for (let i = 0; i < pairs.length; i++) {
				let pair = pairs[i];
				
				// Check that neither have already been changed
				if (changedScanners[pair.pair0.scanner] || changedScanners[pair.pair1.scanner]) {
					continue;
				}
				
				// Need to find a matching orientation
				// Treat pair0 as being at (0,0) with the correct orientation
				let found = false;
				for (let j = 0; j < orientations.length; j++) {
					let orientation = orientations[j];
					let basePoints = pair.pointMap[0];			

					let base0 = pair.pair0.beacons[basePoints[0]];
					let base1 = orientation(pair.pair1.beacons[basePoints[1]]);
					
					let position = b => {
						let oriented = orientation(b)
						return {
							x: base0.x - base1.x + oriented.x,
							y: base0.y - base1.y + oriented.y,
							z: base0.z - base1.z + oriented.z
						};
					};
					
					let failed = false;
					for (let k = 0; k < pair.pointMap.length; k++) {
						let map = pair.pointMap[k];
						let check0 = pair.pair0.beacons[map[0]];
						let check1 = position(pair.pair1.beacons[map[1]]);
						
						if (check0.x !== check1.x || check0.y !== check1.y || check0.z !== check1.z) {
							failed = true;
							break;
						}
					}
					
					if (!failed) {
						// Found the orientation, merge
						changedScanners[pair.pair0.scanner] = true;
						changedScanners[pair.pair1.scanner] = true;
						let merged = {
							id: pair.pair0.id,
							scanner: pair.pair0.scanner,
							beacons: pair.pair0.beacons.map(b => { return { x: b.x, y: b.y, z: b.z }; })
						};
						let matchingPoints = pair.pointMap.map(x => x[1]).reduce((a, b) => { a[b] = true; return a; }, {});
						
						for (let k = 0; k < pair.pair1.beacons.length; k++) {
							if (!matchingPoints[k]) {
								merged.beacons.push(position(pair.pair1.beacons[k]));
							}
						}
						
						mergedScanners.push(merged);
					}
				}
			}
			
			scanners = scanners.filter(x => !changedScanners[x.scanner]).concat(processScanners(mergedScanners));
			
			// Backup, in case they can't all be merged... I don't think this should be the case, but we'll see. One might be outside of the range?
			if (mergedScanners.length === 0) {
				debugger;
				break;
			}
		}
		
		return scanners.map(x => x.beacons.length).reduce((a, b) => a + b);
	});